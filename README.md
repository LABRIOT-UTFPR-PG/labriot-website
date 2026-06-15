# Labriot Website

Aplicacao institucional do Labriot com:

- `Next.js 15`
- `TypeScript`
- `Prisma`
- `MongoDB`
- painel administrativo protegido
- auditoria de acoes administrativas
- integracao com `Web3Forms`
- demo publica do `Roboflow`

## Rodando localmente

Use `Node 22`:

```bash
node -v
```

Esperado:

```bash
v22.x
```

1. Instale as dependencias:

```bash
npm install
```

2. Configure o ambiente:

```bash
cp .env.example .env
```

3. Preencha pelo menos:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`

4. Gere o client do Prisma:

```bash
npm run prisma:generate
```

5. Sincronize o schema com o MongoDB:

```bash
npm run prisma:push
```

6. Suba o projeto:

```bash
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run test
npm run prisma:generate
npm run prisma:push
npm run prisma:studio
```

## Variaveis de ambiente

```env
DATABASE_URL="mongodb+srv://USER:PASSWORD@HOST/labriot?retryWrites=true&w=majority"
AUTH_SECRET="troque-por-uma-string-grande-e-aleatoria"
API_KEY="chave-do-roboflow-workflows"
WEB3FORMS_ACCESS_KEY="sua-access-key-do-web3forms"
ROBOFLOW_EMBED_URL="https://app.roboflow.com/workflows/embed/..."
NEXT_PUBLIC_SITE_URL="https://seu-dominio.com"
ALLOW_MOCK_DATA="false"
```

Notas:

- `ALLOW_MOCK_DATA` so deve ser usado em desenvolvimento.
- em producao, sem `DATABASE_URL`, o sistema nao cai mais silenciosamente para mocks.
- `API_KEY` e usada pela rota `/api/roboflow`.
- `WEB3FORMS_ACCESS_KEY` fica somente no servidor e alimenta `/api/contact`.
- `ROBOFLOW_EMBED_URL` define o embed oficial do projeto de visao computacional.
- `NEXT_PUBLIC_SITE_URL` e usado para gerar `robots.txt` e `sitemap.xml`.
- `AUTH_SECRET` e obrigatorio em producao.

## Estrutura principal

```text
app/
  admin/        painel administrativo
  api/          rotas protegidas e publicas
  blog/         paginas publicas de posts
  contact/      contato institucional
  events/       eventos publicos
  projects/     projetos publicos + roboflow
components/
lib/
  repositories/ camada de acesso a dados
  validations/  schemas zod
prisma/
tests/
```

## Arquitetura

- `lib/repositories/*` concentra acesso a dados
- `lib/validations/*` valida payloads de API
- `middleware.ts` protege `/admin/*` e quase todo `/api/*`
- `lib/audit.ts` registra acoes administrativas
- `lib/public-data.ts` concentra leituras publicas do site

## Admin

Fluxos principais:

- login/logout por cookie assinado
- criacao de administradores
- exclusao de administradores
- troca da propria senha
- auditoria recente no painel `/admin/admins`

### Primeiro admin

Como o script de criacao foi removido, o primeiro administrador deve ser inserido direto no MongoDB.

1. Gere o hash da senha:

```bash
node -e "require('bcryptjs').hash('SUA_SENHA_FORTE', 12).then(console.log)"
```

2. Copie o hash gerado e insira o usuario com `mongosh`:

```bash
mongosh "$DATABASE_URL" --eval 'db.User.insertOne({ username: "admin", password: "COLE_O_HASH_AQUI", createdAt: new Date(), updatedAt: new Date() })'
```

3. Depois do primeiro login, use `/admin/admins` para criar ou excluir os demais administradores.

## Importar dados de outro site

Se você tiver um JSON exportado de `/api/admin/export?scope=all`, pode importar o conteúdo para este banco com:

```bash
npm run import:site-export -- --input ./export.json --clear
```

Também é possível puxar direto da URL autenticada do site de origem:

```bash
npm run import:site-export -- --url "https://labriot-website.vercel.app/api/admin/export?scope=all" --cookie "labriot_admin_session=..."
```

Notas:

- o import traz `projects`, `publications`, `posts`, `events`, `team`, `research` e `settings`
- o export atual não contém `passwordHash`, então `admins` não podem ser restaurados automaticamente
- use `--clear` só se quiser apagar os dados atuais antes de importar

Observacoes:

- o nome da collection do Prisma para administradores e `User`
- o campo `password` precisa conter hash `bcrypt`
- o login usa o `username` exatamente como foi salvo

## Producao

Checklist minima:

- usar `Node 22`
- definir `DATABASE_URL`
- definir `AUTH_SECRET`
- definir `API_KEY`
- definir `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`
- manter `ALLOW_MOCK_DATA=false`
- validar `npm run build` antes do deploy

## Settings

`/admin/settings` controla:

- nome do site
- descricao
- email, telefone e endereco
- links sociais
- habilitacao publica de blog e eventos

Hoje essas configuracoes ja afetam:

- header publico
- pagina de contato
- home publica
- rota `/blog`
- rota `/events`

## Testes

Os testes atuais cobrem a base critica de seguranca e configuracao:

- tokens de sessao admin
- middleware de protecao
- validacao de settings
- validacao de troca de senha
- politica de mocks fora de producao

Rode com:

```bash
npm run test
```

## Observacoes

- o upload de `logo` e `favicon` ainda e placeholder no `/admin/settings`
- o `Roboflow` salva um arquivo local de debug em `roboflow_response_scratch.json`, que esta ignorado no git
- se `.next` corromper no ambiente local, rode:

```bash
rm -rf .next
npm run dev
```
