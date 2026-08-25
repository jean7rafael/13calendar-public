# Ações que dependem do mantenedor

Este arquivo reúne somente tarefas que exigem login, confirmação de identidade
ou uma decisão do proprietário. Nenhum segredo deve ser colado em conversas,
commits ou capturas de tela.

## 1. Publicação automática da página e do Worker

Estado validado em 24 de agosto de 2026:

- `CLOUDFLARE_ACCOUNT_ID` e `CLOUDFLARE_API_TOKEN` estão salvos como secrets do
  repositório público;
- o workflow realizou build e deploy completos com sucesso na execução
  `32793984475`;
- cada push futuro na `main` pública passa a publicar automaticamente a página;
- a publicação manual continua disponível para emergências.

Em 25 de agosto, o token existente recebeu também `Workers Scripts: Edit`. A
execução pública `32802460935` realizou o deploy completo do Worker com
sucesso. Página e API voltaram, portanto, a compartilhar uma publicação
inteiramente automática.

Para trocar ou revogar o token no futuro:

1. Abra <https://dash.cloudflare.com/profile/api-tokens>.
2. Crie um **Custom token** com um nome como
   `13calendar GitHub Production Deploy`.
3. Conceda `Account` → `Cloudflare Pages` → `Edit` e use o modelo oficial
   **Edit Cloudflare Workers**, que inclui `Workers Scripts` → `Edit` e as
   leituras de conta/usuário necessárias ao Wrangler.
4. Restrinja o token à conta que contém o projeto `13calendar`.
5. No Mac, a partir de qualquer pasta, execute o comando abaixo e cole o token
   somente quando o próprio terminal solicitar:

   ```bash
   gh secret set CLOUDFLARE_API_TOKEN --repo jean7rafael/13calendar-public
   ```

6. Execute manualmente os workflows `Publicar API da comunidade` e
   `Publicar no Cloudflare Pages` para validar um token novo. Não envie o valor
   do token em conversas ou capturas.

O repositório privado possui o secret `PUBLIC_REPO_TOKEN`. O workflow
`Sincronizar versão pública` agora executa `npm run verify`, confere o pacote do
Worker, espelha a mesma fonte no repositório público e deixa que esses dois
workflows façam as publicações. Esse é o fluxo padrão para toda nova versão.

## 2. Ativar `13calendar.eu.org` — aguardando aprovação

Estado confirmado em 25 de agosto de 2026:

- a zona `13calendar.eu.org` foi criada no plano gratuito do Cloudflare;
- os dois nameservers atribuídos foram informados ao EU.org;
- o EU.org validou corretamente as respostas SOA e NS, sem erros, e salvou a
  solicitação para análise humana;
- o Cloudflare está verificando periodicamente a delegação e permanece em
  **Waiting for your registrar to propagate your new nameservers**.

Não criar registros A, AAAA, CNAME ou MX enquanto a delegação estiver
pendente. Não é necessário repetir a solicitação nem usar **Create Worker**.
Quando o EU.org aprovar o pedido por e-mail, avise `domínio aprovado`.

Após a aprovação serão feitos, nesta ordem:

1. associação do domínio ao projeto Cloudflare Pages;
2. ativação do certificado HTTPS;
3. troca coordenada de canonical, sitemap, Worker, Turnstile e CORS;
4. redirecionamento permanente dos endereços antigos;
5. validação de todos os formulários e páginas.

## 3. Google Search Console — propriedade verificada

Estado confirmado em 25 de agosto de 2026:

- a propriedade de Prefixo do URL `https://13calendar.pages.dev/` foi criada;
- a tag HTML publicada validou automaticamente a propriedade;
- `sitemap.xml` está preenchido na tela de envio;
- a publicação técnica já oferece `robots.txt`, `sitemap.xml`, canonical e
  metadados próprios para a página principal e para a página educacional.

Falta somente confirmar e executar estas ações na conta Google:

1. Na opção **Sitemaps**, enviar o valor já preenchido `sitemap.xml`. O
   endereço completo resultante será
   `https://13calendar.pages.dev/sitemap.xml`.
2. Em **Inspeção de URL**, solicitar a indexação de
   `https://13calendar.pages.dev/` e de
   `https://13calendar.pages.dev/reference-site/`.

Quando `13calendar.eu.org` estiver ativo, será criada uma propriedade de
Domínio para ele e o sitemap canônico será reenviado.

## 4. Resposta do projeto de referência

Acompanhe <https://github.com/Andree37/13-months/issues/2>. O pedido continua
aberto e sem resposta desde 11 de agosto de 2026. Se houver resposta, envie o
link ou uma captura; qualquer exigência de licença, atribuição, mudança ou
remoção terá prioridade.
