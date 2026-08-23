# Retrato comunitário com Cloudflare Web Analytics

## Objetivo

A rota `#/community` apresenta um retrato agregado das pessoas que visitam o
projeto: volume aproximado de visitas, páginas vistas, países, atividade diária,
origens e dispositivos. A proposta é mostrar interesse coletivo sem criar perfis
individuais.

## Princípio de privacidade

- A interface pública lê `GET /analytics/stats` no Worker; o JSON estático é
  mantido somente como estado de reserva quando o endpoint não está configurado.
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

O Worker consulta uma janela recente de 89 dias, dentro do limite retornado pela
conta atual, e grava os resultados diários no D1 por operações idempotentes.
Cada nova consulta atualiza os dias ainda presentes na API sem duplicá-los, e o
agendamento diário preserva os dias antigos depois que saem da janela da
Cloudflare. Assim, o painel pode crescer por toda a vida do projeto.

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

Essa redução já ocorre no Worker. A credencial privada possui somente a
permissão **Account Analytics: Read**, e o navegador nunca a recebe. A
configuração usa:

- `CLOUDFLARE_ANALYTICS_API_TOKEN` — secret criptografada no Worker;
- `CLOUDFLARE_ACCOUNT_ID` — conta do Web Analytics;
- `CLOUDFLARE_ANALYTICS_HOST` — hostname público agregado.

A rota pública é atualizada no máximo a cada cinco minutos e a tarefa agendada
roda diariamente às `01:30 UTC`. Se a consulta externa falhar, o Worker entrega
o último retrato preservado. Antes do primeiro retrato real, `status` permanece
como `awaiting_configuration` e não há números fictícios.

## Cadastro voluntário

A área de participação recebe nome público e Instagram, Facebook ou outra rede
somente com consentimento explícito. O GitHub Pages envia a inscrição para um
Worker separado, que valida o Turnstile no servidor, grava o pedido no D1 como
`pending` e publica somente registros aprovados. A ação do widget e o hostname
de emissão também são conferidos; cada token vale para uma única tentativa.

O endereço do Worker e a chave pública ficam na compilação. A chave secreta do
Turnstile e o token administrativo permanecem criptografados no Worker. A rota
oculta `#/community-admin` lista os pedidos pendentes e permite aprovar ou
recusar cada um; o segredo fica somente na sessão da aba. A página comunitária
consulta `GET /members` e exibe apenas os perfis aprovados. Entradas pendentes,
tokens e credenciais nunca fazem parte do GitHub Pages.

## Fontes técnicas oficiais

- [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/)
- [Instalação em sites não hospedados na Cloudflare](https://developers.cloudflare.com/web-analytics/get-started/)
- [Aplicações de página única](https://developers.cloudflare.com/web-analytics/get-started/web-analytics-spa/)
- [Autenticação da GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/getting-started/authentication/api-token-auth/)
