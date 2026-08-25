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

## 2. Solicitar `13calendar.eu.org`

O endereço não possui registros DNS em 24 de agosto de 2026, mas isso não
substitui a confirmação de disponibilidade feita pelo formulário do EU.org.

Passos:

1. Crie ou acesse uma conta em <https://nic.eu.org/>.
2. Solicite o domínio `13calendar.eu.org`.
3. Quando o formulário pedir DNS, use os servidores autoritativos aceitos pelo
   fluxo escolhido. Se o EU.org exigir que o DNS já esteja respondendo,
   interrompa nesse ponto e envie uma captura da tela, sem dados secretos.
4. Quando a solicitação for aprovada, avise `domínio aprovado`.

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
4. Escolha a verificação por arquivo HTML ou tag HTML e envie o arquivo ou a
   tag fornecida, sem ocultar nenhuma parte necessária à verificação pública.
5. Depois da confirmação, envie o sitemap
   `https://13calendar.pages.dev/sitemap.xml`.

Quando `13calendar.eu.org` estiver ativo, será criada uma propriedade de
Domínio para ele e o sitemap canônico será reenviado.

## 4. Resposta do projeto de referência

Acompanhe <https://github.com/Andree37/13-months/issues/2>. O pedido continua
aberto e sem resposta desde 11 de agosto de 2026. Se houver resposta, envie o
link ou uma captura; qualquer exigência de licença, atribuição, mudança ou
remoção terá prioridade.
