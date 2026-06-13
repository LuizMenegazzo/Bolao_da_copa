# Bolão da Copa UFSM-CS

API e front-end simples para o Bolão da Copa da UFSM Cachoeira do Sul.

## Como rodar

No Windows, basta dar dois cliques em:

```text
Abrir Bolao.cmd
```

Para fechar o servidor depois:

```text
Fechar Bolao.cmd
```

Também é possível rodar pelo terminal:

```bash
npm start
```

Depois acesse:

```text
http://localhost:3000
```

## O que já existe

- Tela inicial com os botões `Adicionar cartela`, `Acompanhar bolão` e `Atualizar placares`.
- Formulário de cartela com nome do jogador.
- Jogos da fase de grupos separados por grupos, na ordem fornecida.
- Listagem, edição e exclusão das cartelas preenchidas.
- Tela `Atualizar placares` com jogos separados por dia.
- Tela `Acompanhar bolão` com classificação geral e pontuação individual por cartela.
- Senha de administrador para atualizar placares e editar/excluir cartelas.
- Geração de imagem vertical do ranking geral para compartilhar no celular.
- Salvamento parcial dos resultados oficiais em `data/results.json`.
- Salvamento das cartelas em `data/cartelas.json`.

## Senha de administrador

Defina a senha pela variável de ambiente:

```text
ADMIN_PASSWORD=popo
```

Ela protege:

- acesso à tela `Atualizar placares`;
- edição de cartelas;
- exclusão de cartelas.

No launcher local `Abrir Bolao.cmd`, a senha é perguntada ao iniciar o servidor.

## Banco de dados

Em produção, defina a variável:

```text
DATABASE_URL=postgres://...
```

Quando `DATABASE_URL` existe, o sistema usa PostgreSQL e cria automaticamente as tabelas:

- `cartelas`
- `results`

Se o banco estiver vazio, o sistema importa automaticamente os dados atuais de:

- `data/cartelas.json`
- `data/results.json`

Sem `DATABASE_URL`, o projeto continua usando os arquivos `data/cartelas.json` e `data/results.json` apenas para desenvolvimento local.

No Render, configure em `Environment`:

```text
ADMIN_PASSWORD=popo
DATABASE_URL=<url do banco postgres>
```

### Sincronizacao automatica de placares

O servidor sincroniza resultados com a OpenLigaDB ao iniciar, ao consultar `GET /api/results` quando a ultima busca esta velha, e a cada intervalo enquanto o Render estiver acordado.

Variaveis opcionais:

```text
AUTO_SCORE_SYNC=true
AUTO_SCORE_SYNC_MINUTES=10
AUTO_SYNC_LIVE_SCORES=true
OPENLIGADB_URL=https://api.openligadb.de/getmatchdata/wm26/2026
```

- `AUTO_SCORE_SYNC=false`: desliga a sincronizacao automatica.
- `AUTO_SCORE_SYNC_MINUTES=5`: muda o intervalo para 5 minutos.
- `AUTO_SYNC_LIVE_SCORES=false`: salva apenas placares de jogos finalizados.
- `OPENLIGADB_URL`: troca a URL da API, caso o atalho da liga mude.

## Critérios de pontuação

- Acerto completo: `10 pontos` quando acerta exatamente o placar.
- Acerto intermediário: `6 pontos` quando acerta vencedor/empate e também o placar de uma equipe ou a diferença de gols.
- Acerto básico: `5 pontos` quando acerta apenas o vencedor ou empate.
- Acerto invertido: `-2 pontos` quando acerta exatamente o oposto do resultado.
- Nenhum acerto: `0 pontos`.

## Rotas da API

- `GET /api/matches`: lista os jogos por grupo.
- `POST /api/cartelas`: salva uma cartela vinculada ao nome do jogador.
- `GET /api/cartelas`: lista cartelas salvas.
- `PUT /api/cartelas/:id`: atualiza uma cartela salva.
- `DELETE /api/cartelas/:id`: exclui uma cartela salva.
- `GET /api/results`: lista os resultados oficiais salvos.
- `GET /api/sync/status`: mostra o status da sincronizacao automatica.
- `POST /api/results/sync`: forca sincronizacao automatica, usando senha de administrador.
- `PUT /api/results`: salva resultados oficiais de forma parcial.
