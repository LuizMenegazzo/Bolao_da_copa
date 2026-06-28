const fs = require("fs");
const path = require("path");

const CARTELAS_FILE = path.join(__dirname, "data", "cartelas.json");
const RESULTS_FILE = path.join(__dirname, "data", "results.json");
const KNOCKOUT_PLAYERS_FILE = path.join(__dirname, "data", "knockout-players.json");
const KNOCKOUT_PREDICTIONS_FILE = path.join(__dirname, "data", "knockout-predictions.json");
const KNOCKOUT_MATCHES_FILE = path.join(__dirname, "data", "knockout-matches.json");
const KNOCKOUT_RESULTS_FILE = path.join(__dirname, "data", "knockout-results.json");
const DATABASE_URL = process.env.DATABASE_URL;

let pool;

function readJsonFile(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
  } catch (error) {
    return fallback;
  }
}

function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function getPool() {
  if (!DATABASE_URL) {
    return null;
  }

  if (!pool) {
    const { Pool } = require("pg");
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: process.env.DB_SSL === "false" ? false : { rejectUnauthorized: false }
    });
  }

  return pool;
}

async function initStorage() {
  const database = getPool();

  if (!database) {
    return;
  }

  await database.query(`
    CREATE TABLE IF NOT EXISTS cartelas (
      id TEXT PRIMARY KEY,
      player_name TEXT NOT NULL,
      predictions JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ
    )
  `);

  await database.query(`
    CREATE TABLE IF NOT EXISTS results (
      match_id TEXT PRIMARY KEY,
      home_score INTEGER NOT NULL,
      away_score INTEGER NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await database.query(`
    CREATE TABLE IF NOT EXISTS knockout_players (
      player_key TEXT PRIMARY KEY,
      player_name TEXT NOT NULL,
      password_hash TEXT,
      password_salt TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ
    )
  `);

  await database.query(`
    CREATE TABLE IF NOT EXISTS knockout_predictions (
      player_key TEXT PRIMARY KEY REFERENCES knockout_players(player_key) ON DELETE CASCADE,
      predictions JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await database.query(`
    CREATE TABLE IF NOT EXISTS knockout_matches (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await database.query(`
    CREATE TABLE IF NOT EXISTS knockout_results (
      match_id TEXT PRIMARY KEY,
      home_score INTEGER NOT NULL,
      away_score INTEGER NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await migrateJsonToDatabase(database);
}

async function getCartelas() {
  const database = getPool();

  if (!database) {
    return readJsonFile(CARTELAS_FILE, []);
  }

  const { rows } = await database.query(`
    SELECT id, player_name, predictions, created_at, updated_at
    FROM cartelas
    ORDER BY created_at ASC
  `);

  return rows.map(mapCartelaRow);
}

async function createCartela(cartela) {
  const database = getPool();

  if (!database) {
    const cartelas = readJsonFile(CARTELAS_FILE, []);
    cartelas.push(cartela);
    writeJsonFile(CARTELAS_FILE, cartelas);
    return cartela;
  }

  const { rows } = await database.query(
    `
      INSERT INTO cartelas (id, player_name, predictions, created_at)
      VALUES ($1, $2, $3, $4)
      RETURNING id, player_name, predictions, created_at, updated_at
    `,
    [cartela.id, cartela.playerName, JSON.stringify(cartela.predictions), cartela.createdAt]
  );

  return mapCartelaRow(rows[0]);
}

async function updateCartela(cartelaId, updates) {
  const database = getPool();

  if (!database) {
    const cartelas = readJsonFile(CARTELAS_FILE, []);
    const cartelaIndex = cartelas.findIndex((cartela) => cartela.id === cartelaId);

    if (cartelaIndex === -1) {
      return null;
    }

    cartelas[cartelaIndex] = {
      ...cartelas[cartelaIndex],
      ...updates
    };
    writeJsonFile(CARTELAS_FILE, cartelas);
    return cartelas[cartelaIndex];
  }

  const { rows } = await database.query(
    `
      UPDATE cartelas
      SET player_name = $2,
          predictions = $3,
          updated_at = $4
      WHERE id = $1
      RETURNING id, player_name, predictions, created_at, updated_at
    `,
    [cartelaId, updates.playerName, JSON.stringify(updates.predictions), updates.updatedAt]
  );

  return rows[0] ? mapCartelaRow(rows[0]) : null;
}

async function deleteCartela(cartelaId) {
  const database = getPool();

  if (!database) {
    const cartelas = readJsonFile(CARTELAS_FILE, []);
    const filteredCartelas = cartelas.filter((cartela) => cartela.id !== cartelaId);

    if (filteredCartelas.length === cartelas.length) {
      return false;
    }

    writeJsonFile(CARTELAS_FILE, filteredCartelas);
    return true;
  }

  const result = await database.query("DELETE FROM cartelas WHERE id = $1", [cartelaId]);
  return result.rowCount > 0;
}

async function getResults() {
  const database = getPool();

  if (!database) {
    return readJsonFile(RESULTS_FILE, {});
  }

  const { rows } = await database.query(`
    SELECT match_id, home_score, away_score, updated_at
    FROM results
    ORDER BY match_id ASC
  `);

  return rows.reduce((results, row) => {
    results[row.match_id] = {
      homeScore: row.home_score,
      awayScore: row.away_score,
      updatedAt: row.updated_at.toISOString()
    };
    return results;
  }, {});
}

async function updateResults(resultsPatch) {
  const database = getPool();

  if (!database) {
    const currentResults = readJsonFile(RESULTS_FILE, {});

    for (const [matchId, result] of Object.entries(resultsPatch)) {
      if (result === null) {
        delete currentResults[matchId];
      } else {
        currentResults[matchId] = {
          ...result,
          updatedAt: new Date().toISOString()
        };
      }
    }

    writeJsonFile(RESULTS_FILE, currentResults);
    return currentResults;
  }

  const client = await database.connect();

  try {
    await client.query("BEGIN");

    for (const [matchId, result] of Object.entries(resultsPatch)) {
      if (result === null) {
        await client.query("DELETE FROM results WHERE match_id = $1", [matchId]);
      } else {
        await client.query(
          `
            INSERT INTO results (match_id, home_score, away_score, updated_at)
            VALUES ($1, $2, $3, NOW())
            ON CONFLICT (match_id)
            DO UPDATE SET home_score = EXCLUDED.home_score,
                          away_score = EXCLUDED.away_score,
                          updated_at = NOW()
          `,
          [matchId, result.homeScore, result.awayScore]
        );
      }
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return getResults();
}

async function getKnockoutPlayers() {
  const database = getPool();

  if (!database) {
    return readJsonFile(KNOCKOUT_PLAYERS_FILE, {});
  }

  const { rows } = await database.query(`
    SELECT player_key, player_name, password_hash, password_salt, created_at, updated_at
    FROM knockout_players
    ORDER BY player_name ASC
  `);

  return rows.reduce((players, row) => {
    players[row.player_key] = mapKnockoutPlayerRow(row);
    return players;
  }, {});
}

async function upsertKnockoutPlayer(player) {
  const database = getPool();

  if (!database) {
    const players = readJsonFile(KNOCKOUT_PLAYERS_FILE, {});
    players[player.playerKey] = {
      ...players[player.playerKey],
      ...player,
      updatedAt: new Date().toISOString()
    };
    writeJsonFile(KNOCKOUT_PLAYERS_FILE, players);
    return players[player.playerKey];
  }

  const { rows } = await database.query(
    `
      INSERT INTO knockout_players (player_key, player_name, password_hash, password_salt, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (player_key)
      DO UPDATE SET player_name = EXCLUDED.player_name,
                    password_hash = COALESCE(EXCLUDED.password_hash, knockout_players.password_hash),
                    password_salt = COALESCE(EXCLUDED.password_salt, knockout_players.password_salt),
                    updated_at = NOW()
      RETURNING player_key, player_name, password_hash, password_salt, created_at, updated_at
    `,
    [player.playerKey, player.playerName, player.passwordHash || null, player.passwordSalt || null]
  );

  return mapKnockoutPlayerRow(rows[0]);
}

async function resetKnockoutPlayerPassword(playerKey, playerName) {
  const database = getPool();

  if (!database) {
    const players = readJsonFile(KNOCKOUT_PLAYERS_FILE, {});
    players[playerKey] = {
      ...players[playerKey],
      playerKey,
      playerName,
      passwordHash: null,
      passwordSalt: null,
      updatedAt: new Date().toISOString()
    };
    writeJsonFile(KNOCKOUT_PLAYERS_FILE, players);
    return players[playerKey];
  }

  const { rows } = await database.query(
    `
      INSERT INTO knockout_players (player_key, player_name, password_hash, password_salt, created_at, updated_at)
      VALUES ($1, $2, NULL, NULL, NOW(), NOW())
      ON CONFLICT (player_key)
      DO UPDATE SET player_name = EXCLUDED.player_name,
                    password_hash = NULL,
                    password_salt = NULL,
                    updated_at = NOW()
      RETURNING player_key, player_name, password_hash, password_salt, created_at, updated_at
    `,
    [playerKey, playerName]
  );

  return mapKnockoutPlayerRow(rows[0]);
}

async function getKnockoutPredictions() {
  const database = getPool();

  if (!database) {
    return readJsonFile(KNOCKOUT_PREDICTIONS_FILE, {});
  }

  const { rows } = await database.query("SELECT player_key, predictions, updated_at FROM knockout_predictions");

  return rows.reduce((predictions, row) => {
    predictions[row.player_key] = {
      predictions: row.predictions,
      updatedAt: row.updated_at.toISOString()
    };
    return predictions;
  }, {});
}

async function updateKnockoutPredictions(playerKey, predictions) {
  const database = getPool();

  if (!database) {
    const allPredictions = readJsonFile(KNOCKOUT_PREDICTIONS_FILE, {});
    allPredictions[playerKey] = {
      predictions,
      updatedAt: new Date().toISOString()
    };
    writeJsonFile(KNOCKOUT_PREDICTIONS_FILE, allPredictions);
    return allPredictions[playerKey];
  }

  const { rows } = await database.query(
    `
      INSERT INTO knockout_predictions (player_key, predictions, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (player_key)
      DO UPDATE SET predictions = EXCLUDED.predictions,
                    updated_at = NOW()
      RETURNING player_key, predictions, updated_at
    `,
    [playerKey, JSON.stringify(predictions)]
  );

  return {
    predictions: rows[0].predictions,
    updatedAt: rows[0].updated_at.toISOString()
  };
}

async function getKnockoutMatches() {
  const database = getPool();

  if (!database) {
    return readJsonFile(KNOCKOUT_MATCHES_FILE, []);
  }

  const { rows } = await database.query("SELECT payload FROM knockout_matches ORDER BY payload->>'date' ASC");
  return rows.map((row) => row.payload);
}

async function upsertKnockoutMatches(matches) {
  const database = getPool();

  if (!database) {
    const currentMatches = readJsonFile(KNOCKOUT_MATCHES_FILE, []);
    const matchesById = new Map(currentMatches.map((match) => [match.id, match]));

    for (const match of matches) {
      matchesById.set(match.id, match);
    }

    const nextMatches = [...matchesById.values()].sort((first, second) => String(first.date).localeCompare(String(second.date)));
    writeJsonFile(KNOCKOUT_MATCHES_FILE, nextMatches);
    return nextMatches;
  }

  const client = await database.connect();

  try {
    await client.query("BEGIN");

    for (const match of matches) {
      await client.query(
        `
          INSERT INTO knockout_matches (id, payload, updated_at)
          VALUES ($1, $2, NOW())
          ON CONFLICT (id)
          DO UPDATE SET payload = EXCLUDED.payload,
                        updated_at = NOW()
        `,
        [match.id, JSON.stringify(match)]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return getKnockoutMatches();
}

async function getKnockoutResults() {
  const database = getPool();

  if (!database) {
    return readJsonFile(KNOCKOUT_RESULTS_FILE, {});
  }

  const { rows } = await database.query("SELECT match_id, home_score, away_score, updated_at FROM knockout_results");

  return rows.reduce((results, row) => {
    results[row.match_id] = {
      homeScore: row.home_score,
      awayScore: row.away_score,
      updatedAt: row.updated_at.toISOString()
    };
    return results;
  }, {});
}

async function updateKnockoutResults(resultsPatch) {
  const database = getPool();

  if (!database) {
    const currentResults = readJsonFile(KNOCKOUT_RESULTS_FILE, {});

    for (const [matchId, result] of Object.entries(resultsPatch)) {
      currentResults[matchId] = {
        ...result,
        updatedAt: new Date().toISOString()
      };
    }

    writeJsonFile(KNOCKOUT_RESULTS_FILE, currentResults);
    return currentResults;
  }

  const client = await database.connect();

  try {
    await client.query("BEGIN");

    for (const [matchId, result] of Object.entries(resultsPatch)) {
      await client.query(
        `
          INSERT INTO knockout_results (match_id, home_score, away_score, updated_at)
          VALUES ($1, $2, $3, NOW())
          ON CONFLICT (match_id)
          DO UPDATE SET home_score = EXCLUDED.home_score,
                        away_score = EXCLUDED.away_score,
                        updated_at = NOW()
        `,
        [matchId, result.homeScore, result.awayScore]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return getKnockoutResults();
}

function mapCartelaRow(row) {
  return {
    id: row.id,
    playerName: row.player_name,
    predictions: row.predictions,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at ? row.updated_at.toISOString() : undefined
  };
}

function mapKnockoutPlayerRow(row) {
  return {
    playerKey: row.player_key,
    playerName: row.player_name,
    passwordHash: row.password_hash || undefined,
    passwordSalt: row.password_salt || undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at ? row.updated_at.toISOString() : undefined
  };
}

async function migrateJsonToDatabase(database) {
  const cartelasCount = await database.query("SELECT COUNT(*)::int AS count FROM cartelas");
  const resultsCount = await database.query("SELECT COUNT(*)::int AS count FROM results");

  if (cartelasCount.rows[0].count === 0) {
    const cartelas = readJsonFile(CARTELAS_FILE, []);

    for (const cartela of cartelas) {
      await database.query(
        `
          INSERT INTO cartelas (id, player_name, predictions, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id) DO NOTHING
        `,
        [
          cartela.id,
          cartela.playerName,
          JSON.stringify(cartela.predictions || {}),
          cartela.createdAt || new Date().toISOString(),
          cartela.updatedAt || null
        ]
      );
    }
  }

  if (resultsCount.rows[0].count === 0) {
    const results = readJsonFile(RESULTS_FILE, {});

    for (const [matchId, result] of Object.entries(results)) {
      if (!Number.isInteger(result?.homeScore) || !Number.isInteger(result?.awayScore)) {
        continue;
      }

      await database.query(
        `
          INSERT INTO results (match_id, home_score, away_score, updated_at)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (match_id) DO NOTHING
        `,
        [
          matchId,
          result.homeScore,
          result.awayScore,
          result.updatedAt || new Date().toISOString()
        ]
      );
    }
  }
}

module.exports = {
  initStorage,
  getCartelas,
  createCartela,
  updateCartela,
  deleteCartela,
  getResults,
  updateResults,
  getKnockoutPlayers,
  upsertKnockoutPlayer,
  resetKnockoutPlayerPassword,
  getKnockoutPredictions,
  updateKnockoutPredictions,
  getKnockoutMatches,
  upsertKnockoutMatches,
  getKnockoutResults,
  updateKnockoutResults
};
