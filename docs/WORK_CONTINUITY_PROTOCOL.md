# Protocolo de continuidade do trabalho

Este projeto mantém dois níveis de memória para evitar reconstruções depois de
uma interrupção do Codex, troca de agente, limite de uso ou encerramento do app:

- `docs/PROJECT_CONTEXT.md` guarda apenas decisões e estado duráveis;
- `.codex-work-checkpoint.md` guarda a frente ainda em andamento, inclusive a
  próxima ação exata e um retrato automático do Git.

O checkpoint ativo é local e ignorado pelo Git. O protocolo e o programa que o
gera são versionados, portanto o mecanismo continua disponível em qualquer
cópia do projeto sem publicar anotações transitórias ou potencialmente
sensíveis.

## Quando atualizar

1. No início de todo trabalho que possa atravessar mais de uma sessão.
2. Depois de cada marco material concluído.
3. Antes de uma compilação, auditoria ou operação demorada.
4. Assim que surgir um bloqueio ou uma decisão que não pode ser redescoberta.
5. Antes de encerrar a frente, registrando o resultado final no contexto
   durável e só então apagando o checkpoint.

## Conteúdo mínimo

O arquivo deve responder, sem depender da conversa:

- qual é o objetivo completo e o limite de escopo;
- em que etapa o trabalho parou;
- o que já foi concluído;
- quais decisões não podem ser revertidas por engano;
- qual é a próxima ação concreta, com arquivo ou módulo e verificação esperada;
- quais bloqueios dependem de terceiros;
- quais testes já passaram;
- qual é o estado atual da branch e dos arquivos.

Nunca registrar tokens, senhas, chaves de API, cookies, dados pessoais
desnecessários ou o conteúdo de arquivos secretos.

## Uso pelo agente

Criar ou substituir os campos informados:

```bash
npm run checkpoint -- \
  --objective "Objetivo e limite de escopo" \
  --phase "Etapa atual" \
  --completed "Marco já concluído" \
  --decision "Decisão que precisa ser preservada" \
  --next "Próxima ação exata, arquivo e verificação" \
  --blocker "Bloqueio externo ou Nenhum" \
  --verification "Verificação que já passou" \
  --note "Detalhe útil para a retomada"
```

Cada opção de lista pode ser repetida. Campos omitidos preservam o conteúdo
anterior. Executar o comando sem opções atualiza apenas a hora e o retrato do
Git quando já existe um checkpoint.

Ler o estado antes de retomar:

```bash
npm run checkpoint:show
```

Validar que o mecanismo continua incorporado ao projeto:

```bash
npm run continuity:audit
```

Apagar somente depois da conclusão real e da atualização do contexto durável:

```bash
npm run checkpoint:clear
```

## Ordem de retomada

1. Ler integralmente `docs/PROJECT_CONTEXT.md`.
2. Ler `.codex-work-checkpoint.md`.
3. Conferir branch e alterações atuais no Git.
4. Validar se a próxima ação continua coerente com o código.
5. Executá-la diretamente, sem reconstruir todo o histórico da conversa.

Se houver divergência, o código e o Git definem o estado material; o checkpoint
define a intenção e o limite de escopo. Corrija o checkpoint antes de seguir.
