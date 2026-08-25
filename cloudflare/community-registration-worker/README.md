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

O `wrangler.jsonc` também declara o binding `BROWSER`. Ele dá acesso ao
Cloudflare Browser Run usado como segunda tentativa para fotos públicas; não é
uma secret e é provisionado junto com a implantação do Worker.

## Avisos de moderação no Telegram

O aviso contém somente a informação de que existe uma nova pendência e o link
da moderação. Nome, perfil social, país e telefone não são enviados ao Telegram.

1. No Telegram, abra o perfil oficial `@BotFather`, crie um bot com `/newbot` e
   guarde o token fornecido. Não cole esse token no código, no GitHub ou nesta
   conversa.
2. Nesta pasta, execute `npx wrangler secret put TELEGRAM_BOT_TOKEN` e cole o
   token somente quando o terminal solicitar.
3. Abra o bot recém-criado pelo perfil `@jean7rafael` e envie `/start`.
4. Entre em `#/community-admin`, autentique a moderação e escolha **Conectar e
   testar**. O Worker localizará essa conversa privada, guardará somente o
   identificador técnico no D1 e enviará uma mensagem de confirmação.

O usuário esperado fica na variável não secreta `TELEGRAM_ADMIN_USERNAME`. O
número de telefone não é necessário e não é acessível pela Bot API. Se o bot ou
o Telegram estiverem indisponíveis, o cadastro continua salvo normalmente e a
falha fica apenas nos logs estruturados do Worker.

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
- `POST /admin/registrations/:id/avatar/capture`: repete a importação automática
  da foto pública declarada pela rede social;
- `POST /registrations/remove`: remove somente o perfil associado ao código
  privado apresentado pelo próprio titular;
- `GET /admin/notifications`: informa o estado dos canais de aviso;
- `POST /admin/notifications/telegram/connect`: conecta a conversa privada e
  envia uma mensagem de teste.

## Moderação

A interface administrativa fica em `#/community-admin`. Ela não aparece nos
menus públicos e exige o valor de `ADMIN_API_TOKEN`. O segredo permanece apenas
na sessão da aba e é removido ao sair ou ao fechar a aba. Cada pedido começa
como `pending`; Aprovar o torna visível em `GET /members`, e Recusar mantém o
registro fora da página pública.

Na mesma tela, a seção **Avisos no Telegram** mostra se o bot está configurado
e se a conversa administrativa já foi conectada.

Ao receber um perfil do Instagram ou Facebook, o Worker procura a foto pública
nos metadados da rede. Se o HTML inicial não a trouxer, o Browser Run abre o
link público, identifica uma imagem visível com características de avatar e
captura somente esse elemento. A cópia pode ser preparada ainda durante a
moderação, mas só é servida por `/avatars/:id` depois da aprovação. O processo
não usa login, cookie ou sessão do moderador. Se a rede bloquear até o navegador
automatizado, o perfil continua com a inicial do nome e a moderação permite
repetir a captura ou enviar uma imagem manualmente.

## Retrato comunitário

O Worker consulta diariamente a GraphQL Analytics API e preserva os totais por
dia no D1. A tarefa agendada roda às `01:30 UTC`, enquanto uma leitura pública
também tenta atualizar o período recente e reutiliza o histórico preservado se
a API estiver temporariamente indisponível. Somente visitas, visualizações,
países, páginas, origens e dispositivos agregados são armazenados; não há IP,
cookie, conta ou histórico individual.
