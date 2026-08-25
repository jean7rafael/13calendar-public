# Ações que dependem do mantenedor

Este arquivo reúne somente tarefas que exigem login, confirmação de identidade
ou uma decisão do proprietário. Nenhum segredo deve ser colado em conversas,
commits ou capturas de tela.

## 1. Publicação automática no Cloudflare Pages — concluída

Estado validado em 24 de agosto de 2026:

- `CLOUDFLARE_ACCOUNT_ID` e `CLOUDFLARE_API_TOKEN` estão salvos como secrets do
  repositório público;
- o workflow realizou build e deploy completos com sucesso na execução
  `32793984475`;
- cada push futuro na `main` pública passa a publicar automaticamente;
- a publicação manual continua disponível para emergências.

Para trocar ou revogar o token no futuro:

1. Abra <https://dash.cloudflare.com/profile/api-tokens>.
2. Crie um **Custom token** com um nome como
   `13calendar GitHub Pages Deploy`.
3. Conceda somente `Account` → `Cloudflare Pages` → `Edit`.
4. Restrinja o token à conta que contém o projeto `13calendar`.
5. No Mac, a partir de qualquer pasta, execute o comando abaixo e cole o token
   somente quando o próprio terminal solicitar:

   ```bash
   gh secret set CLOUDFLARE_API_TOKEN --repo jean7rafael/13calendar-public
   ```

6. Execute manualmente o workflow `Publicar no Cloudflare Pages` para validar o
   novo token. Não envie o valor do token em conversas ou capturas.

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

## 3. Adicionar o site ao Google Search Console

Enquanto o domínio próprio não for aprovado, é possível iniciar com uma
propriedade do tipo **Prefixo do URL** para
`https://13calendar.pages.dev/`. Depois, o domínio próprio deverá usar uma
propriedade de **Domínio**, validada por DNS.

Passos:

1. Abra <https://search.google.com/search-console>.
2. Selecione **Adicionar propriedade**.
3. Para começar agora, escolha **Prefixo do URL** e informe exatamente
   `https://13calendar.pages.dev/`.
4. Escolha **Tag HTML**, copie a tag `<meta ...>` completa e envie-a para ser
   incorporada e publicada. A tag de verificação é pública por definição e não
   concede acesso à conta Google.
5. Depois da publicação da tag, clique em **Verificar** no Search Console.
6. Na opção **Sitemaps**, informe `sitemap.xml` e envie. O endereço completo
   resultante será
   `https://13calendar.pages.dev/sitemap.xml`.
7. Em **Inspeção de URL**, solicite a indexação de
   `https://13calendar.pages.dev/` e de
   `https://13calendar.pages.dev/reference-site/`.

Quando `13calendar.eu.org` estiver ativo, será criada uma propriedade de
Domínio para ele e o sitemap canônico será reenviado.

## 4. Resposta do projeto de referência

Acompanhe <https://github.com/Andree37/13-months/issues/2>. O pedido continua
aberto e sem resposta desde 11 de agosto de 2026. Se houver resposta, envie o
link ou uma captura; qualquer exigência de licença, atribuição, mudança ou
remoção terá prioridade.
