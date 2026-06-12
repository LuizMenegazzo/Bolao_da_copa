const fs = require("fs");
const path = require("path");

const CARTELAS_FILE = path.join(__dirname, "data", "cartelas.json");
const RESULTS_FILE = path.join(__dirname, "data", "results.json");
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

function mapCartelaRow(row) {
  return {
    id: row.id,
    playerName: row.player_name,
    predictions: row.predictions,
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
  updateResults
};
