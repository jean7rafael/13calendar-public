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
7. Crie um token de leitura do Cloudflare Analytics com a única permissão
   `Account Analytics: Read` e grave-o com
   `npx wrangler secret put CLOUDFLARE_ANALYTICS_API_TOKEN`.
8. Copie o endereço final do Worker para
   `VITE_COMMUNITY_REGISTRATION_URL`, acrescentando `/registrations`.
9. Coloque somente a chave pública do Turnstile em
   `VITE_TURNSTILE_SITE_KEY`.

O widget usa a ação `community_registration`. O Worker exige essa mesma ação e
aceita tokens emitidos somente para `jean7rafael.github.io`, conforme as
variáveis não secretas de `wrangler.jsonc`. Tokens são de uso único e o
formulário renova o desafio depois de cada tentativa de envio.

Nenhuma chave secreta deve entrar em `.env`, `wrangler.jsonc`, GitHub ou no
código do navegador. Neste projeto, o segredo administrativo local fica no
arquivo ignorado `.admin-token.local` e deve ser colado manualmente na tela de
moderação somente quando necessário.

## Rotas

- `POST /registrations`: recebe um cadastro e o deixa pendente;
- `GET /members`: devolve somente cadastros aprovados;
- `GET /analytics/stats`: atualiza e devolve o retrato comunitário agregado;
- `GET /admin/registrations`: lista pendências com autorização administrativa;
- `PATCH /admin/registrations/:id`: aprova ou rejeita uma pendência.

## Moderação

A interface administrativa fica em `#/community-admin`. Ela não aparece nos
menus públicos e exige o valor de `ADMIN_API_TOKEN`. O segredo permanece apenas
na sessão da aba e é removido ao sair ou ao fechar a aba. Cada pedido começa
como `pending`; Aprovar o torna visível em `GET /members`, e Recusar mantém o
registro fora da página pública.

## Retrato comunitário

O Worker consulta diariamente a GraphQL Analytics API e preserva os totais por
dia no D1. A tarefa agendada roda às `01:30 UTC`, enquanto uma leitura pública
também tenta atualizar o período recente e reutiliza o histórico preservado se
a API estiver temporariamente indisponível. Somente visitas, visualizações,
países, páginas, origens e dispositivos agregados são armazenados; não há IP,
cookie, conta ou histórico individual.
