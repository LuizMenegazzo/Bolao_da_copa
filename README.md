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

- Tela `Jogo atual` com o último placar atualizado, palpites, pontos do jogo, total geral e chibis.
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

Na tela inicial, o botão `Baixar backup` gera um arquivo `.json` com:

- grupos e jogos;
- cartelas salvas;
- resultados oficiais;
- status da sincronizacao de placares.

Esse backup usa a senha de administrador e serve como copia de seguranca caso o servico fique fora do ar.

No Render, configure em `Environment`:

```text
ADMIN_PASSWORD=popo
DATABASE_URL=<url do banco postgres>
```

## Vercel como backup

O projeto tambem roda na Vercel como site reserva do Render.

- O Render continua usando `server.js` e `npm start`.
- A Vercel usa a funcao serverless `api/[...path].js`.
- O front-end continua em `public/`.
- Os dois ambientes devem usar o mesmo `DATABASE_URL` para compartilhar cartelas e placares.

Na Vercel, configure em `Settings > Environment Variables`:

```text
ADMIN_PASSWORD=popo
DATABASE_URL=<mesma url do banco postgres>
AUTO_SCORE_SYNC=true
AUTO_SYNC_LIVE_SCORES=true
```

Importante: na Vercel, use sempre PostgreSQL/Neon. Os arquivos JSON locais servem apenas para desenvolvimento e backup manual.

### Sincronizacao de placares

O servidor sincroniza resultados com a ESPN sob demanda:

- quando alguem abre/recarrega o site;
- quando alguem entra em `Acompanhar sua cartela`;
- quando alguem entra em `Acompanhar bolao`;
- quando o administrador entra em `Atualizar placares` ou clica em `Sincronizar agora`.

Nao existe timer rodando a cada 5 ou 10 minutos.

Variaveis opcionais:

```text
AUTO_SCORE_SYNC=true
AUTO_SYNC_LIVE_SCORES=true
ESPN_SCOREBOARD_URL=https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard
```

- `AUTO_SCORE_SYNC=false`: desliga a sincronizacao com a ESPN.
- `AUTO_SYNC_LIVE_SCORES=false`: salva apenas placares de jogos finalizados.
- `ESPN_SCOREBOARD_URL`: troca a URL da API, caso a ESPN mude o endpoint.

## Critérios de pontuação

- Acerto completo: `10 pontos` quando acerta exatamente o placar.
- Acerto intermediário: `6 pontos` quando acerta vencedor/empate e também o placar de uma equipe ou a diferença de gols.
- Acerto básico: `5 pontos` quando acerta apenas o vencedor ou empate.
- Acerto invertido: `-2 pontos` quando acerta exatamente o oposto do resultado.
- Nenhum acerto: `0 pontos`.

Em caso de empate no total, o ranking usa nesta ordem:

1. mais acertos completos;
2. mais acertos intermediários;
3. mais acertos básicos;
4. menos acertos invertidos.

## Rotas da API

- `GET /api/matches`: lista os jogos por grupo.
- `POST /api/cartelas`: salva uma cartela vinculada ao nome do jogador.
- `GET /api/cartelas`: lista cartelas salvas.
- `PUT /api/cartelas/:id`: atualiza uma cartela salva.
- `DELETE /api/cartelas/:id`: exclui uma cartela salva.
- `GET /api/results`: lista os resultados oficiais salvos.
- `GET /api/backup`: baixa backup JSON com cartelas, placares e jogos, usando senha de administrador.
- `GET /api/sync/status`: mostra o status da sincronizacao automatica.
- `POST /api/results/sync`: forca sincronizacao automatica, usando senha de administrador.
- `PUT /api/results`: salva resultados oficiais de forma parcial.
