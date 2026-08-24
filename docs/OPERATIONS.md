# Operação da versão pública

## Endereço canônico

- Produção: <https://13calendar.pages.dev/>
- Página educacional adaptada: <https://13calendar.pages.dev/reference-site/>
- Worker comunitário:
  `13calendar-community-registration.13calendar-community-registration-worker.workers.dev`

Os endereços alternativos e o procedimento de troca ficam em
[`DEPLOYMENT_DOMAINS.md`](DEPLOYMENT_DOMAINS.md).

## Publicação

O build principal sempre gera primeiro os dados de execução e a página
adaptada. Por isso, `npm run build` produz uma pasta `dist/spa` completa e não
permite publicar somente metade da experiência.

Depois que os segredos `CLOUDFLARE_ACCOUNT_ID` e `CLOUDFLARE_API_TOKEN` forem
adicionados ao repositório público, o workflow `Publicar no Cloudflare Pages`
publicará cada alteração aprovada na `main`. A publicação manual de emergência
continua possível com Wrangler.

Enquanto algum secret estiver ausente, o workflow conclui a conferência sem
expor valores e ignora somente a etapa de publicação. As ações que exigem login
do mantenedor ficam centralizadas em [`OWNER_ACTIONS.md`](OWNER_ACTIONS.md).

## Monitoramento automatizado

- O workflow `Verificar produção` roda diariamente e confere o aplicativo, a
  página educacional, `robots.txt`, `sitemap.xml` e as rotas públicas da
  comunidade.
- O workflow `Revisar fontes oficiais de feriados` roda em 20 de dezembro e 5
  de janeiro. Ele apenas abre candidatos para revisão; nenhuma data oficial é
  publicada sem validação humana.
- O contato de segurança público fica em `/.well-known/security.txt`.

## Banco comunitário e recuperação

O D1 usa Time Travel automaticamente. No plano gratuito, a janela de restauração
é de sete dias; não é preciso disparar backups manuais para obter essa proteção.

Antes de qualquer migração destrutiva:

```bash
cd cloudflare/community-registration-worker
npx wrangler d1 time-travel info DB
```

Guarde o bookmark somente no registro operacional privado. Uma restauração
sobrescreve o banco e deve ser feita apenas após confirmar o instante correto:

```bash
npx wrangler d1 time-travel restore DB --bookmark=BOOKMARK_CONFIRMADO
```

Os cadastros pendentes expiram em 60 dias; os recusados, em 30 dias. Perfis
aprovados permanecem até a retirada do consentimento. O agendamento diário do
Worker aplica essa política e preserva os resumos agregados de visita no D1.

## Rotina de manutenção

- Em cada alteração: verificar a execução verde dos workflows.
- Mensalmente: conferir Worker, D1, Turnstile e painel comunitário.
- Em 20 de dezembro e 5 de janeiro: revisar o workflow de fontes oficiais de
  feriados e validar manualmente qualquer candidato antes de publicar.
- Antes de atualizar dependências: executar `npm run verify` numa branch e
  revisar o changelog dos pacotes afetados.
- Em incidente: consultar logs do Worker, preservar o bookmark atual e usar
  Time Travel somente depois de identificar o instante anterior ao problema.
