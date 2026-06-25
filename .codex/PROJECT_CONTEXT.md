# Contexto do Projeto — Bolão da Copa UFSM-CS

Este diretório guarda o contexto essencial para continuar o projeto em outro computador ou em outra conversa com Codex.

## Projeto

Aplicação web do **Bolão da Copa UFSM Cachoeira do Sul**.

Funcionalidades principais:
- cadastrar/editar/excluir cartelas;
- acompanhar classificação geral;
- acompanhar cartela individual;
- tela de jogo/bloco atual;
- atualizar placares manualmente ou por sincronização ESPN;
- gerar imagem do ranking;
- backup dos dados;
- chibis dinâmicos por desempenho.

## Stack

- Backend: Node.js vanilla em `server.js`.
- Frontend: HTML/CSS/JS puro em `public/`.
- Storage: `storage.js` usa PostgreSQL via `DATABASE_URL`; sem banco, usa JSON local.
- Deploy principal: Render.
- Deploy backup: Vercel com `api/[...path].js`.

## Arquivos importantes

- `server.js`: servidor principal, rotas API e arquivos estáticos.
- `storage.js`: leitura/escrita de dados em banco ou JSON.
- `score-sync.js`: sincronização automática dos placares via ESPN.
- `public/app.js`: toda lógica do frontend, ranking, pontuação e chibis.
- `public/styles.css`: layout responsivo e visual do site.
- `public/index.html`: estrutura das telas.
- `public/chibis/`: imagens originais dos chibis.
- `public/chibis-optimized/`: imagens WebP leves usadas pelo site.
- `api/[...path].js`: adaptação para rodar na Vercel.
- `vercel.json`: configuração/cache da Vercel.

## Variáveis de ambiente

Obrigatórias/recomendadas no Render/Vercel:

- `ADMIN_PASSWORD`: senha do administrador do bolão.
- `DATABASE_URL`: URL do PostgreSQL/Neon.
- `AUTO_SCORE_SYNC`: pode ser `false` se quiser impedir sync automático ao abrir páginas.
- `ESPN_SCOREBOARD_URL`: opcional; por padrão usa a API pública da ESPN para FIFA World Cup.

## Dados e backup

O app tem botão de backup na tela inicial.
Ele baixa um JSON com cartelas, resultados e status.

Se o site estiver em banco PostgreSQL, os dados ficam no banco.
Se estiver sem `DATABASE_URL`, os dados podem ir para JSON local, mas isso não é seguro em deploys como Render/Vercel.

## Como continuar em outro computador

1. Clonar o repositório pelo GitHub Desktop ou `git clone`.
2. Abrir a pasta do projeto.
3. Rodar `npm install`, se houver dependências novas.
4. Configurar `.env` local se quiser usar banco/senha.
5. Rodar localmente com `node server.js`.
6. Abrir `http://localhost:3000`.
7. Para publicar, fazer commit + push.

## Observações

- Não colocar senha fixa no código; usar `ADMIN_PASSWORD`.
- Para atualizar imagens, salvar originais em `public/chibis/...` e gerar WebP em `public/chibis-optimized/`.
- Quando trocar chibis, atualizar `CHIBI_ASSET_VERSION` em `public/app.js` para evitar cache antigo.
