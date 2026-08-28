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
sucesso. Em 28 de agosto, a primeira migração automática revelou que o mesmo
token ainda não possui `D1 Edit`: a página foi publicada, mas a etapa do banco
parou com o código 7403 antes do deploy do Worker. A migração `0007` e o Worker
foram recuperados pela sessão OAuth local, sem deixar produção incompleta.

Para restaurar a automação integral, edite o token usado pelo secret
`CLOUDFLARE_API_TOKEN` e acrescente `Account` → `D1` → `Edit`, restrito à mesma
conta. Depois execute manualmente `Publicar API da comunidade`; não é preciso
reaplicar migrações que já constem como concluídas.

Para trocar ou revogar o token no futuro:

1. Abra <https://dash.cloudflare.com/profile/api-tokens>.
2. Crie um **Custom token** com um nome como
   `13calendar GitHub Production Deploy`.
3. Conceda `Account` → `Cloudflare Pages` → `Edit`, `Account` → `D1` → `Edit`
   e use o modelo oficial **Edit Cloudflare Workers**, que inclui
   `Workers Scripts` → `Edit` e as leituras de conta/usuário necessárias ao
   Wrangler.
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

Estado confirmado novamente em 28 de agosto de 2026:

- a zona `13calendar.eu.org` foi criada no plano gratuito do Cloudflare;
- os dois nameservers atribuídos foram informados ao EU.org;
- o EU.org validou corretamente as respostas SOA e NS, sem erros, e salvou a
  solicitação para análise humana;
- o Cloudflare está verificando periodicamente a delegação e permanece em
  **Waiting for your registrar to propagate your new nameservers**.
- `13calendar.eu.org` ainda não possui delegação pública, portanto a análise
  humana continua pendente;
- a zona principal `eu.org` recebeu atualizações DNS no próprio dia 28. Isso
  confirma operação técnica ativa, mas não permite inferir o ritmo da fila de
  moderadores;
- a documentação oficial informa apenas que a intervenção humana pode levar
  alguns dias. O pedido tem três dias e ainda não ultrapassou essa orientação.

Não criar registros A, AAAA, CNAME ou MX enquanto a delegação estiver
pendente. Não é necessário repetir a solicitação nem usar **Create Worker**.
Quando o EU.org aprovar o pedido por e-mail, avise `domínio aprovado`.

O lançamento não depende desse domínio: `13calendar.pages.dev` continua
canônico e funcional. Se não houver resposta após 30 dias, reavaliar o pedido
e considerar um domínio convencional como contingência, sem retirar o site do
ar nem alterar antecipadamente canonical, sitemap ou CORS.

Após a aprovação serão feitos, nesta ordem:

1. associação do domínio ao projeto Cloudflare Pages;
2. ativação do certificado HTTPS;
3. troca coordenada de canonical, sitemap, Worker, Turnstile e CORS;
4. redirecionamento permanente dos endereços antigos;
5. validação de todos os formulários e páginas.

## 3. Google Search Console — configuração concluída

O Search Console é somente observabilidade de indexação, não uma dependência de
funcionamento ou publicação do site.

Estado confirmado em 25 de agosto de 2026:

- a propriedade de Prefixo do URL `https://13calendar.pages.dev/` foi criada;
- a tag HTML publicada validou automaticamente a propriedade;
- `sitemap.xml` foi enviado em 25 de agosto de 2026;
- a página principal já consta no índice do Google;
- a página educacional consta no sitemap e será descoberta na leitura
  periódica; a solicitação manual adicional encontrou a cota diária do Google,
  sem indicar erro no site;
- a publicação técnica já oferece `robots.txt`, `sitemap.xml`, canonical e
  metadados próprios para a página principal e para a página educacional.

Na primeira leitura, o painel exibiu `Não foi possível ler o sitemap`, embora o
arquivo responda HTTP 200, tenha XML válido e devolva o mesmo conteúdo ao
Googlebot. O Search Console tentará novamente de forma periódica; apenas
acompanhar o estado, sem reenviar repetidamente.

Quando `13calendar.eu.org` estiver ativo, será criada uma propriedade de
Domínio para ele e o sitemap canônico será reenviado.
