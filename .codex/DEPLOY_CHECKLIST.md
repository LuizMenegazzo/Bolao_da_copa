# Checklist de Deploy e Continuidade

## Rodar localmente

No terminal, dentro da pasta do projeto:

```bash
node server.js
```

Depois abrir:

```text
http://localhost:3000
```

Se `node` não estiver no PATH no ambiente Codex atual, ele costuma estar em:

```text
C:\Users\luizm\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
```

## Atualizar Render/Vercel

1. Abrir GitHub Desktop.
2. Conferir arquivos alterados.
3. Escrever mensagem do commit.
4. Clicar em `Commit`.
5. Clicar em `Push origin`.
6. Render/Vercel fazem redeploy automaticamente se estiverem ligados ao GitHub.

## Render

Usado como site principal.

Configurar Environment Variables:
- `ADMIN_PASSWORD`
- `DATABASE_URL`
- opcional `AUTO_SCORE_SYNC`

## Vercel

Versão backup.

Arquivos relevantes:
- `api/[...path].js`
- `api/health.js`
- `vercel.json`

Também precisa das mesmas Environment Variables.

## Backup dos dados

Na tela inicial existe botão para baixar backup.
Salvar esse JSON em lugar seguro antes de grandes alterações/deploys.

## Antes de pedir ajuda em outra conversa

Mandar para o Codex ler primeiro:
- `.codexx/PROJECT_CONTEXT.md`
- `.codexx/BOLAO_RULES.md`
- `.codexx/DEPLOY_CHECKLIST.md`

Sugestão de prompt:

```text
Leia a pasta .codexx primeiro para entender o contexto do projeto Bolão da Copa e depois me ajude com a próxima alteração.
```
