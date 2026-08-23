# Cadastro comunitário — Cloudflare Worker

Este Worker recebe os cadastros voluntários da página comunitária, valida o
Cloudflare Turnstile e guarda somente dados destinados à exibição pública. Todo
registro entra como `pending` e precisa ser aprovado antes de aparecer.

## Preparação

1. Entre nesta pasta e instale as dependências com `npm install`.
2. Autentique o Wrangler na conta Cloudflare com `npx wrangler login`.
3. Faça a primeira implantação com `npm run deploy`. O Wrangler atual pode
   provisionar automaticamente o D1 declarado em `wrangler.jsonc`.
4. Crie as tabelas com `npm run migrate:remote`.
5. Grave a chave secreta do Turnstile com
   `npx wrangler secret put TURNSTILE_SECRET_KEY`.
6. Crie uma senha longa e exclusiva para a moderação com
   `npx wrangler secret put ADMIN_API_TOKEN`.
7. Copie o endereço final do Worker para
   `VITE_COMMUNITY_REGISTRATION_URL`, acrescentando `/registrations`.
8. Coloque somente a chave pública do Turnstile em
   `VITE_TURNSTILE_SITE_KEY`.

O widget usa a ação `community_registration`. O Worker exige essa mesma ação e
aceita tokens emitidos somente para `jean7rafael.github.io`, conforme as
variáveis não secretas de `wrangler.jsonc`. Tokens são de uso único e o
formulário renova o desafio depois de cada tentativa de envio.

Nenhuma das duas chaves secretas deve entrar em `.env`, `wrangler.jsonc`, GitHub
ou no código do navegador.

## Rotas

- `POST /registrations`: recebe um cadastro e o deixa pendente;
- `GET /members`: devolve somente cadastros aprovados;
- `GET /admin/registrations`: lista pendências com autorização administrativa;
- `PATCH /admin/registrations/:id`: aprova ou rejeita uma pendência.
