# Operação da versão pública

## Endereço canônico

- Produção: <https://13calendar.pages.dev/>
- Página educacional nativa: <https://13calendar.pages.dev/learn>
- Worker comunitário:
  `13calendar-community-registration.13calendar-community-registration-worker.workers.dev`

Os endereços alternativos e o procedimento de troca ficam em
[`DEPLOYMENT_DOMAINS.md`](DEPLOYMENT_DOMAINS.md).

## Publicação

O build principal gera primeiro os dados de execução e depois a aplicação
Vue/Quasar com HTML estático por rota em `dist/ssg`. Aprenda, Ferramentas,
Calendários, Lua, Notícias e Comunidade são áreas do mesmo produto; `/widget`
tem HTML próprio, mas não entra no sitemap. `dist/spa` é uma saída antiga e
não integra a publicação atual.

Os segredos `CLOUDFLARE_ACCOUNT_ID` e `CLOUDFLARE_API_TOKEN` estão configurados
no repositório público. O workflow `Publicar no Cloudflare Pages` publica cada
alteração aprovada na `main`. A publicação manual de emergência continua
possível com Wrangler.

O fluxo normal parte da `main` privada: `Sincronizar versão pública` executa
`npm run verify` e o dry-run do Worker antes de espelhar a fonte aprovada.
Depois, confira os workflows públicos e a versão servida pelo endereço canônico;
um build local ou um workflow verde, isoladamente, não comprovam a entrega.

Enquanto algum secret estiver ausente, o workflow conclui a conferência sem
expor valores e ignora somente a etapa de publicação. As ações que exigem login
do mantenedor ficam centralizadas em [`OWNER_ACTIONS.md`](OWNER_ACTIONS.md).

## Roteiro de conferência e retenção

Aplica-se a regra permanente local em
`/Volumes/Arquivos/Programas de Programador/PADRAO_RETENCAO_E_LIMPEZA.md`.
Execute esta revisão ao final de **cada** entrega, não como efeito automático do
build nem antes de uma publicação e verificação bem-sucedidas. A mesma conversa
que publicou e conferiu a versão executa a limpeza do próprio escopo: não envie
o plano para uma conversa central nem espere outra pessoa aplicar a exclusão.
Use `Ferramentas Compartilhadas/Retencao de Entregas/limpar.py` com manifesto
explícito, `--planejar`, revisão do plano e `--aplicar`, conforme o README da
ferramenta:

1. Confirme os commits privado e público, o deploy ativo da Cloudflare e as
   páginas e APIs afetadas. Preserve a recuperação mínima se houver falha ou
   conferência pendente; registre o motivo e a condição para retirá-la.
2. Identifique o pacote local atual (`dist/ssg`, quando necessário) e os
   candidatos exatos a limpeza. Preserve fontes, recursos, documentação,
   `package.json`, lockfiles, preferências, dados do D1 e credenciais nos locais
   protegidos. Não trate `node_modules` ou `.wrangler/state` como lixo só pelo
   nome da pasta.
3. Meça cada candidato, confira links simbólicos e processos em uso, e coordene
   qualquer caminho compartilhado com outra tarefa. Só exclua saídas antigas,
   prévias, capturas e caches comprovadamente regeneráveis e dispensáveis.
4. Confirme novamente a permanência do pacote atual e das fontes. Registre os
   caminhos e bytes realmente removidos, o espaço livre observado no volume e
   tudo que ficou pendente de conferência. Se nada for descartável, registre
   isso. Não atribua à tarefa toda a variação de espaço causada por trabalhos
   concorrentes.

Esta é somente limpeza **local**. Histórico de branches, releases, deploys
remotos e dados da Comunidade seguem a política própria de seus serviços; não
os apague por causa deste roteiro. Não esvazie o Lixo global nem substitua as
etapas acima por um `rm -rf` ao final de um script.

## Monitoramento automatizado

- O workflow `Verificar produção` roda diariamente e confere o aplicativo, a
  rota nativa `/learn`, `robots.txt`, `sitemap.xml` e as rotas públicas da
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
- Em cada build: `npm run audit:bundle` impede regressões grandes e silenciosas
  no total de JavaScript e CSS. Ele é executado também por `npm run verify`.
- Em cada release: `npm run verify` exige `npm audit` completo nas árvores do
  aplicativo e do Worker. O override de `minimatch`, a cópia local segura de
  `deepmerge` e o override de `@puppeteer/browsers` só podem ser retirados após
  uma substituição corrigida e verificada; confira também o bundle do Worker.
- Mensalmente: conferir Worker, D1, Turnstile e painel comunitário.
- Em 20 de dezembro e 5 de janeiro: revisar o workflow de fontes oficiais de
  feriados e validar manualmente qualquer candidato antes de publicar.
- Antes de atualizar dependências: executar `npm run verify` numa branch e
  revisar o changelog dos pacotes afetados.
- Em incidente: consultar logs do Worker, preservar o bookmark atual e usar
  Time Travel somente depois de identificar o instante anterior ao problema.
