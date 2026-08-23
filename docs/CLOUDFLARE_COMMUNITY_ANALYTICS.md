# Retrato comunitário com Cloudflare Web Analytics

## Objetivo

A rota `#/community` apresenta um retrato agregado das pessoas que visitam o
projeto: volume aproximado de visitas, páginas vistas, países, atividade diária,
origens e dispositivos. A proposta é mostrar interesse coletivo sem criar perfis
individuais.

## Princípio de privacidade

- A interface pública lê apenas `public/data/community-stats.json`.
- Nenhuma chave privada da Cloudflare pode ser inserida no navegador.
- Países e dispositivos aparecem apenas como totais agregados.
- Não devem ser publicados IPs, cidades, coordenadas, identificadores de página,
  nomes ou históricos individuais.
- “Visitas” não significa necessariamente “pessoas únicas”; o número é uma
  aproximação transparente do tamanho da comunidade.

O Cloudflare Web Analytics é uma solução sem cookies voltada a métricas
agregadas e não acompanha usuários individuais entre sites.

## Coleta no navegador

As duas interfaces carregam o beacon da Cloudflare somente quando a variável
abaixo existe durante a compilação:

```text
VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN
```

O valor é o **token público do site** mostrado pelo painel do Web Analytics. Ele
não é a credencial privada usada para consultar a API.

O site `jean7rafael.github.io` foi cadastrado em 2026-08-22. O identificador
público está presente somente nas compilações de produção das duas interfaces;
o desenvolvimento local não entra nas estatísticas.

Sem esse valor, nenhum script externo é carregado e a página comunitária mostra
o estado inicial “a comunidade está começando a ser contada”.

## Publicação do retrato agregado

O Web Analytics disponibiliza os seis meses anteriores. A automação deve salvar
diariamente somente as datas ainda ausentes no histórico próprio e recalcular os
totais a partir dessa série persistida. Assim, a passagem da janela da
Cloudflare não apaga dias antigos nem soma novamente períodos sobrepostos.

O arquivo público segue este contrato:

```json
{
  "schemaVersion": 1,
  "status": "ready",
  "generatedAt": "2026-08-22T12:00:00Z",
  "period": { "from": "2026-02-22", "to": "2026-08-22" },
  "summary": { "visits": 1250, "pageViews": 3240, "countries": 37 },
  "activity": [{ "date": "2026-08-22", "visits": 31 }],
  "countries": [{ "code": "BR", "visits": 410, "pageViews": 980 }],
  "pages": [{ "path": "/#/", "views": 1830 }],
  "referrers": [{ "host": "google.com", "visits": 520 }],
  "devices": [{ "name": "Desktop", "visits": 760 }]
}
```

Uma automação futura deverá consultar a GraphQL Analytics API com um token
privado de permissão **Account Analytics: Read**, reduzir a resposta a esse
contrato e publicar somente o JSON final. Os segredos esperados serão:

- `CLOUDFLARE_ANALYTICS_API_TOKEN` — privado, somente na automação;
- `CLOUDFLARE_ACCOUNT_ID` — conta do Web Analytics;
- identificador do site disponibilizado pela Cloudflare.

A coleta pública já pode receber visitas. A consulta automática só será ativada
depois da criação da credencial privada e da confirmação do conjunto de dados
disponível na conta. Até o primeiro retrato real ser gerado, `status` permanece
como `awaiting_configuration` e não há números fictícios.

## Cadastro voluntário

A área de participação recebe nome público e Instagram, Facebook ou outra rede
somente com consentimento explícito. O GitHub Pages envia a inscrição para um
Worker separado, que valida o Turnstile no servidor, grava o pedido no D1 como
`pending` e publica somente registros aprovados. A ação do widget e o hostname
de emissão também são conferidos; cada token vale para uma única tentativa.

O endereço do Worker e a chave pública ficam na compilação. A chave secreta do
Turnstile e o token administrativo permanecem criptografados no Worker. Ainda é
necessário criar a interface de moderação e remoção. Entradas pendentes, tokens
e credenciais nunca fazem parte do GitHub Pages.

## Fontes técnicas oficiais

- [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/)
- [Instalação em sites não hospedados na Cloudflare](https://developers.cloudflare.com/web-analytics/get-started/)
- [Aplicações de página única](https://developers.cloudflare.com/web-analytics/get-started/web-analytics-spa/)
- [Autenticação da GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/getting-started/authentication/api-token-auth/)
