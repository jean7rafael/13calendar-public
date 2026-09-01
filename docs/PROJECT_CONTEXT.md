# Contexto persistente do Calendário 13 Meses

> **Instrução obrigatória para todo agente:** leia este arquivo integralmente
> antes de trabalhar no projeto. Ao concluir cada solicitação relacionada ao
> projeto, atualize este documento na mesma tarefa, inclusive quando o trabalho
> for realizado por um modelo local. Registre somente contexto durável, estado,
> decisões, pendências e validações; não copie a conversa nem inclua segredos.

## Identidade e objetivo

- Aplicativo Quasar/Vue 3 para consultar e converter datas entre o calendário
  gregoriano e o Calendário Fixo Internacional de 13 meses.
- A interface compara os dois calendários e seus encartes de feriados e fases
  da Lua, além de exibir inícios das estações.
- O usuário busca equivalência visual entre os dois lados, preservando as
  diferenças funcionais necessárias do calendário 13.
- A interface possui temas claro e escuro e deve permanecer responsiva, sem
  sobreposição lateral nem mudança arbitrária da largura dos cards conforme o
  texto do mês.

## Fontes de verdade do projeto

- `docs/CALENDAR_13_STANDARD.md`: ordem dos meses, Dias Especiais, conversão e
  modos de exibição dos feriados no calendário 13.
- `docs/HOLIDAY_COUNTRY_STANDARD.md`: fontes, regras históricas e futuras,
  traduções, emojis, substituições, países, regiões e auditorias.
- O código e os testes/auditorias prevalecem quando este resumo estiver
  desatualizado. Nesse caso, corrija este arquivo ao terminar a tarefa.

## Decisões funcionais consolidadas

### Calendários

- Solaris é o sétimo mês e fica entre junho e julho.
- Dias Especiais permanecem no final do ano, com um dia em anos comuns e dois em
  anos bissextos. O Dia do Ano é `XX/01`; o Dia Bissexto é `XX/02` e vem
  imediatamente depois. Seu posicionamento especial não deve ser substituído
  por uma grade centralizada genérica.
- Os seletores não possuem o antigo limite artificial de 1900 a 2100.
- O seletor de anos do calendário 13 segue blocos estáveis de 20 anos, exibindo
  21 valores como o QDate. A seleção não pode reorganizar a sequência para
  colocar o ano escolhido em uma posição fixa.
- O primeiro dia da semana deve permanecer domingo nos dois calendários,
  independentemente do idioma.
- O calendário 13 oferece `Datas adaptadas` e `Datas correspondentes` para os
  feriados. Datas fixas e regras semanais são reaplicadas no modo adaptado;
  calendários religiosos/lunissolares sem mês homônimo preservam o instante
  físico. A Páscoa ocidental adaptada e suas dependências têm cálculo próprio.
- Ambos os calendários usam o mesmo botão Hoje. Feriados e fases da Lua
  apresentam a data equivalente do calendário oposto; no lado gregoriano, a
  tooltip usa somente a abreviatura `IFC`.
- As duas colunas permanecem lado a lado quando cabem. Abaixo de 760 px, o
  seletor Gregoriano/13 meses deixa visível uma coluna por vez, sempre mantendo
  juntos feriados, calendário e fases da Lua do lado ativo.

### Feriados e países

- As ocorrências são calculadas sob demanda em uma janela de cinco anos: ano
  selecionado, dois anteriores e dois posteriores. Não gerar tabelas fixas de
  1900 a 2100.
- O catálogo geográfico completo permanece selecionável. Países atendidos
  pela `date-holidays` recebem feriados civis; os demais continuam disponíveis
  com eventos astronômicos até receberem uma fonte apropriada.
- A base atual possui 251 opções selecionáveis entre países e territórios:
  206 têm calendário civil na fonte e 45 permanecem somente com os eventos
  astronômicos. As auditorias civis citam 206, mas nenhuma das 251 opções foi
  removida do menu.
- O apêndice oficial separado cadastra os 45 casos sem calendário civil,
  registra portais governamentais e incorpora somente ocorrências confirmadas,
  com fonte e validade. O gerador indica o apêndice nos metadados da base.
- A revisão anual do apêndice deve pesquisar o ano seguinte em fontes oficiais,
  produzir candidatos auditáveis e exigir validação antes da publicação. A
  automação está programada para 20 de dezembro e 5 de janeiro. Ela sempre
  verifica os 45 casos e inclui os 206 calendários civis quando a base estiver
  há pelo menos 120 dias sem atualização ou quando a varredura completa for
  solicitada manualmente.
- Brasil, Estados Unidos, França, Espanha, Alemanha e Rússia mantêm catálogos
  editoriais complementares à base internacional. Entradas equivalentes devem
  ser mescladas em uma única linha.
- No gregoriano, um feriado transferido preserva a data civil e ganha uma
  segunda ocorrência observada com o mesmo nome, emoji `↪️` e explicação
  somente no tooltip. No calendário 13, datas apenas observadas são omitidas;
  períodos oficiais de vários dias permanecem.
- Nomes devem ser curtos, específicos e compreensíveis. Evitar rótulos
  genéricos como `Feriado` ou `Dia adicional`.
- Conceitos equivalentes devem compartilhar o mesmo emoji globalmente,
  preservando primeiro a curadoria dos seis países originais. Emojis genéricos
  são o último recurso.
- A resolução semântica dos emojis internacionais usa sempre o nome canônico
  estável da definição da fonte, nunca o rótulo já traduzido para a interface.
  Assim, idioma e navegador não podem transformar o mesmo feriado em alfinete,
  bandeira ou calendário genérico.
- As traduções dos feriados são centralizadas e incrementais. Não duplicar
  todos os nomes em cada arquivo de idioma e não usar APIs pagas.
- Sequências que repetem o mesmo conceito em várias datas usam famílias de
  tradução: um termo canônico por idioma e a data formatada por `Intl`. A
  auditoria dedicada deve cobrir todo idioma novo antes da publicação.

### Idiomas e organização geográfica

- Idiomas atuais: português, inglês, alemão, francês, italiano, espanhol,
  russo, árabe, hindi, chinês, japonês e coreano.
- Conteúdo público novo é entregue integralmente nos 12 idiomas. Fallback
  editorial literal em inglês não é aceito em outro catálogo; as únicas
  igualdades permitidas são nomes próprios, números históricos e templates sem
  palavras traduzíveis. `education:audit` protege Aprenda, Ferramentas e
  Notícias contra essa regressão.
- Em Notícias, o título original da matéria permanece no idioma da publicação.
  Resumos escritos pelo projeto e rótulos de idioma são localizados nos 12
  idiomas em `educationResourceTranslations.js`; a auditoria exige cobertura
  de todos os 11 IDs e impede retorno do resumo em inglês.
- Na primeira visita, o idioma segue o idioma principal do navegador quando
  ele pertence aos 12 idiomas suportados; idiomas não reconhecidos usam
  inglês dos Estados Unidos. Nas visitas seguintes, prevalece a escolha salva.
- Na primeira visita, o país dos feriados segue primeiro a região explícita
  das preferências do navegador, como `pt-BR`, `en-GB` ou `es-MX`. Idiomas sem
  região usam a região provável do padrão `Intl`; se nenhuma opção cadastrada
  puder ser inferida, o fallback é Estados Unidos. Não usar geolocalização,
  consulta por IP nem permissão. Depois da primeira escolha manual, o país
  salvo sempre prevalece.
- A ordem do menu acompanha os continentes: Américas (América do Norte,
  América Central, Caribe e América do Sul), Europa, Ásia, África, Oceania e
  Antártida. A ordem interna completa fica em `HOLIDAY_COUNTRY_STANDARD.md`.
- Existem prioridades editoriais dentro de algumas regiões. Não substituir
  essas prioridades por ordenação alfabética global.
- Nos nomes das regiões, palavras principais usam inicial maiúscula quando o
  sistema de escrita diferencia caixa. Em idiomas latinos, artigos,
  preposições e contrações permanecem minúsculos: `Todas as Regiões`,
  `América do Sul`, `Europa del Este`, `Europe de l'Ouest` e
  `Tutte le Regioni`.
- Nomes de países usam `Intl.DisplayNames`; divergências editoriais pequenas
  ficam nas exceções localizadas do seletor, sem alterar os códigos dos países.

## Convenções de implementação

- Comentários de código ficam em português, com títulos de seção semelhantes
  aos componentes existentes.
- Não apagar nem reverter alterações existentes sem confirmar que pertencem à
  tarefa atual.
- Não criar commits sem pedido explícito do usuário.
- Manter os dados gerados fora deste documento; registrar apenas o mecanismo,
  a decisão ou o resultado resumido.
- Para mudanças comuns, executar `npm run lint` e `npm run build`. Para feriados,
  seguir a sequência completa de `docs/HOLIDAY_COUNTRY_STANDARD.md`.
- Comparações diretas de datas usam o nome completo do dia da semana nos dois
  calendários. Em português, remover sempre o sufixo `-feira`; quando o sistema
  de escrita diferencia caixa, o nome destacado começa por maiúscula.
- Botões textuais pertencem obrigatoriamente a uma das três famílias
  compartilhadas: primário violeta, secundário neutro preenchido ou terciário
  suave/contornado. Botões apenas de ícone e seletores segmentados são exceções
  funcionais, não uma quarta família visual.
- A barra superior mantém sempre, nesta ordem, Aprenda, Ferramentas,
  Calendários, Lua, Notícias e Comunidade. A rota ativa usa o mesmo realce da
  interação, o tema
  é a última ação e, em telas pequenas, os cinco destinos passam para a gaveta
  da direita sem desaparecer da navegação.
- `AppFooter` é a única composição de rodapé das páginas públicas. Ele tem
  altura uniforme e contém somente os quatro apontamentos com ícones: fontes
  de dados, Wikipédia, código-fonte e aviso de privacidade. Não criar versões
  compactas, estruturas paralelas nem links para as próprias páginas do
  produto. A faixa `Datas merecem contexto` e seus cartões pertencem somente à
  página dos calendários e ficam fora do rodapé.
- No rodapé, Fontes de dados abre a seção homônima de
  `docs/releases/README_2.0.md` no GitHub; Código-fonte abre a raiz do
  repositório público. A documentação de fontes agrupa bases civis, apêndice
  governamental, Astronomy Engine, NASA/GSFC, Sol, Lua e convenções do projeto.
- Roxo, verde e âmbar são as famílias cromáticas oficiais, com papéis
  semânticos uniformes nos temas claro e escuro descritos em
  `docs/UI_COLOR_PALETTE.md`. Avisos reutilizam `AppNoticePanel`; não duplicar
  cores nem geometrias locais.
- Aberturas equivalentes usam `AppPageHero`: Calendários recebe o ícone de
  calendário, Notícias o de jornal e somente Comunidade conserva o globo.
- Aprenda preserva uma abertura própria de comparação: `Seu calendário` e IFC,
  `vs.` central, gradientes, anos, dias reais do mês gregoriano, 28 dias do mês
  fixo e relógio externo. As ações mantêm texto e seta na mesma linha. Sua visão
  anual combina 13 meses e Dias especiais: sete colunas por duas fileiras no
  desktop e duas colunas no celular, com o resumo ao lado de dezembro, células
  numéricas sem caixas coloridas, alturas uniformes e soma `364 + 1`, com outro
  `+ 1` surgindo somente em ano bissexto.
  A navegação anual reserva o lugar de Hoje para manter `‹ ano ›` centralizado.
- A grade anual ocupa até 1700 px e mantém sete colunas somente a partir de
  1580 px; antes de as abreviações se sobreporem, passa a quatro e, até 860 px,
  a duas. Os cabeçalhos usam fonte de 8 px. O dia atual usa fundo translúcido
  roxo escuro ou rosa escuro no domingo, com contraste nos dois temas. Solaris
  mantém os dias úteis na cor normal do tema.
- A página Aprenda conserva cinco fatos estruturais, mês modelo com título
  externo e domingos rosados, linha do tempo histórica alternada, seis perguntas
  com hover uniforme, destaque Kodak e a seção integral do Sabá com duas
  alternativas, ciclos comparados, limitações e fontes. A alternativa de ciclos
  paralelos é descrita como um calendário religioso de uso comunitário, análogo
  ao convívio de calendários lunares ou lunissolares com o calendário civil, e
  explicita os conflitos causados quando o sétimo dia deixa de coincidir com o
  sábado ou domingo civil.
- Entre o Sabá e a contribuição pública existem três seções de solução prática.
  A primeira divide os 364 dias regulares em quatro trimestres fiscais iguais de
  13 semanas e traz um mapa interativo que alterna a camada fiscal com a
  escolar/acadêmica. Na camada escolar, os meses 1, 7 e 13 formam 12 semanas de
  férias; as 40 semanas letivas restantes podem aparecer como quatro bimestres de
  10, três trimestres de 13 + 14 + 13 ou dois semestres de 20. Equinócios e
  solstícios são aproximados sempre na penúltima semana de cada trimestre fiscal,
  as semanas 12, 25, 38 e 51. O seletor Norte/Sul inverte as estações e reutiliza
  os emojis do calendário: outono rosa, inverno roxo, primavera verde e verão
  âmbar. No modo fiscal, cada bloco completo de 13 semanas assume a cor da
  estação ligada ao seu marco. Na camada escolar, bimestres usam rosa, roxo,
  verde e amarelo no Sul ou verde, amarelo, rosa e roxo no Norte; trimestres
  usam as três primeiras cores da sequência; semestres usam rosa/verde no Sul
  ou verde/rosa no Norte. Os mini meses usam as abreviações do catálogo sem
  reticências. Um card
  editorial sugere substituir gradualmente os nomes baseados em meses por termos
  baseados em semanas. A segunda seção compara usos para o Dia do Ano e o Dia
  Bissexto. A terceira separa a data original de um feriado da eventual folga
  observada: a primeira segunda-feira é sempre o dia 2 e a última sexta-feira
  sempre o dia 27, mas essas janelas acomodam feriados existentes e não criam
  automaticamente 26 novas folgas anuais. A resolução geral dos obstáculos vem
  imediatamente depois.
  A Lua e a Metodologia vivem juntas na rota pública `/moon`, acessível pela
  barra principal. Em tela larga, os quatro cards 2 × 2 da resolução igualam, em conjunto,
  a altura do formulário; empilhados, retomam altura natural. A votação permanece
  separada e usa quatro expressões Material nas cores verde, roxa, âmbar e rosa,
  com a assinatura `13 ● MONTHS ● CALENDAR`. Voto e relato podem ser ligados
  independentemente ao perfil aprovado da Comunidade mediante o código privado,
  sem login. A API pública mostra somente que houve voto, nunca sua opção, e
  abre o relato completo por um segundo ícone. Respostas anônimas são listadas
  depois dos participantes apenas pelo título. `Faça parte` fica imediatamente
  abaixo do aviso verde e antes da vitrine comunitária.
- Toda comparação direta usa `buildDateComparisonPresentation`, mostra o ano
  nos dois calendários e reserva a mesma altura para os rótulos, inclusive em
  widgets, prévias e imagens geradas. A ordem mês/dia vem de `Intl` para cada
  idioma e é igual nos dois lados. `AppComparisonDateTitle` impõe duas linhas
  universais: `dia da semana ·` na primeira e dia/mês na segunda. No comparativo
  de Aprenda, o maior texto do par define uma única escala para as duas colunas;
  a redução nunca acontece em apenas um lado.
- Na menor largura, o seletor Gregoriano/13 meses inclui uma orientação traduzida
  nos 12 idiomas: girar a tela ou usar uma tela maior apresenta os calendários
  lado a lado. O aviso permanece oculto quando as duas colunas já estão visíveis.
- Seletores gregorianos usam `AppDateInput`, com digitação e janela de dia, mês
  e ano; campos isolados de ano usam `AppYearInput`. `type="date"` é proibido e
  auditado. No aniversário, o ano da comemoração vem primeiro e referencia o
  seletor posterior de dia/mês, garantindo os dias da semana daquele ano sem
  repetir a escolha do ano. Placeholders de formato ficam dentro do campo para
  não alterar a altura das linhas. `hide-bottom-space`, alinhamento pelo topo e
  ações de 56 px evitam degraus em formulários horizontais como Favoritos.
- Datas IFC regulares usam `AppInternationalFixedDateInput`, com um único campo
  e popup de 13 meses por 28 dias. No conversor IFC → Gregoriano, o campo fica
  invisível mas conserva seu espaço nos dias especiais; o seletor de ano não
  muda de posição. Dia Bissexto é desativado nos anos comuns e uma seleção
  inválida volta automaticamente a Dia regular quando o ano muda.
- A curadoria editorial é a página independente `/news`; `/learn` não deve
  incorporar novamente a lista completa de notícias e outros projetos.

## Continuidade com modelo local

- Ollama instalado no Mac com o modelo `gpt-oss:20b`.
- Comando de contingência a partir da raiz do projeto:

  ```bash
  codex --oss --local-provider ollama -m gpt-oss:20b
  ```

- O novo agente deve receber automaticamente este fluxo por meio de
  `AGENTS.md`, ler este documento antes de agir e atualizá-lo ao terminar.
- O modelo local compartilha os arquivos, mas não o histórico desta conversa;
  este documento é a principal passagem de contexto entre os agentes.
- Trabalhos longos usam também `.codex-work-checkpoint.md`, arquivo local
  ignorado pelo Git que registra a frente ativa, decisões, verificações,
  bloqueios, a próxima ação exata e um retrato automático da branch. Este
  documento continua reservado ao estado durável; o checkpoint serve apenas à
  retomada do que ainda não terminou.
- `npm run checkpoint --` cria ou atualiza o checkpoint, `checkpoint:show` o
  exibe e `checkpoint:clear` só deve ser usado depois da conclusão real e da
  atualização deste contexto. `docs/WORK_CONTINUITY_PROTOCOL.md` define a
  ordem de retomada e `npm run continuity:audit` impede que o mecanismo seja
  removido silenciosamente da verificação integral.
- O histórico bruto das sessões do aplicativo e do CLI fica normalmente em
  `~/.codex/sessions`. O arquivo bruto desta tarefa está registrado em
  `docs/agent-conversations/INDEX.md`.
- As exportações legíveis ficam em `docs/agent-conversations/exports`. Essa
  pasta é compartilhada localmente pelos agentes, mas ignorada pelo Git porque
  pode conter conversas extensas ou sensíveis.
- O modelo local executado sem mudar `CODEX_HOME` também grava sua sessão em
  `~/.codex/sessions`. Ele deve registrar o caminho no índice compartilhado e
  pode gerar uma versão Markdown com
  `npm run conversation:export -- CAMINHO_JSONL`.
- Para a continuidade do projeto, tratar o modelo local como auxiliar
  supervisionado: adequado para buscas, explicações, traduções, mudanças
  pequenas e mecânicas com validação. Reservar regras calendáricas, grandes
  refatorações, auditorias, decisões arquiteturais e inspeção de imagens para
  um modelo de fronteira sempre que possível.
- A discussão detalhada sobre Ollama, consumo, desempenho e hardware foi
  separada para a tarefa `019fe48c-f8d1-7f62-b798-593d51ccdf6d`. Este documento
  deve manter somente as instruções necessárias para a continuidade do
  Calendário 13.

## Estado atual

- **Última atividade:** 2026-09-01.
- Em 2026-08-11, a pasta `Programas de Programador` foi transferida do Desktop
  sincronizado pelo OneDrive para `/Users/jean7rafael/Downloads`. O repositório
  ativo deste aplicativo passou a ficar em
  `/Users/jean7rafael/Downloads/Programas de Programador/13calendarApp/13calendar`;
  o remoto `origin` foi verificado como `jean7rafael/13calendar`, e a `main`
  continuou alinhada e íntegra em relação ao GitHub. Após reinstalar as
  dependências na nova pasta, `npm run lint` e `npm run build` passaram.
- O mecanismo de continuidade foi instalado com `AGENTS.md` na raiz e este
  contexto persistente. Novas tarefas devem lê-lo no início e atualizá-lo ao
  terminar.
- O histórico entre agentes passou a usar um índice comum e exportações
  legíveis. Esta solicitação não alterou o funcionamento do aplicativo.
- A tarefa principal foi exportada para Markdown com 622 mensagens. O arquivo
  legível tem cerca de 609 KB; o JSONL bruto, que também contém ferramentas e
  dados internos, tem cerca de 92 MB.
- Uma sessão local de diagnóstico também foi exportada e registrada no índice.
- A expansão do catálogo geográfico, a reorganização regional, as traduções,
  as fontes oficiais e o acabamento visual foram incorporados à `main` pela
  PR `jean7rafael/13calendar#1`, mesclada em 2026-08-11. A branch temporária
  `agent/holiday-coverage-notices` foi removida depois da mesclagem.
- O repositório principal continua privado e, no plano atual do GitHub, a
  proteção da branch `main` exige GitHub Pro ou que o repositório seja tornado
  público. Para o fluxo individual atual, o aviso pode ser ignorado: não mudar
  plano nem visibilidade apenas por ele. Reavaliar a proteção se houver outros
  colaboradores, publicação do repositório principal ou integração contínua
  com verificações obrigatórias.
- A capitalização editorial das regiões latinas foi revisada.
- `npm run lint` e `npm run build` passaram em 2026-08-09 após a instalação do
  mecanismo de continuidade e a medição do modelo local.
- A identidade inspirada em `13months.net` foi aplicada à interface principal:
  fonte Inter, neutros stone/slate, cartões arredondados, bordas de baixo
  contraste e acentos violeta/índigo. O aplicativo preserva o seletor manual de
  tema claro ou escuro.
- O fundo da página usa o mesmo degradê vertical discreto da referência:
  `stone-100 → stone-50 → stone-100` no tema claro e
  `#020617 → #0f172a → #020617` no escuro.
- A tipografia calendárica foi medida no site de referência e normalizada nos
  dois calendários: Inter 14 px, peso 400 e linha de 20 px para números, datas,
  meses e anos; Inter 12 px, peso 500 e linha de 16 px nos dias da semana.
- Os dias dos dois calendários usam células quadradas individuais, com cantos
  arredondados e espaço entre elas. Sábados e domingos compartilham um fundo
  e uma fonte iguais aos sábados do site de referência: no tema claro,
  `#eef2ff` e `#6366f1`; no escuro, índigo 500 a 5% no fundo e índigo 400 a
  70% no texto. Os demais dias usam uma superfície quase igual à do card.
- A data selecionada colore a célula inteira e recebe uma borda interna clara
  de 2 px, como no site de referência. Não reintroduzir o antigo círculo em
  torno apenas do número.
- O contorno nativo do QDate para o dia atual foi desativado somente no
  calendário gregoriano; a seleção preenchida continua funcionando normalmente.
- As grades reais possuem largura máxima comum de 350 px e células 1:1. O
  alinhamento da primeira linha e o tamanho das células foram medidos como
  equivalentes nos dois calendários.
- Fases da Lua aparecem como emojis visuais de 5 px no canto inferior direito,
  afastados 4 px das bordas. O aro permanece em uma caixa de 8 px e o glifo
  interno parte de 10 px com escala de 50%; essa separação impede o Safari de
  ampliar Apple Color Emoji para fora do contorno. Uma legenda comum identifica
  as quatro fases acima dos cards.
- Os marcadores lunares possuem tooltip traduzido nos dois calendários. Em
  português, os rótulos visíveis são `Lua Nova`, `Lua Crescente`, `Lua Cheia`
  e `Lua Minguante` em todos os cards, legendas e tooltips.
- Células gregorianas usadas apenas para completar o início ou o fim da grade
  permanecem no fluxo para preservar o posicionamento, mas ficam integralmente
  invisíveis, inclusive nas colunas de sábado e domingo.
- Acima da legenda, a apresentação usa as chaves
  `introduction.eyebrow`, `introduction.title` e
  `introduction.description`, localizadas nos 12 idiomas. O texto apresenta
  diretamente a função do aplicativo: conversão de datas, comparação dos dois
  calendários, feriados por país e fases da Lua. Não reintroduzir frases fixas
  diretamente em `IndexPage.vue`.
- O cabeçalho mantém tema, Hoje e retorno à página inicial nessa ordem. O
  botão Hoje não possui fundo permanente; recebe realce somente na interação.
  O botão `X` abre `reference-site/index.html`, com tooltip localizada nos 12
  idiomas. Na rota comunitária, Hoje dá lugar ao retorno para os calendários.
  Todas as tooltips do aplicativo centralizam também textos quebrados.
- O botão de tema do aplicativo principal usa os mesmos SVGs de Lua e Sol da
  página incorporada; não voltar a misturar esses desenhos com os ícones
  Material antigos.
- A identidade da aba usa a marca curta `13 Calendar` e um favicon próprio:
  quadrado arredondado com o mesmo degradê índigo/violeta e o número `13` do
  selo do cabeçalho. O título combina a marca com `app.browserTitle`, localizado
  nos 12 idiomas e atualizado imediatamente após a troca de idioma; o fallback
  estático em inglês é `13 Calendar — Date Converter`. SVG, PNGs de 16 a 180 px
  e ICO compartilham o mesmo desenho.
- A fonte incorporada do site de referência fica isolada em
  `vendor/13months-site`; a compilação estática fica em
  `public/reference-site`. O primeiro elemento visível da página é um botão
  centralizado `Date conversion, holidays & moon phases`, que retorna a `../#/`.
  `vendor/13months-site/UPSTREAM.md` registra repositório, commit, alterações e
  a ausência de licença no original. Por decisão explícita do mantenedor, a
  adaptação foi publicada de forma experimental enquanto o pedido #2 aguarda
  resposta; qualquer solicitação do autor deve ser aplicada prontamente.
- A página incorporada possui cabeçalho próprio com menu lateral contendo
  somente os 12 idiomas, o título `IFC - International Fixed Calendar` e apenas
  o botão de tema à direita. O menu espelha o principal: cabeçalho localizado
  `Idioma da interface`, botão `X`, idioma ativo no topo, fundo opaco e bloqueio
  da página durante a navegação. A fonte `shared/interfaceLanguages.ts`
  centraliza ordem, bandeiras, nomes e regiões para as duas aplicações; a
  seleção de países permanece exclusiva do conversor. Idioma e tema
  compartilham o armazenamento da página principal. Seu catálogo contém as
  mensagens completas dos 12 idiomas; capitalização e variáveis foram
  auditadas antes da compilação.
- No menu lateral principal, o documento deixa de rolar enquanto a gaveta está
  aberta. `Interface language` permanece fixo e o idioma ativo aparece sempre
  primeiro, com fundo opaco, enquanto os demais passam por trás dele. O título
  `Feriados por país` trava depois de um respiro equivalente a uma opção de
  idioma. Esse respiro pertence ao fim da lista: ele só chega à área fixa após
  o último idioma e então permanece preso, com fundo opaco. A caixa de seleção
  da região permanece fixa junto ao título.
  Dentro da lista, o nome da região atual fica preso abaixo da caixa até ser
  substituído pelo próximo título. As faixas têm fundos opacos, alturas
  adjacentes e não deixam países ou realces vazarem entre elas. O botão `X` no
  cabeçalho fecha a gaveta de forma explícita. O bloco da última região ocupa,
  no mínimo, a área restante da gaveta: a Antártida alcança a posição aderente,
  mas a rolagem termina com todos os seus países ainda visíveis.
- A barra da gaveta é responsiva: ao chegar ao fim de uma única região cujos
  países cabem integralmente na altura disponível, o indicador desaparece.
  Ele reaparece ao voltar para os idiomas e permanece visível em regiões longas
  ou em `Todas as Regiões`. A medição usa o DOM renderizado e é refeita ao
  redimensionar a janela; não depende de uma contagem fixa de países.
- O botão `X` do cabeçalho principal continua levando à cópia local integrada
  (`reference-site/index.html`); dentro dela, a seta circular ao lado do botão
  de conversão leva ao site original `13months.net`.
- A rota `#/community` reutiliza o mesmo `MainLayout`, tema e menu lateral. Ela
  é acessada por um link discreto `Veja quantos nós somos →` no fluxo superior
  do conversor e da página incorporada. O link não cobre conteúdo em telas
  móveis e acompanha o idioma salvo nas duas aplicações.
- Na rota comunitária, o menu lateral contém somente os idiomas, como a página
  incorporada. A escolha de regiões, países e o popup posterior à troca de
  idioma permanecem exclusivos do conversor. O retorno aos calendários aparece
  apenas no conteúdo da página comunitária, sem um controle duplicado na barra.
- A rota de privacidade tem título próprio e localizado na barra superior e
  oferece somente a escolha de idioma. Como ela não exibe feriados, trocar o
  idioma nessa página nunca abre o popup de país; esse popup e a seleção
  geográfica pertencem exclusivamente ao conversor.
- A página comunitária possui faixa de totais, mapa de calor de seis meses,
  ranking por país, páginas, origens e dispositivos, além de filtro mundial ou
  por país. Os 38 textos estão localizados nos 12 idiomas em
  `src/i18n/community.js`; não espalhar esse catálogo pelos arquivos gerais.
- Os números comunitários vêm exclusivamente do retrato agregado
  `public/data/community-stats.json`. Enquanto a Cloudflare não estiver
  configurada, o arquivo permanece em `awaiting_configuration`, a interface
  mostra traços e um aviso honesto e nenhum número fictício é publicado.
  `docs/CLOUDFLARE_COMMUNITY_ANALYTICS.md` registra o contrato e a separação
  entre o token público do beacon e a credencial privada da API.
- O beacon da Cloudflare está configurado nas compilações de produção das duas
  aplicações para o site `jean7rafael.github.io`. O identificador do site é
  público e fica fora da compilação local; a credencial privada da GraphQL
  Analytics API nunca pode entrar em variável `VITE_`, JavaScript público ou
  arquivo versionado.
- As sete abreviações dos dias da semana da página incorporada possuem
  curadoria explícita nos 12 idiomas. `Sun` significa domingo (`Dom` em
  português); o nome `Sol` fica reservado ao sétimo mês. Dias da semana e
  datas de destaque usam inicial maiúscula quando o idioma possui caixa.
- A ordem gramatical das datas da página incorporada usa
  `Intl.DateTimeFormat.formatToParts`. Ela foi conferida nos 12 idiomas:
  português, inglês, alemão, francês, italiano, espanhol, russo, árabe, hindi,
  chinês, japonês e coreano. O mês `Sol` substitui somente a parte do mês sem
  alterar a ordem natural de cada idioma.
- Cabeçalhos, primeiras linhas e textos de data selecionada foram medidos como
  alinhados entre os calendários; não compensar novamente sem uma nova medição.
- Os dois cards de calendário possuem títulos localizados: o gregoriano usa
  `Seu Calendário` e o outro, `Calendário Fixo Internacional`. Os títulos
  seguem a referência em caixa alta, espaçamento amplo e cores slate/índigo.
  A base mostra a duração do mês visível no gregoriano e a constância de
  28 dias nos 13 meses regulares; o número possui peso e cor próprios, e a
  frase fica centralizada entre a data selecionada e a base. Ela não aparece
  no painel independente de Dias Especiais. A altura comum dos dois cards é
  520 px.
- Dias Especiais possuem um painel inspirado na referência, com Dia do Ano,
  Dia Bissexto, explicações e totais 364 + 1 (+1), localizado nos 12 idiomas.
  Em ano comum, o Dia Bissexto fica desativado. Em 2028, a Lua Cheia foi
  validada no Dia Bissexto com emoji e tooltip no canto inferior direito.
- Os encartes de feriados e fases da Lua têm respiro interno para que o hover
  não toque as bordas. A altura compacta de 246 px reserva 185 px para cinco
  linhas. A lista usa a altura real do conteúdo: a barra fina aparece somente
  quando linhas adicionais ou textos quebrados realmente transbordam. A
  rolagem fica contida no encarte e não continua na página ao atingir o limite.
- Os dois calendários e os dois encartes lunares também contêm a rolagem
  somente quando zoom ou métricas de fonte criam mais de 8 px de
  transbordamento real. A contenção CSS permanente foi removida: sem uma
  barra interna efetiva, a roda sempre continua rolando a página; quando a
  barra existe, o gesto permanece no card ao atingir o limite.
- O painel de Dias Especiais possui sua própria altura rolável e barra fina
  revelada somente na interação. Isso evita o corte de descrições e totais no
  Safari sem acrescentar uma barra quando todo o conteúdo cabe normalmente.
- Como Dias Especiais não exibem dias da semana, sua linha transparente foi
  reduzida para 16 px. O espaço recuperado mantém a linha `Total` integralmente
  visível no Safari sem deslocar a data selecionada na base do card.
- A ativação da rolagem dos feriados conta `date` no calendário gregoriano e
  `date13` no calendário 13; não usar a propriedade inexistente `data`.
- Os feriados russos de Ano-Novo mantêm separadamente 1, 2, 3, 4, 5, 6 e 8 de
  janeiro, com o Natal Ortodoxo em 7 de janeiro. Conceitos repetidos em várias
  datas não podem ser mesclados apenas por semântica; a regra de mesclagem
  entre datas distintas fica reservada a um conceito único ou a uma
  transferência identificada.
- A família russa de Ano-Novo usa terminologia consistente nos 12 idiomas; em
  português, todas as linhas usam `Feriado de Ano Novo — <data>`. A auditoria
  `holidays:translation:audit` protege a família e o cache gerado.
- Os nomes das fases da Lua usam iniciais maiúsculas em todas as palavras nos
  idiomas com distinção de caixa; escritas sem essa distinção permanecem
  naturalmente inalteradas.
- A rota e o componente temporários `/visual-preview` foram apagados depois da
  migração; não existe mais botão de paleta no cabeçalho.
- `npm run lint` e `npm run build` passaram em 2026-08-09 após a migração e
  os ajustes finais. Os temas claro e escuro, os Dias Especiais, os tooltips
  lunares e os encartes sem rolagem indevida foram inspecionados no navegador.
- Em 2026-08-09, a sequência completa de auditorias de feriados passou para a
  janela 2024–2028: 206 países, 16.887 ocorrências civis, 16.890 ocorrências
  no calendário 13, 53.676 verificações semanais, nenhuma regra desconhecida
  e 799 ocorrências híbridas auditadas. A tradução gratuita incremental foi
  exportada/importada, a família russa passou nos 12 idiomas, e `lint` e
  `build` terminaram sem erros. Janeiro russo foi inspecionado no navegador
  com nove linhas, rolagem interna ativa e datas 3 e 8 sem perda ou duplicação.
- Em 2026-08-09, o cabeçalho de integração visual deixou de conter textos
  fixos em português e passou a responder imediatamente à troca de idioma nos
  12 catálogos. A presença das três chaves foi auditada; `lint`, `build` e
  `git diff --check` passaram.
- Em 2026-08-09, a navegação entre o aplicativo e a cópia estática do site de
  referência foi validada nos dois sentidos no navegador. O fundo inicial de
  Hoje, a ordem dos botões, a rota do `X` e o alinhamento central das tooltips
  foram verificados. A compilação do site Solid/Vite e `lint`, `build` e
  `git diff --check` do aplicativo passaram; as dependências de produção do
  site incorporado passaram em `npm audit --omit=dev` sem vulnerabilidades.
- Em 2026-08-09, a rolagem das quatro listas internas passou a usar contenção:
  ao atingir o início ou o fim, o movimento não é transferido para a página.
  O calendário 13 omite ocorrências `observed` ou de tipo `substitute`; blocos
  civis oficiais, como os vários dias das férias russas de Ano-Novo, permanecem.
  Definições editoriais substitutivas são normalizadas automaticamente como
  observadas. As auditorias do calendário 13, de mesclagem e do apêndice
  oficial, além de `lint` e `build`, passaram após o ajuste.
- Em 2026-08-09, a varredura local das 38 fontes cadastradas no apêndice obteve
  resposta válida de 32 fontes e encontrou candidatos de 2026 em 23 delas;
  sete documentos exigem leitura manual. O relatório ficou em
  `holiday-source-review/generated/2026.json`. Depois de revisão humana, o
  apêndice passou a publicar 251 ocorrências em 16 países ou territórios.
- Em 2026-08-10, o encarte gregoriano passou a avisar somente a ausência de
  feriados governamentais confirmados no ano. O aviso cobre todo o corpo do
  card, fecha manualmente ou em dez segundos e deixa explícito que eventos
  astronômicos, datas religiosas calculáveis e datas comemorativas continuam
  disponíveis. A matriz completa está em
  `docs/OFFICIAL_HOLIDAY_COVERAGE.md`.
- Em 2026-08-10, os dias da semana destacados no topo da página incorporada
  passaram a omitir somente o sufixo português `-feira`, evitando quebra de
  linha sem alterar os outros idiomas nem os textos corridos.
- A frase que acompanha o número 28 na página incorporada preserva em todos os
  idiomas o sentido de `every month`: em português, `28 dias em todos os
meses`. As traduções têm curadoria explícita para não virarem uma média como
  `28 dias por mês` em futuras regenerações.
- As frases do Dia Bissexto da página incorporada também têm curadoria nos 12
  idiomas. A linha curta e a descrição sempre informam que ele vem
  imediatamente depois do Dia do Ano, sem os sentidos incorretos de apenas
  citar o Dia do Ano ou dizer que ele está "incluído".
- Na versão 1.0, o `README.md` ainda descrevia a demonstração adaptada e o pedido
  de autorização enviado em `Andree37/13-months#2`. A versão 2.0 substituiu esse
  frontend por conteúdo Vue/Quasar autoral; em 28 de agosto, a issue foi
  reduzida a um aviso neutro de independência e referência e encerrada, sem
  obrigação ou dependência pendente.
- Em 2026-08-10, a troca de meses do QDate gregoriano passou a ocultar apenas a
  grade que sai. A nova grade mantém o movimento lateral nativo, coerente com
  os demais carrosséis, sem sobrepor números antigos e novos.
- Em 2026-08-10, a transição do QDate voltou a recortar a grade durante a
  navegação, eliminando o mês atual que permanecia visível na borda. O
  contorno nativo de hoje nos dias, meses e anos continua removido.
- Em 2026-08-10, os nomes das 251 ocorrências do apêndice oficial entraram no
  catálogo central incremental e receberam traduções locais nos 12 idiomas
  sem API paga.
- Em 2026-08-10, a sequência completa de feriados passou novamente na janela
  2024–2028: 206 países, 16.887 ocorrências civis, 16.890 ocorrências no
  calendário 13, 53.676 verificações semanais, nenhuma regra desconhecida,
  799 ocorrências híbridas, 45 casos/251 ocorrências no apêndice, além de
  `lint`, compilação e `git diff --check` sem erros.
- Em 2026-08-10, o cache monolítico de traduções de feriados deixou de entrar
  no primeiro carregamento. `npm run holidays:runtime` gera 223 pacotes por
  país/catálogo em `public/holiday-data/translations`; os dois encartes baixam
  e compartilham somente o país selecionado. O maior arquivo inicial caiu de
  cerca de 8,6 MB para 1,69 MB (307,96 KB compactado), sem alterar os cálculos.
- A versão pública limpa está em
  `https://github.com/jean7rafael/13calendar-public` e é servida por GitHub
  Pages em `https://jean7rafael.github.io/13calendar-public/`. Ela exclui
  `.env.local`, conversas e instruções internas, mas passou a incluir a fonte
  adaptada em `vendor/13months-site` e sua compilação em
  `public/reference-site`. O botão `X` abre essa página local; nela, a seta à
  esquerda do botão de conversão leva ao `13months.net` original.
- Em 2026-08-10, o aplicativo recebeu um rodapé informativo localizado nos 12
  idiomas, inspirado na composição da página incorporada. Ele explica fontes,
  privacidade e limitações dos feriados governamentais, oferece links para os
  dados, o código público e o `13months.net`, e declara a independência do
  projeto. `lint`, `build` e a paridade das 13 chaves nos 12 catálogos passaram.
  A versão limpa foi publicada no commit `752a37d`; o GitHub Pages concluiu com
  sucesso, as caixas lunares foram medidas em 8 px com glifos de 5 px e o
  console publicado permaneceu sem erros ou avisos.
- Em 2026-08-10, o painel de Dias Especiais deixou de depender das métricas de
  fonte do navegador e passou a rolar internamente somente quando necessário.
  A contenção de roda foi estendida aos dois calendários e aos encartes das
  fases da Lua, inclusive sob zoom. `lint`, `build` e a inspeção visual de
  2026 e 2028 passaram. As correções posteriores específicas do Safari foram
  validadas no navegador real durante o acabamento visual.
- Em 2026-08-10, o fallback de idioma mudou de português do Brasil para inglês
  dos Estados Unidos no aplicativo principal, na versão pública limpa e na
  página incorporada. A escolha salva continua prioritária e os idiomas
  suportados continuam seguindo o navegador na primeira visita. As três
  compilações, o `lint` e `git diff --check` passaram antes da publicação.
- Em 2026-08-10, a seleção inicial de feriados passou a inferir o país pelas
  preferências regionais do navegador, sem permissão ou serviço externo. A
  escolha salva permanece prioritária. A linha vazia dos dias da semana em
  Dias Especiais foi reduzida para eliminar o corte final do resumo no Safari.
  A inspeção visual de 2028 mostrou `Total — 366 dias` completo. As auditorias
  de 251 opções, 206 calendários civis, regras semanais, calendário 13,
  mesclagem, emojis, traduções e apêndice oficial, além de `lint`, `build` e
  `git diff --check`, passaram nas duas cópias.
- Em 2026-08-10, a origem de uma divergência de emojis entre a execução local e
  a versão pública foi corrigida no provedor internacional: a escolha do emoji
  dependia do nome devolvido já traduzido pelo parser. A auditoria passou a
  reproduzir os 12 idiomas e confirmou 40.428 ocorrências estáveis, incluindo
  456 ocorrências de véspera de Natal com `🎄` e 468 de véspera de Ano-Novo
  com `🎆`. A correção também protege os demais conceitos semânticos.
- A cópia compilada servida pelo GitHub Pages foi regenerada depois dessa
  correção e publicada no commit `ea3f870` da versão limpa. A inspeção da
  página ao vivo em português confirmou `🎄 Noite de Natal` e
  `🎆 Véspera de Ano Novo`; não basta enviar apenas os arquivos-fonte enquanto
  o Pages continuar configurado para servir a pasta `docs`.
- O pacote incremental `SEASONS` deve ser carregado junto com o pacote do país
  nos dois encartes de feriados. Sem ele, a otimização de carregamento sob
  demanda faz equinócios e solstícios caírem no nome-fonte em inglês mesmo
  quando a interface usa outro idioma. A revisão dos quatro nomes nos 12
  idiomas também corrige manualmente o outono italiano para
  `Inizio dell'autunno`.
- Em 2026-08-14, a nova identidade da aba foi aplicada nas cópias principal e
  pública. `lint`, `build` e `git diff --check` passaram nas duas; a versão
  pública foi publicada no commit `c886577` e o GitHub Pages concluiu com
  sucesso. A página servida em `/13calendar-public/` foi inspecionada em inglês
  e português, atualizou o título sem recarregar e carregou os favicons SVG,
  PNG, ICO e Apple Touch sem registrar erros no console.
- A auditoria de dependências de 2026-08-14 atualizou somente o `nanoid`
  transitivo de 3.3.17 para 3.3.18 e eliminou todos os alertas altos. A produção
  passou em `npm audit --omit=dev` sem vulnerabilidades. Permanecem dois avisos
  baixos equivalentes do `esbuild` interno do `@quasar/app-vite`, restritos ao
  servidor de desenvolvimento no Windows e sem correção compatível publicada;
  não forçar uma versão fora da faixa exigida pelo Quasar.
- Em 2026-08-22, os menus de idioma do conversor e da página incorporada
  passaram a usar o catálogo compartilhado `shared/interfaceLanguages.ts`.
  A página incorporada recebeu o mesmo cabeçalho localizado, idioma ativo no
  topo, fechamento por `X` e contenção da rolagem, sem a seleção de feriados.
  O texto introdutório do conversor passou a descrever diretamente a conversão
  entre os dois calendários, feriados e fases da Lua nos 12 idiomas. A mudança
  entrou na principal pela PR `#10`; a cópia limpa foi publicada no commit
  `e4d1de1`, o GitHub Pages concluiu a compilação e as duas barras laterais foram
  verificadas na versão pública.
- Em 2026-08-22, foi criada a rota comunitária `#/community`, com acesso no
  fluxo das duas experiências, 12 idiomas, tema compartilhado, painel
  responsivo e Cloudflare Web Analytics. O estado vazio e um retrato preenchido
  temporário foram inspecionados em telas de 1440 px e 390 px; os dados de teste
  foram removidos. O site foi cadastrado no Web Analytics e o beacon entrou nas
  duas compilações de produção. `lint`, compilação da página Solid, compilação
  Quasar e `git diff --check` passaram. A versão limpa foi publicada nos
  commits `70a0286` e `0331cf5`; o GitHub Pages concluiu com sucesso. A rota,
  o menu reduzido, o acesso nas duas páginas e a presença dos dois beacons foram
  confirmados no endereço público.
- Em 2026-08-22, as ações das três experiências foram reunidas nas respectivas
  barras superiores. A página incorporada exibe comunidade e tema; a página dos
  calendários exibe comunidade, tema e retorno à incorporada; a comunidade
  exibe retorno aos calendários, tema e retorno à incorporada. Os antigos links
  textuais do corpo foram removidos. O botão `Hoje` deixou a barra global e
  passou a permanecer preso ao canto inferior direito do card gregoriano, sem
  alterar o alinhamento dos calendários. As três composições foram verificadas
  no navegador local, além de `lint`, compilação Solid e compilação Quasar.
- Em 2026-08-22, uma segunda revisão igualou o ícone
  comunitário nas três experiências, deu à comunidade o título próprio na barra
  e acrescentou o terceiro botão de retorno aos calendários na página
  incorporada. Os ícones de menu e retorno aos calendários da página incorporada
  agora reproduzem os ícones Material usados pelo Quasar. A comunidade recebeu
  um cadastro voluntário de nome público e perfil social, separado do conteúdo e
  do rodapé compartilhado por divisores. O botão de envio usa a mesma pílula em
  gradiente da página institucional. O frontend está preparado para
  `VITE_COMMUNITY_REGISTRATION_URL` e `VITE_TURNSTILE_SITE_KEY`.
- O backend correspondente foi preparado em
  `cloudflare/community-registration-worker`: Worker com CORS restrito,
  validação Turnstile no servidor, D1, cadastro inicialmente `pending`, consulta
  pública somente dos aprovados e rotas administrativas protegidas para aprovar
  ou rejeitar. O Worker foi implantado, o D1 foi provisionado e a migração foi
  aplicada; `GET /members` respondeu corretamente e uma tentativa sem Turnstile
  foi recusada. A chave `TURNSTILE_SECRET_KEY` e o `ADMIN_API_TOKEN` ainda devem
  entrar apenas como segredos do Worker. Essa revisão passou em `lint`,
  compilação Solid, compilação Quasar, verificação sintática do Worker e teste
  visual/local do formulário.
- A página incorporada recebeu antes da votação uma seção localizada nos 12
  idiomas sobre a objeção do Sabá. Ela corrige o contexto histórico: em 1937 a
  decisão era da Liga das Nações; a ONU só surgiu em 1945. A seção apresenta,
  sem escolher pelo visitante, duas alternativas e seus custos: manter o IFC
  intacto com uma contagem religiosa paralela ou incluir os dias especiais na
  semana civil contínua, perdendo a invariância dos dias da semana. O card de
  perguntas sobre o Sabá aponta para a nova seção, que cita fontes históricas.
- A abertura dos calendários passou a usar o mesmo globo da comunidade. Título,
  subtítulo e texto de apoio das duas aberturas usam a mesma escala tipográfica.
  A composição foi inspecionada localmente em desktop e a seção do Sabá, o
  cadastro e o rodapé também foram verificados em viewport móvel. `lint` e as
  compilações Solid e Quasar passaram.
- A barra da antiga página incorporada foi medida contra a barra Quasar: ações
  usam caixas de aproximadamente 34 px, intervalo de 8 px e desenhos de 24 px.
  A antiga variação compacta do rodapé foi posteriormente removida. Essa foi
  uma etapa intermediária; a composição atual de `AppFooter` está consolidada
  nas decisões funcionais e no registro de 27 de agosto abaixo.
- As dependências do Worker comunitário foram instaladas com Wrangler 4.125.0.
  O cache global do npm apresentou `EEXIST/EACCES`; a instalação foi concluída
  de forma não destrutiva com um cache temporário em `/tmp`, sem mudar as
  permissões do macOS. `node_modules` permanece ignorado pelo Git.
- Na página incorporada, os quatro cards informativos com destino passaram a
  apontar, respectivamente, para os Dias Especiais, o conversor, a seção sobre
  o Sabá e o bloco da Kodak. Os dois cards restantes mantêm o mesmo hover sem
  navegar. O bloco da Kodak foi ampliado com a sequência 1928–1989 e o uso por
  61 anos; todos os textos reutilizam traduções já presentes nos 12 idiomas.
  Os saltos internos foram testados com o cabeçalho fixo e chegaram aos alvos
  com 80 px de afastamento.
- A revisão completa entrou no repositório principal no commit `49f481d` e na
  versão pública limpa no commit `0a30466`. O GitHub Pages concluiu com sucesso;
  o conversor, `#/community` e `reference-site/index.html` foram abertos no
  endereço público e confirmaram os cabeçalhos, o rodapé compartilhado, o
  cadastro visual, os destinos dos cards e o conteúdo ampliado da Kodak.
- Um domínio próprio `.net` pode apontar para o GitHub Pages, mas exige registro
  pago e renovação anual; não foi encontrada opção oficial sustentável de
  segundo nível `.net` gratuito. O endereço `github.io` atual já pode ser
  indexado. Se um domínio for comprado, configurar domínio personalizado e
  HTTPS no GitHub, propriedade de domínio no Search Console, `sitemap.xml`,
  `robots.txt`, canônicos e dados estruturados `WebSite`.
- Em 2026-08-23, `ADMIN_API_TOKEN` e `TURNSTILE_SECRET_KEY` foram confirmadas
  como secrets ativas do Worker, sem leitura ou exposição dos valores. A chave
  pública do widget e o endpoint de cadastro entraram somente na compilação de
  produção. O frontend identifica a ação `community_registration` e renova o
  token de uso único depois de toda tentativa. O Worker foi endurecido para
  limitar o token a 2.048 caracteres, aplicar timeout, falhar fechado e exigir
  simultaneamente sucesso, ação correta e hostname `jean7rafael.github.io`.
  A versão `5e2d3ba2-5a04-4dbb-a03b-26f3e15d1f41` foi implantada; as duas
  secrets permaneceram vinculadas, `GET /members` respondeu e uma submissão sem
  token continuou recusada.
- O frontend protegido foi publicado na cópia limpa no commit `41650ec`; o
  GitHub Pages concluiu com sucesso. Na rota pública `#/community`, o script e o
  widget foram carregados sem erros e emitiram um token real, confirmando chave
  pública, hostname e carregamento do desafio. Os testes reais de cadastro,
  moderação, exclusão e renovação do token foram concluídos nas revisões
  posteriores registradas abaixo.
- Em 2026-08-23, a primeira tentativa real no GitHub Pages concluiu o desafio,
  mas foi recusada antes do D1. A atualização isolada do segredo pelo painel
  havia ativado uma versão que não continha `TURNSTILE_EXPECTED_ACTION` nem
  `TURNSTILE_HOSTNAMES`; o comportamento seguro do Worker recusou o token. O
  código completo foi reimplantado na versão
  `7ec5e405-7660-4d1f-8bb7-c59351496f22`, preservando as duas secrets e reunindo
  novamente D1, CORS, ação `community_registration` e hostname
  `jean7rafael.github.io`. `GET /members`, migrações e banco remoto foram
  verificados; nenhum cadastro parcial foi criado. Depois de qualquer futura
  alteração de secret pelo painel, conferir a versão ativa ou reimplantar pelo
  Wrangler para impedir uma regressão equivalente.
- Em 2026-08-23, o retrato comunitário passou a consultar a GraphQL Analytics
  API por um token de uso exclusivo `Account Analytics: Read`. O Worker reduz a
  resposta a totais agregados e preserva diariamente no D1 visitas,
  visualizações, países, páginas, origens e dispositivos, sem IP ou identidade.
  A janela recente de 89 dias é atualizada de forma idempotente e a tarefa
  agendada das `01:30 UTC` mantém o histórico depois que os dias saem da API.
  `GET /analytics/stats` já devolve dados reais e reutiliza o último retrato
  preservado se a Cloudflare estiver temporariamente indisponível.
- A página comunitária passou a consultar `GET /members` e mostra somente os
  perfis aprovados. A rota oculta `#/community-admin` permite listar pendências,
  aprovar ou recusar pedidos por meio de `ADMIN_API_TOKEN`; o valor fica somente
  na sessão da aba e sua cópia local está no arquivo ignorado
  `cloudflare/community-registration-worker/.admin-token.local`. O primeiro
  perfil autorizado (`jean7rafael`) foi aprovado e confirmado no endpoint
  público. A versão implantada do Worker é
  `7ef0d295-94a0-4205-aa27-093bc2e1d7e8`.
- A integração completa foi publicada em 2026-08-23 no commit privado
  `e987f11` e no commit público `c66b24d`. O GitHub Pages concluiu a compilação;
  a verificação em uma sessão limpa confirmou 10 visitas, 120 visualizações,
  Brasil como país alcançado, o perfil aprovado `jean7rafael`, a rota oculta de
  moderação e nenhum erro ou aviso no console. A cópia pública continua sendo
  servida pela pasta `docs` do repositório `13calendar-public`.
- A página comunitária recebeu um acesso administrativo discreto no canto do
  aviso de privacidade. O botão usa baixa opacidade, tooltip localizada
  “Acesso interno” e abre `#/community-admin`; conhecer a rota não concede
  permissão, pois todas as leituras e alterações continuam exigindo o segredo
  `ADMIN_API_TOKEN`. O segredo local permanece no arquivo ignorado
  `.admin-token.local` e pode ser rotacionado sem alterar a interface pública.
  A mudança foi publicada nos commits privado `1a6ce7e` e público `ded9b80`;
  o Pages concluiu e o link foi confirmado na versão ao vivo sem avisos no
  console.
- A rota administrativa passou a usar “Moderação da comunidade” como título da
  barra superior e a mesma gaveta enxuta da comunidade, contendo somente os 12
  idiomas. A seleção de país e o popup de feriados continuam exclusivos do
  conversor; a troca de idioma dentro da moderação não tenta abri-los. A versão
  entrou nos commits privado `1602f52` e público `11aa3b4`; o título e a
  ausência do seletor foram confirmados no Pages.
- Os avisos de novas pendências usam um bot privado do Telegram. O Worker envia
  somente uma mensagem genérica e o link da moderação; nome, perfil, país e
  telefone nunca saem do D1 por esse canal. Após o administrador enviar
  `/start` uma única vez, a própria tela de moderação encontra a conversa de
  `@jean7rafael`, armazena apenas o identificador técnico na tabela
  `community_notification_settings` e envia um teste. Cada cadastro posterior
  agenda o aviso com `context.waitUntil`; indisponibilidade do Telegram não
  desfaz nem bloqueia o cadastro. A migração `0003` foi aplicada e o Worker
  `4af4cecc-2c4c-4c05-8993-cf4af151ebd8` foi implantado. A secret
  `TELEGRAM_BOT_TOKEN` existe e foi validada como pertencente ao bot
  `@iecalendar_bot`. Em 2026-08-23, o `/start` foi localizado, a conversa
  privada foi associada no D1 e a mensagem de confirmação foi enviada. O status
  administrativo informa `configured: true` e `connected: true`; não é preciso
  repetir `/start`. O diagnóstico aceita tanto o username configurado quanto
  uma única conversa privada iniciada, contando conversas distintas em vez da
  quantidade de comandos enviados. A
  interface administrativa foi publicada no commit privado `54613fc` e no
  commit público final `3f2d3d4`; o GitHub Pages concluiu com sucesso, o novo
  módulo foi servido e `.nojekyll` e a documentação pública foram preservados.
- Em 2026-08-24, a publicação principal foi transferida para o Cloudflare Pages
  em `https://13calendar.pages.dev/`, incluindo o conversor, a comunidade e a
  página educacional adaptada em `/reference-site/`. O Worker preservou as
  quatro secrets, inclusive `TELEGRAM_BOT_TOKEN`; o identificador do chat
  conectado também permaneceu no D1. O endereço de moderação enviado pelo bot
  passou a apontar para `https://13calendar.pages.dev/#/community-admin`.
  O aviso administrativo deixou de confundir uma falha temporária ao consultar
  o status com ausência de token: `null` agora significa “não foi possível
  verificar”, enquanto `false` continua reservado para uma configuração
  realmente ausente. A correção foi compilada, passou por `npm run verify` sem
  vulnerabilidades de produção e foi publicada no deployment
  `454d46a9.13calendar.pages.dev`; o domínio canônico serviu o novo módulo
  `CommunityAdminPage-DzM95fuu.js` com o estado corrigido.
- O cadastro comunitário limpa o estado de validação do `QForm` somente depois
  de um envio concluído. Assim, os campos vazios representam um novo cadastro
  e não ficam vermelhos ao lado da mensagem verde; uma tentativa realmente
  incompleta continua exibindo as regras obrigatórias normalmente.
- Em 2026-08-24, o cadastro passou a entregar uma única vez um link privado de
  exclusão, enquanto o D1 conserva somente o resumo SHA-256 do segredo. A rota
  pública `#/community-remove`, protegida pelo Turnstile com a ação própria
  `community_deletion`, permite que cada participante apague apenas o registro
  vinculado ao seu código. Links completos e códigos isolados são aceitos e
  normalizados antes da comparação; o resumo secreto continua sendo comparado
  em tempo constante. A moderação lista pendências e perfis publicados do mais
  novo para o mais antigo; a vitrine pública preserva a ordem histórica, do
  perfil mais antigo para o mais novo. A moderação permite corrigir dados,
  excluir, gerar ou trocar o link privado e anexar/remover manualmente um
  recorte da foto pública. As imagens JPEG, PNG ou WebP de até 512 KiB ficam no
  próprio D1, são servidas somente para perfis aprovados e desaparecem junto
  com o registro. A migração `0005_registration_ownership_and_avatar.sql` foi
  aplicada, o Worker `ad707dfe-f5e6-4c4a-bd55-0012dec4c4b2` foi implantado e
  os endpoints de edição, foto, código e exclusão passaram em testes remotos.
  Os três cadastros pessoais usados nos testes foram removidos com autorização;
  a tabela pública terminou com zero registros. No painel de acessos, caminhos
  equivalentes agora são agrupados sob nomes localizados como “Página inicial”
  e “Página dos calendários”. O frontend foi publicado no deployment
  `d7fe56c3.13calendar.pages.dev` e conferido no domínio canônico. O código sem
  segredos foi sincronizado no repositório público nos commits `0b39878` e
  `73c0091`.
- Em 2026-08-25, a captura de foto deixou de depender do recorte manual como
  caminho principal. Após o Turnstile e o armazenamento do cadastro, o Worker
  tenta `og:image`; se o HTML inicial não contiver a foto, o binding `BROWSER`
  do Cloudflare Browser Run abre o perfil público, rejeita logos/ícones e
  captura somente o elemento visível mais compatível com um avatar. A imagem
  pode ser preparada enquanto o cadastro ainda está pendente, mas o endpoint
  público só a serve depois da aprovação. Uma tarefa diária repete falhas e a
  moderação mantém nova captura e upload manual como fallback. Nenhuma senha,
  cookie ou sessão social é usada. A versão do Worker
  `81648b9d-fb23-4183-970e-571c3b1caa4f` foi implantada com o binding; as fotos
  públicas corretas de `jean7rafael` e `cmyk_alt` foram copiadas para o D1 e
  conferidas visualmente. A vitrine ativa devolve esses perfis por `created_at`
  crescente, enquanto a moderação preserva os mais recentes no topo. O
  formulário de autoexclusão usa validação preguiçosa e limpa diretamente o
  campo e o formulário depois do sucesso, sem enfraquecer as regras de uma
  tentativa incompleta. O formulário de exclusão
  e o Worker continuam aceitando tanto o código isolado quanto o link completo;
  as fotos quadradas preservadas no D1 recebem uma máscara circular uniforme
  na vitrine e na moderação. Os botões discretos de acesso interno e remoção
  pública usam a mesma caixa, afastamento e hover.
- Em 2026-08-24, a grade de atividade da comunidade foi substituída em todas as
  larguras por um gráfico diário de barras com 182 dias. O histórico tem
  rolagem horizontal própria, inicia nos dias mais recentes e recalcula a
  escala vertical pelo maior valor visível, enquanto a cor continua comparando
  cada dia com o período completo. A versão móvel deixou de cortar o conteúdo,
  o cabeçalho do painel passou a se adaptar à largura disponível e os 12
  idiomas descrevem corretamente as novas barras. A inspeção responsiva foi
  feita em 390 × 844 e 1280 × 900, sem overflow horizontal da página; `lint` e
  `build` concluíram sem erros. A versão foi publicada no deployment
  `f2e29782.13calendar.pages.dev`, confirmada no domínio canônico e sincronizada
  no repositório público pelo commit `96e0fa8`.
- A operação de produção recebeu um workflow diário que confere as páginas
  públicas, os arquivos de indexação e as rotas públicas da comunidade. O
  workflow anual das fontes oficiais de feriados também passou a fazer parte
  do repositório público. A publicação automática do Cloudflare Pages valida a
  presença das duas credenciais e ignora somente o deploy quando alguma delas
  ainda não estiver configurada, sem imprimir valores sensíveis.
- O build possui um orçamento automatizado para JavaScript e CSS por meio de
  `npm run audit:bundle`. A auditoria mede o conjunto bruto e compactado e
  também o maior chunk, impedindo que o catálogo ou uma dependência volte a
  aumentar silenciosamente o carregamento.
- A apresentação em redes sociais passou a usar uma imagem Open Graph própria
  de 1200 × 630 px, comum ao conversor e à página educacional. Twitter Card,
  dimensões, textos alternativos e locale foram explicitados. O contato de
  segurança padronizado passou a ser servido em
  `/.well-known/security.txt`.
- As ações que necessariamente exigem a conta do proprietário foram isoladas
  em `docs/OWNER_ACTIONS.md`, com instruções para o token restrito do GitHub,
  solicitação do domínio EU.org e Google Search Console.
- A primeira execução manual de `Verificar produção` concluiu com sucesso em
  `jean7rafael/13calendar-public/actions/runs/32758739347`. Lint, build,
  auditorias calendáricas, orçamento do pacote, auditoria das dependências e o
  dry-run do Worker também passaram no GitHub. A imagem social, os metadados e
  o arquivo de segurança foram publicados no deployment
  `e4ce1fa3.13calendar.pages.dev`; o endereço canônico foi conferido depois da
  publicação. O código público correspondente está nos commits `47819db` e
  `e6b1732`.
- Os dois secrets da publicação automática foram concluídos em 2026-08-24. O
  workflow `Publicar no Cloudflare Pages` realizou build e deploy reais com
  sucesso na execução `32793984475`, gerando o deployment
  `f2419ee6.13calendar.pages.dev`. A partir desse ponto, cada push na `main` do
  repositório público publica o pacote completo sem intervenção manual.
- O segundo teste, disparado automaticamente pelo push `ac21219`, também
  concluiu build e publicação com sucesso na execução `32794144833`. O workflow
  passou de `cloudflare/wrangler-action@v3` para `@v4`, versão oficial que usa o
  runtime Node 24 e elimina o aviso de depreciação do Node 20.
- O workflow informa explicitamente ao Wrangler que os arquivos gerados pelo
  build tornam a árvore temporária diferente do checkout. O aviso genérico de
  chunk do Vite foi substituído pelo orçamento dedicado e mais rigoroso de
  `auditProductionBundle.mjs`. O único aviso de dependência restante vem de
  `glob@10.5.0`, transitivo do `@quasar/app-vite@2`; a auditoria encontra zero
  vulnerabilidades e sua remoção exige uma futura atualização principal do
  Quasar CLI, não uma substituição forçada da subdependência.
- O primeiro envio do pedido `13calendar.eu.org` chegou à checagem
  `Domain not found` porque os campos de nameserver estavam vazios. A sequência
  correta ficou documentada em `OWNER_ACTIONS.md`: criar primeiro a zona no
  Cloudflare, copiar os dois nameservers atribuídos, preencher `Name1` e
  `Name2` no EU.org e manter vazios os IPs. Para o Search Console, a propriedade
  provisória usa Prefixo do URL e verificação por tag HTML; o domínio próprio
  usará verificação DNS depois da aprovação.
- Todo o site e aplicativo autoral recebeu licença MIT em `LICENSE`, incluindo
  fonte, interface, conteúdo editorial e documentação. O arquivo histórico em
  `vendor/13months-site` permanece fora dessa licença e documentado em
  `THIRD_PARTY_NOTICES.md` e `vendor/13months-site/UPSTREAM.md`; ele não é
  instalado, compilado, publicado nem sincronizado ao repositório público.
  `SECURITY.md`,
  `CHANGELOG.md`, a política de privacidade e a documentação operacional foram
  adicionados. O Cloudflare Pages é o endereço canônico atual; a publicação
  automática e o redirecionamento legado do GitHub Pages estão ativos.
- Em 2026-08-25, a solicitação de `13calendar.eu.org` passou integralmente pela
  validação técnica do EU.org: os nameservers atribuídos pelo Cloudflare
  responderam corretamente a SOA e NS e o pedido foi salvo para análise humana.
  A zona permanece pendente no Cloudflare até o EU.org publicar a delegação.
  Nenhum registro DNS adicional deve ser criado antes dessa aprovação.
- Na mesma revisão de estado, a produção principal, a página educacional,
  `robots.txt`, `sitemap.xml`, `/members` e `/analytics/stats` responderam com
  HTTP 200. Os workflows públicos mais recentes de verificação, GitHub Pages e
  publicação no Cloudflare Pages terminaram com sucesso. Não houve mudança
  estrutural no aplicativo.
- Em 2026-08-25, os dados civis da `date-holidays` também foram separados por
  país. O build gera 206 pacotes civis e carrega parser e calendário somente
  quando o país é selecionado; as traduções e o catálogo editorial continuam
  incrementais. A auditoria de runtime confirmou os 206 países e a sequência
  completa de verificação concluiu com 16.890 ocorrências do calendário 13,
  orçamento de bundle aprovado e zero vulnerabilidades de produção.
- Em 2026-08-25, os padrões reincidentes da interface deixaram de depender de
  CSS e limpeza locais. `AppProfileAvatar` concentra proporção, fallback e
  máscara circular para vitrine e moderação; `useSuccessfulFormReset` concentra
  a limpeza posterior ao sucesso e os campos obrigatórios usam `lazy-rules`.
  `npm run ui:audit`, incorporado ao `verify`, bloqueia avatar paralelo,
  validação direta e campo obrigatório sem esse comportamento. O workflow
  privado `Sincronizar versão pública`, autenticado por `PUBLIC_REPO_TOKEN`,
  verifica todo o projeto e o Worker, espelha a fonte permitida e dispara os
  dois deploys públicos. A página e as verificações públicas concluíram no
  commit `f1d3d3a`; o primeiro workflow do Worker revelou que o token CI tinha
  permissão para Pages, mas não `Workers Scripts: Edit`. Em 25 de agosto, a
  permissão foi incorporada ao mesmo token e a execução pública
  `32802460935` publicou o Worker com sucesso. O deploy automático da API
  voltou a fazer parte do fluxo normal de lançamento.
- Na mesma padronização, a captura automática da foto passou a preservar
  códigos de falha do Worker até a interface. Perfil restrito, página
  inexistente, foto não identificada ou bloqueada, limite temporário do
  navegador, binding ausente, arquivo grande, credencial recusada e falha de
  rede agora recebem explicações e próximos passos próprios; somente causas
  desconhecidas usam o fallback genérico. A auditoria comunitária impede que
  essa tradução de erros seja removida. O dry-run do Worker também passou a
  usar o diretório correto no workflow unificado. A versão do Worker
  `daa33955-f65b-46ab-9103-161ed20dc3ab` foi implantada por OAuth local com o
  binding `BROWSER` e as variáveis existentes preservadas. `npm run verify` e
  o dry-run específico do Worker concluíram sem erros.
- O retorno das ações do gerenciamento de perfis fica dentro do popup que
  originou a ação. Confirmação ou erro de captura, upload, remoção de foto,
  edição e geração do link privado não podem reaparecer no fim da página
  encoberta. A auditoria comunitária verifica esse escopo antes do build.
- O pente-fino de 25 de agosto confirmou as páginas principal e educacional,
  `robots.txt`, `sitemap.xml`, `security.txt`, `/members` e
  `/analytics/stats` com HTTP 200; a rota administrativa sem credencial
  respondeu 401. `npm run verify`, o dry-run e a análise de inicialização do
  Worker passaram. Não foram encontrados segredos, artefatos de build ou
  `node_modules` rastreados. As advertências do `npm audit` completo pertencem
  somente a ferramentas de desenvolvimento; os três pacotes de produção
  permanecem com zero vulnerabilidades. O workflow do Worker ignora a fonte
  privada e publica somente no espelho público, evitando uma falsa falha por
  ausência deliberada dos secrets de produção no repositório privado.
- Em 25 de agosto de 2026, a conversão deixou de ter duas implementações
  independentes. `shared/internationalFixedCalendar.js` passou a ser a fonte
  comum do aplicativo Vue e da página educacional Solid: os 364 dias comuns
  vêm primeiro, o Dia do Ano é o ordinal 365 e, somente em ano bissexto, o Dia
  Bissexto é o ordinal 366, imediatamente depois do Dia do Ano. A antiga tabela
  fixa e a antiga inserção do Dia Bissexto entre junho e julho foram removidas.
  `npm run calendar:conversion:audit` verifica limites, Dias Especiais e ida e
  volta nos dois sentidos.
- A frase cardinal do conversor `Month {month} of 13 · Week {week} of 4`
  recebeu curadoria nos 12 idiomas. Em português ela é
  `Mês {month} de 13 · Semana {week} de 4`; nenhum idioma deve transformar a
  quantidade em ordinal como `4 da 13ª`. A causa da regressão era o componente
  ainda montar a frase em fragmentos, embora o catálogo completo já estivesse
  correto. O conversor agora chama uma única mensagem parametrizada. A
  auditoria de traduções inspeciona também o componente, e a verificação diária
  de produção lê o pacote JavaScript publicado para exigir a frase cardinal e
  rejeitar a antiga forma ordinal.
- A enquete visual da página educacional deixou de usar estado temporário ou
  serviço externo. O Worker oferece `GET/POST /feedback/votes`, identifica uma
  escolha por UUID aleatório salvo no navegador e mantém os totais agregados.
  A migração `0006_create_reference_feedback_votes.sql` guarda o voto; a
  `0007_create_reference_feedback_responses.sql` acrescenta título, relato,
  idioma, atribuição anônima ou vínculo opcional a um perfil comunitário
  aprovado. O vínculo é autorizado pelo hash do código privado existente. A
  opção escolhida e o código enviado nunca são publicados; `GET /members`
  expõe somente indicadores de participação e relato, além das respostas
  anônimas sem identidade.
- As dependências compatíveis foram atualizadas e os três pacotes de produção
  permanecem sem vulnerabilidades conhecidas. O único alerta completo restante
  é de desenvolvimento, vindo do navegador automatizado do Worker, sem versão
  compatível disponível. A verificação integral passou com Node 24, incluindo
  lint, builds, conversões, traduções, feriados, orçamento do pacote e
  auditorias de produção.
- A propriedade de Prefixo do URL `https://13calendar.pages.dev/` foi criada e
  verificada no Google Search Console pela tag HTML já publicada. O sitemap foi
  reenviado com sucesso em 31 de agosto e permanece em processamento; a página
  principal já está indexada e a página educacional consta no XML. O e-mail do
  Google confirmou que impressões começaram a ser coletadas em 28 de agosto.
- A migração D1 original dos votos foi aplicada pela sessão Cloudflare
  autenticada e o
  Worker `a33a409b-bee5-4a80-82b9-26729dddd0fa` foi publicado. Um voto real foi
  criado, lido e removido em produção, deixando novamente os quatro totais em
  zero. Na versão 2.0, o workflow do Worker passou a executar
  `npm run migrate:remote` antes do deploy; uma migração com falha interrompe a
  publicação e impede que código novo chegue antes do esquema necessário.
- O pente-fino final da tradução cardinal executou a verificação integral com
  Node 24, sem erros, e confirmou no navegador local a renderização
  `Mês 9 de 13`. O novo pacote educacional não contém `da 13ª`. As páginas e
  APIs públicas continuavam respondendo HTTP 200 antes da publicação dessa
  correção; o workflow diário passa a impedir que uma futura publicação volte
  a conter a expressão ordinal.
- Em 26 de agosto de 2026 foi aberta e publicada a branch
  `feature/vue-educational-migration` para substituir gradualmente a página
  incorporada por uma experiência Quasar/Vue nativa. A rota `/learn` concentra
  estrutura do ano 13 × 28, mês reutilizável, visão anual, história, discussão
  sobre o ciclo semanal, conversão nos dois sentidos, Lua e votação. Conversor
  e posições lunares usam os mesmos módulos compartilhados do aplicativo; a
  votação reutiliza o mesmo endpoint D1 e a mesma identidade anônima local, sem
  perder os totais existentes.
- A política de produto e a análise científica da Lua foram consolidadas em
  `docs/PRODUCT_ROADMAP_AND_LUNAR_POLICY.md`. A comunicação oficial deve separar
  o mês civil fixo de 28 dias do ciclo sinódico médio de aproximadamente
  29,5306 dias e não deve associar fases lunares a desintoxicação, hormônios,
  parasitas, tratamento ou a um ciclo menstrual universal. Tradições culturais
  só podem aparecer claramente identificadas e separadas de evidência
  científica.
- A página independente `/news`, `Notícias`, apresenta uma
  curadoria editorial com publicação original, tipo, idioma, data e resumo. A
  lista contém dez publicações e seis projetos, incluindo `13months.net`,
  `13cal.net`, `fixedcalendar.org` e Year Zero Change; presença na lista não
  representa endosso. Google e Google Notícias servem apenas à descoberta,
  nunca como a fonte citada. Peças satíricas, discussões comunitárias e
  documentos enviados por usuários recebem tipo e aviso editorial próprios.
- O menu superior agora leva sempre, nesta ordem, a Aprenda, Ferramentas,
  Calendários, Lua, Notícias e Comunidade com componentes nativos. A
  rota ativa mantém o realce; os textos somem quando necessário e, na menor
  largura, os destinos passam para uma gaveta à direita. O tema permanece como
  a última ação. A rota educativa e as páginas institucionais usam menu lateral
  somente de idioma, sem abrir a escolha de país dos feriados. O
  roteamento passou para URLs reais em modo history; favoritos antigos em
  `/#/rota` são migrados no navegador. `/reference-site/*` redireciona para
  `/learn`, a página incorporada saiu do prebuild e do sitemap, mas seus
  arquivos permanecem temporariamente no diretório público como contingência.
- `npm run education:audit`, incorporado a `npm run verify`, impede que uma
  futura mudança remova a rota, duplique os motores de cálculo, perca votação,
  idiomas, fontes, sitemap ou redirecionamento, ou volte a construir a página
  incorporada. A nova experiência foi conferida em 1440, 390 e 320 px sem
  rolagem horizontal; os dois Dias Especiais de 2028, a lista lunar ao vivo, a
  curadoria e a migração dos links antigos passaram. A troca de idioma em
  `/learn` também foi testada sem seletor nem popup do país dos feriados. A
  verificação integral com Node 24 concluiu sem erros, incluindo lint, build,
  orçamento do pacote, calendários, feriados e zero vulnerabilidades nos três
  pacotes de produção.
- A branch remota existe no GitHub ainda no commit-base. As alterações desta
  migração permanecem deliberadamente sem commit até autorização explícita do
  mantenedor, conforme `AGENTS.md`; portanto, a revisão no GitHub só ficará
  disponível depois dessa autorização e do push dos novos commits.
- Em 27 de agosto de 2026, a continuidade das frentes longas deixou de depender
  da memória da conversa. `AGENTS.md` passou a exigir a leitura e atualização
  de um checkpoint vivo depois de cada marco material e antes de operações
  demoradas. O programa `scripts/manageWorkCheckpoint.mjs` preserva campos não
  informados, atualiza automaticamente branch, último commit, arquivos e
  estatísticas das diferenças, e oferece leitura, auditoria e encerramento
  explícitos. O checkpoint atual registra toda a migração educativa ainda em
  andamento, a proibição de mesclar ou publicar e a próxima ação concreta nos
  idiomas. `npm run continuity:audit` e `npm run lint` passaram após a criação.
- Ainda em 27 de agosto, a frente nativa ganhou `/tools` e `/widget`. As
  ferramentas cobrem cartão de data, aniversário, PNG, links reproduzíveis,
  compartilhamento social, planejador anual, ICS, impressão/PDF, equinócios,
  solstícios, periélio, afélio, nascer/pôr do Sol opcional, favoritos locais,
  cartões editoriais, instalação offline e widget sem beacon próprio. Todas as
  conversões passam por `src/utils/calendarTools.js` e pelo motor compartilhado
  em `shared/internationalFixedCalendar.js`.
- A página de ferramentas possui catálogo próprio nos 12 idiomas. A auditoria
  lê os catálogos brutos adicionais para impedir que chaves ausentes sejam
  ocultadas por fallback. `/learn` e `/tools` têm canonical, Open Graph,
  Twitter e dados estruturados; `/tools` entrou no sitemap e `/widget` ficou
  com `noindex` e permissão de incorporação isolada em `public/_headers`.
- O pacote público antigo `public/reference-site` foi retirado. O
  redirecionamento `/reference-site/* -> /learn` continua, e a fonte em
  `vendor/13months-site` permanece somente como arquivo privado de proveniência:
  não é instalada, compilada, auditada, publicada nem sincronizada à fonte
  pública. Não existe dependência externa de autorização ou colaboração.
- O modo offline é registrado somente em produção, não é ativado dentro do
  widget e guarda a interface e páginas abertas no dispositivo. Notícias e
  totais comunitários continuam dependentes de rede. A localização astronômica
  só é solicitada após ação explícita e as coordenadas não são enviadas ao
  Worker. O Homebrew Node 26.7.0 é o padrão dos novos terminais do Mac; a
  instalação 22.23.2 permanece instalada e desvinculada apenas como fallback.
  A precedência do Homebrew está registrada em `~/.zprofile`, evitando que o
  antigo Node 22.14.0 de `/usr/local` seja selecionado. As três opções antigas
  exclusivas do pnpm foram removidas de `.npmrc`; o projeto usa npm e
  `package-lock.json`, e os comandos do npm 11 não emitem mais esses avisos.
- Em 27 de agosto, os dias destacados das comparações foram centralizados:
  português exibe `Segunda`, `Terça`, `Quarta`, `Quinta`, `Sexta`, `Sábado` e
  `Domingo`, sem abreviação nem `-feira`. O cartão `Hoje em dois calendários`
  reserva as mesmas linhas para rótulo, data e ano, preservando o alinhamento
  quando o título do Calendário Fixo Internacional quebra.
- A mesma apresentação central passou a atender o widget, o conversor, os
  cartões compartilháveis e de aniversário, favoritos, Lua, astronomia e
  demais comparações. Ambos os lados mostram o mesmo ano e as três superfícies
  que geram imagens foram auditadas; cartões editoriais sem comparação de
  datas não recebem informação artificial.
- Em 27 de agosto, o formatador central passou a consultar a ordem mês/dia de
  cada uma das 12 localidades. Gregoriano e IFC usam o mesmo ponto intermediário
  e preservam mês e número como bloco; a auditoria de conversões executa um caso
  comparativo em todos os idiomas. O widget centraliza rótulos, datas, anos e
  crédito nas duas colunas. O formulário de Favoritos também removeu o espaço
  inferior invisível e igualou a altura de campos e ação.
- As três famílias de botões foram incorporadas ao CSS compartilhado e aos
  componentes existentes. `npm run ui:audit` rejeita novos botões textuais sem
  família, o nome legado do botão ou mais de uma variante simultânea.
- Todas as páginas públicas usam o mesmo `AppFooter`, com exatamente quatro
  links institucionais acompanhados por ícones. `CalendarContextSection` mantém
  `Datas merecem contexto` em `/` e fornece a mesma composição inferior à
  Metodologia de `/moon`. A revisão mediu 106 px de altura do
  rodapé em todas as rotas desktop e 222 px em todas as rotas móveis, sem
  rolagem horizontal.
- A paleta oficial roxa, verde e âmbar foi transformada em tokens para claro e
  escuro. `AppNoticePanel` unificou os avisos da comunidade e o aviso editorial
  âmbar de Notícias; `AppPageHero` unificou Calendários, Lua, Notícias e
  Comunidade, reservando o globo à Comunidade e o crescente à Lua. A navegação
  foi conferida na barra e na gaveta móvel na
  ordem Aprenda, Ferramentas, Calendários, Lua, Notícias e Comunidade.
- A sequência integral `npm run verify` passou com o Node 26.7.0 após essa
  padronização. Ela incluiu continuidade, lint, interface, educação,
  comunidade, conversões, compilação, pacote, feriados e duas auditorias de
  produção, ambas sem vulnerabilidades. `git diff --check` também passou.
- O Google Search Console permanece somente em observação: a propriedade está
  verificada, o sitemap público responde com XML válido e o processamento e a
  indexação seguem o prazo do Google. Não há correção técnica identificada nem
  ação imediata que deva constar como pendência do projeto.
- A frente 2.0 incorporou equivalência bidirecional nos quatro cards de
  feriados/Lua, botão Hoje nos dois calendários e alternância móvel por coluna.
  `CalendarEquivalentDateTooltip` centraliza o texto e usa `IFC` no sentido
  gregoriano → fixo; ocorrências adaptadas preservam sua `gregorianDate` real.
- Os cinco seletores nativos de data de Conversor, Compartilhamento,
  Aniversário, Astronomia e Favoritos foram substituídos por `AppDateInput`.
  `AppYearInput` uniformiza os anos do conversor IFC, aniversário, planejador,
  astronomia e conteúdo lunar. Os popups têm uma única borda curva e aceitam
  teclado; no aniversário, o ano é escolhido primeiro e passa a ser a referência
  do calendário de dia/mês. Os resultados gregoriano/IFC são alinhados pelo
  rótulo, título e ano, deixando a posição IFC como linha extra.
- A apresentação antiga foi preservada em
  `docs/releases/README_1.0.md`; `README.md`, `PUBLIC_README.md`,
  `docs/releases/README_2.0.md` e `CHANGELOG.md` descrevem a nova identidade
  independente. A versão passou a `2.0.0`, foi integrada à `main` e entrou no
  fluxo público verificado de release em 28 de agosto.
- Após esses refinamentos, `npm run verify` passou integralmente, incluindo
  lint, build, auditorias de interface, educação, conversões, bundle, feriados e
  dependências de produção. A prévia local confirmou as comparações nos 12
  idiomas, a ordem mês/dia compartilhada e o widget russo centralizado. A
  apresentação deixou de depender de quebras ocasionais: `AppComparisonDateTitle`
  passou a fixar dia da semana e ponto acima de dia/mês em Aprenda, Conversor, Aniversário,
  Compartilhamento, widget, prévias e imagens geradas. O formulário de Favoritos
  ficou alinhado. Em português e inglês também confirmou
  campos alinhados, seletor exclusivo de dia/mês no aniversário referenciado
  pelo ano da comemoração, limites em janeiro/dezembro, recomposição dos dias da
  semana entre 2026 e 2027, formatos `DD/MM` e `MM/DD`, grade de 21 anos, borda
  única e alinhamento das duas datas pelo topo dos títulos. A inspeção final
  confirmou ainda: widget russo e prévia incorporada com as duas quebras
  simétricas, Aprenda usando a mesma regra, aviso móvel visível a 390 px e
  oculto a 1260 px com as duas colunas restauradas. O `npm run verify` integral
  permaneceu aprovado depois dessas mudanças.
- Ainda em 27 de agosto, o conversor educativo IFC → Gregoriano substituiu os
  campos independentes de mês e dia por `AppInternationalFixedDateInput`. A
  inspeção local confirmou a grade 13 × 28, a altura estável entre Dia regular
  e Dia do Ano, o Dia Bissexto desativado em 2026 e a interface editorial árabe
  sem fallback em inglês. Os catálogos editoriais de Aprenda e Notícias foram
  completados nos dez idiomas adicionais; Ferramentas já possuía o mesmo nível
  de cobertura e seus dados estruturados passaram a reutilizar os títulos
  traduzidos. O rodapé agora separa Fontes de dados de Código-fonte e a seção da
  versão 2.0 reúne as fontes civis, governamentais, lunares e solares.
  Uma segunda inspeção em árabe encontrou os resumos fixos em inglês nos cards
  de Notícias; eles e os rótulos de idioma foram então localizados nos 12
  idiomas. Os títulos das publicações continuam no original por atribuição. A
  sequência final `npm run verify` e `git diff --check` passou depois dessa
  correção, incluindo build, todas as auditorias e zero vulnerabilidades de
  produção.
- A revisão visual final de Aprenda recuperou em Vue/Quasar a composição
  preferida da antiga página incorporada sem restaurar dependência em runtime.
  O topo passou a comparar os calendários com gradientes, `vs.`, relógio externo
  e contagens de dias; os botões mantêm a seta ao lado do texto e passam para
  linhas separadas quando a coluna não comporta os dois sem colisão. A seção
  estrutural passou a ter cinco cards e um mês modelo com domingos rosados. A
  grade anual única reúne 13 meses e o resumo dos Dias especiais em duas
  fileiras de sete no desktop; no celular, o resumo fica ao lado de dezembro.
  Números perderam as caixas de cor, o ano comum omite a parcela zero da soma,
  as alturas foram igualadas pelo maior card e o seletor reserva Hoje sem
  deslocar o ano. A linha do tempo, as seis
  perguntas, a Kodak e a seção completa do Sabá foram incorporadas nativamente
  com catálogos completos nos 12 idiomas. O título histórico usa o mesmo peso
  forte dos demais e a seção lunar inteira foi posicionada depois do Sabá. A
  inspeção local cobriu 1280, 390 e
  320 px, anos comum e bissexto; lint e as auditorias de interface e educação
  passaram. A sequência integral `npm run verify` também passou: continuidade,
  lint, interface, educação, comunidade, conversões, build, limite do pacote,
  feriados e dependências de produção sem vulnerabilidades.
- A revisão seguinte ampliou a grade anual até 1700 px e antecipou suas quebras
  para 1579 e 860 px, com cabeçalhos de 8 px e sem colisão em 1900, 1580, 1579,
  1000, 861, 860, 699 e 390 px. O destaque do dia atual passou a usar roxo
  escuro translúcido ou rosa escuro translúcido aos domingos; Solaris preserva
  a cor normal dos dias úteis. A resolução de implantação virou uma seção
  própria logo depois do Sabá, com quatro obstáculos coloridos cuja altura
  combinada iguala o formulário em tela larga. A votação permaneceu separada,
  ganhou símbolos da paleta e a assinatura `13 ● MONTHS ● CALENDAR`. Voto e
  relato possuem decisões independentes de anonimato ou vínculo ao card
  comunitário. Na Comunidade, `Faça parte` aparece logo após o aviso verde;
  perfis vinculados mostram somente os ícones de voto e relato, e respostas
  anônimas ficam numa lista posterior com leitura em diálogo. Os novos textos e
  o aviso de privacidade permanecem localizados nos 12 idiomas. Nenhuma migração
  remota nem publicação foi executada nesta revisão.
- A página Lua passou a usar o cabeçalho compartilhado com crescente roxo e a
  mesma composição inferior de contexto da página dos calendários, preenchida
  com os três tópicos de Metodologia. O topo comparativo de Aprenda ganhou
  contenção simétrica: o maior texto define a escala das duas colunas. A
  inspeção em 1440 px confirmou zero transbordamento e tamanhos idênticos nos
  12 idiomas; o russo usa 32 px nos dois dias da semana e também passou nos
  limites de 901, 900, 699 e 390 px. Em Ferramentas, os cards do ano solar e de
  nascer/pôr do Sol agora têm a mesma altura lado a lado; o primeiro divide-a
  em sete faixas iguais (cabeçalho e seis eventos) e volta à altura natural
  abaixo de 860 px. `npm run verify`, o dry-run do Worker e `git diff --check`
  passaram; nenhuma publicação ou migração remota foi executada.
- Em 28 de agosto, `AppComparisonDateTitle` deixou de admitir quebra no meio de
  palavras. Aprenda passa o herói inteiro para uma coluna até 1239 px e preserva
  escala idêntica dos dois calendários. A inspeção do limiar de 1240 px e da
  tela mínima de 320 px passou nos 12 idiomas sem transbordamento de título,
  rótulo ou página; o russo também permaneceu inteiro. Os três cards de
  Metodologia receberam textos inéditos e localizados sobre o papel da NASA,
  da convenção civil e do roteiro editorial, igualmente conferidos nos 12
  idiomas.
- A versão 2.0 retirou os comandos, etapas de CI, publicação e monitoramento da
  página adaptada. A sincronização pública exclui `vendor/`, e o health check
  verifica `/learn`. A licença MIT declara todo o site autoral. A issue externa
  foi convertida em aviso de independência e encerrada; 13months.net permanece
  apenas como referência citada.
- Em 28 de agosto, a zona principal `eu.org` apresentou serial SOA do próprio
  dia, enquanto `13calendar.eu.org` ainda não tinha delegação. Isso confirma a
  operação técnica do serviço, não a frequência da moderação. Como o pedido tem
  três dias e a orientação oficial menciona alguns dias de intervenção humana,
  a espera ainda está dentro do prazo declarado. Cloudflare Pages continua
  canônico; após 30 dias sem resposta, deve-se reavaliar a alternativa de
  domínio. O Google Search Console permanece apenas em observação.
- A verificação final de 28 de agosto passou integralmente: protocolo de
  continuidade, lint, interface, educação, comunidade, conversões, build,
  orçamento do pacote (690,0 KiB gzip), feriados e as duas auditorias de
  produção sem vulnerabilidades. O dry-run do Worker 4.125.0 gerou 148,72 KiB
  gzip sem publicar, e `git diff --check` não encontrou erros.
- A raiz `/` permanece ligada à página Calendários, a primeira desenvolvida no
  projeto; Aprenda continua sendo o primeiro destino da barra, em `/learn`, sem
  mudar a ordem de navegação. A auditoria educacional passou a impedir que uma
  futura mudança troque silenciosamente essa entrada.
- A identidade de busca da página inicial agora declara `13 Calendar` como
  `WebSite`, com `13Calendar` e `13calendar.pages.dev` como alternativas, além
  do `og:site_name` já existente. O resultado com o operador
  `site:13calendar.pages.dev` confirma que a raiz está indexada, mas a consulta
  genérica ainda tem visibilidade muito baixa e o Google ainda exibe
  `Cloudflare` como nome do site até reprocessar os novos sinais. Indexação não
  equivale a boa posição na busca.
- A publicação completa da versão 2.0 foi autorizada para partir da `main` pelo
  workflow `Sincronizar versão pública`, que repete as verificações, espelha a
  fonte permitida e aciona Cloudflare Pages e o Worker. As migrações D1 são
  aplicadas antes do código do Worker. O mantenedor fará depois os testes
  manuais de voto, relato e vínculo com o perfil comunitário.
- O primeiro release público 2.0 sincronizou a revisão privada `1aa4bab` no
  commit público `0d8bc31`. Cloudflare Pages concluiu, mas o token do GitHub
  recusou a migração D1 com o código 7403 porque ainda não possui `D1 Edit`.
  A sessão OAuth local, que tem essa permissão, aplicou com sucesso a migração
  `0007` e publicou o Worker `6ec7e22c-0e28-46b8-9b3e-b5865a64dde8`. O banco
  foi atualizado antes do código, preservando a ordem segura do lançamento.
- O CI do espelho público também revelou que `AGENTS.md` é deliberadamente
  privado, mas as auditorias de continuidade e interface tentavam lê-lo
  novamente. Ambas agora reconhecem apenas o repositório público conhecido e
  registram que as regras já passaram na fonte privada antes do espelhamento;
  qualquer outra ausência de `AGENTS.md` continua sendo erro.
- A verificação manual pós-release confirmou HTTP 200 em `/`, `/learn`,
  `/tools`, `/moon`, `/news`, `/community`, `/privacy`, `/widget`, `robots.txt`
  e `sitemap.xml`; `/reference-site/` respondeu 302 para `/learn`. O HTML
  publicado contém `WebSite`, `alternateName` e `og:site_name`; o sitemap lista
  as novas rotas com data de 28 de agosto. `/members`, `/analytics/stats` e
  `/feedback/votes` responderam 200, e o D1 não tem migrações pendentes.
- O health check antigo exigia literalmente `<div id="q-app"></div>`, mas o
  Quasar 2.0 minimiza o shell como `<div id=q-app>`. A verificação passou a
  aceitar as duas formas, conferir todas as rotas públicas, exigir o marcador
  `WebSite` e validar as seis rotas indexáveis no sitemap.
- O card de acesso offline em Ferramentas nunca mais bloqueia a ação quando o
  navegador não oferece o prompt automático. Nessa situação, abre um diálogo
  opaco e responsivo com instruções próprias para Safari no iOS/iPadOS, outros
  navegadores Apple, Firefox/Chromium no Android e desktop; o compartilhamento
  nativo aparece somente quando existe e é tratado como apoio, não como garantia
  de instalação. O modo instalado também reconhece `navigator.standalone`.
  Os novos textos existem nos 12 idiomas. Na grade anual de Aprenda, cada mês
  distribui as quatro semanas por toda a altura comum dos 14 cards. A inspeção
  local confirmou botão habilitado, diálogo móvel a 390 px, ausência de erros,
  alturas idênticas de 242 px em tela larga e 198 px no celular, sem overflow.
- A primeira tentativa de sincronizar esse refinamento revelou diferença de
  compactação entre o Mac e o runner do GitHub e ultrapassou o orçamento por
  1,9 KiB antes do espelhamento. As instruções foram condensadas sem retirar
  plataformas; o build público passou com 697,6 KiB gzip dentro do limite.
  A revisão privada `ca44aa4` chegou ao espelho público como `34bcc8f`.
  Verificação pública, Cloudflare Pages e GitHub Pages concluíram; o health
  check manual `33183322321` aprovou páginas, indexação e API. A inspeção em
  `https://13calendar.pages.dev/tools` confirmou o botão habilitado, o diálogo
  publicado e nenhum erro de console.
- Os testes manuais em produção de votação, relato, anonimato, identificação e
  vínculo ao perfil comunitário foram concluídos pelo mantenedor com sucesso.
  As rotas `/members`, `/analytics/stats` e `/feedback/votes` continuaram
  respondendo HTTP 200 na conferência posterior.
- O código privado longo do perfil permanece como credencial de recuperação e
  uso em outro dispositivo, mas não precisa mais ser colado a cada voto ou
  relato. Depois do cadastro ou do primeiro vínculo manual bem-sucedido, ele é
  lembrado somente naquele navegador e preenche o campo protegido; a remoção do
  perfil também apaga a cópia local correspondente. Se não houver perfil
  vinculado nem código lembrado, o diálogo explica que o cadastro comunitário é
  voluntário e oferece um link para `/community#community-registration`. A
  seção de cadastro recebeu essa âncora e o roteador a posiciona 74 px abaixo
  da barra superior.
- As notificações de falha vistas no GitHub em 28 de agosto pertencem às
  primeiras tentativas da publicação 2.0: o token sem `D1 Edit`, as auditorias
  que ainda esperavam o `AGENTS.md` privado no espelho público e o health check
  que esperava a marcação HTML não minimizada. Essas três causas foram
  recuperadas ou corrigidas. No estado mais recente, sincronização privada,
  verificação pública, Cloudflare Pages, GitHub Pages e health check terminaram
  com sucesso; notificações antigas permanecem no histórico e não indicam uma
  falha atual da produção.
- O mesmo token guardado no GitHub recebeu `Account` → `D1` → `Edit`, sem troca
  do segredo. A execução pública `33212407098` confirmou a correção: validação
  do pacote, migrações remotas do D1 e publicação do Worker terminaram com
  sucesso. A automação das próximas migrações está restaurada.
- O Search Console confirmou por e-mail que começou a coletar impressões em 28
  de agosto de 2026 e que páginas do site já aparecem em resultados associados
  a algumas consultas. Isso comprova indexação e descoberta, mas não posição
  alta em buscas genéricas. O painel EU.org continua sem listar o pedido e a
  consulta DNS confirma que `13calendar.eu.org` ainda não foi delegado.
- A verificação integral posterior ao refinamento do vínculo passou em 28 de
  agosto: continuidade, lint, interface, educação, comunidade, conversões,
  build, pacote de 693,7 KiB gzip, feriados e auditorias de produção sem
  vulnerabilidades. A inspeção local confirmou o aviso voluntário e o salto
  exato para a âncora do cadastro, sem enviar votos ou relatos de teste.
- A publicação do vínculo simplificado saiu da `main` nas revisões privadas
  `8ca0f80` e `e22b54b` e chegou ao espelho público como `ac52c97`. A primeira
  tentativa revelou novamente a diferença de compactação entre macOS e Linux:
  o runner ficou somente 0,1 KiB acima do orçamento. O texto auxiliar dos 12
  idiomas foi condensado sem perder a informação de armazenamento local, e o
  runner passou com 698,1 KiB gzip dentro do limite de 698,2 KiB. Verificação,
  sincronização pública, Cloudflare Pages, GitHub Pages e o health check
  `33213513086` concluíram com sucesso. A produção respondeu 200 em `/`,
  `/learn`, `/community`, nos novos pacotes e nos endpoints
  `/feedback/votes`, `/members` e `/analytics/stats`; os pacotes publicados
  contêm a âncora `#community-registration` e a mensagem da credencial lembrada.
- Em 29 de agosto, o aviso de cadastro do diálogo de voto/relato virou o próprio
  link para a âncora comunitária e o apontamento textual redundante foi
  removido. As comparações passaram a preservar cedilhas, acentos e hastes
  inferiores na própria caixa tipográfica, sem usar distância excessiva como
  correção: o espaço entre as duas linhas é de 4 px no desktop e no widget e de
  3 px no celular. A medição de Aprenda e do widget nos 12 idiomas não encontrou
  recorte, transbordamento ou diferença entre os lados. As abreviações dos mini
  calendários passaram de 6 para 8 px. Ferramentas oferece os 12 conteúdos
  distintos na ordem editorial definida pelo mantenedor, divididos em quatro
  coloridos, quatro claros e quatro escuros, com as quatro cores do tema. O
  carrossel mantém três visíveis no desktop, altura fixa de 390 px, setas
  circulares, fila para cliques rápidos e loop infinito contínuo nos dois
  sentidos; rajadas de 25 cliques foram testadas sem travamento. Títulos e corpos
  reservam linhas completas iguais, inclusive o título de três linhas da Kodak,
  e os botões seguem respectivamente os padrões primário, terciário e secundário.
  Os arquivos continuam em 1080 × 1080 e todos os cards exibem ícone no topo,
  também reproduzido no PNG. Lua alterna as quatro fases por filtros entre título
  e ano; abaixo de 900 px o texto recolhe, permanecendo emoji com tooltip
  traduzida. Notícias exibe a marca de cada fonte numa caixa superior padronizada
  e todos os títulos reservam a mesma faixa horizontal para não colidir com ela.
  A inspeção local confirmou fases, loop, alturas, botões, 11 marcas e tipografia.
  `npm run verify` passou integralmente, com 698,0 KiB gzip local e zero
  vulnerabilidades; `git diff --check` também passou. O runner Linux produz até
  702,7 KiB com o mesmo conteúdo por diferença de versão do zlib. Por isso o
  orçamento compactado passou de 698,2 para 708,0 KiB, ainda abaixo do teto bruto
  de 3 MB e com margem explícita para evitar falsos negativos entre plataformas.
  A primeira sincronização pública desta revisão parou antes de copiar arquivos:
  o pacote idêntico mediu 702,7 KiB no zlib do Linux, acima do teto anterior de
  698,2 KiB, embora medisse 698,0 KiB localmente. Não houve falha funcional nem
  de credencial. O commit privado `91564c8` fixou a margem multiplataforma e a
  sincronização `33271782849` publicou o commit público `91890b7`. Verificação
  privada e pública, GitHub Pages (`33271821430`), Cloudflare Pages
  (`33271821995`) e o health check `33271878873` terminaram com sucesso. A
  implantação Cloudflare é `3973ac5c.13calendar.pages.dev`; o alias principal
  respondeu 200 em `/learn` e `/tools`, o GitHub Pages respondeu 200 e a inspeção
  visual da produção não encontrou avisos ou erros no console.
- Ainda em 29 de agosto, o carrossel editorial de Ferramentas ganhou navegação
  direta por arraste horizontal com Pointer Events. O limiar diferencia o gesto
  horizontal da rolagem vertical, acompanha o dedo sem transição e avança ou
  recua uma posição ao soltar; as setas e o teclado permanecem disponíveis.
  Três, dois ou um card continuam inteiramente visíveis conforme a largura,
  enquanto pequenos trechos dos vizinhos aparecem em cada lado sob o fade. As
  setas agora ocupam faixas próprias, com 14 px de separação física do viewport,
  e não se sobrepõem mais a esses trechos. As descrições deixaram de usar corte
  por quantidade de linhas: o maior conteúdo do idioma define a altura e todos
  os cards do carrossel são esticados para esse mesmo valor, preservando os
  botões na base sem reticências. A medição nos 12 idiomas confirmou títulos e
  descrições integrais, altura única por idioma — 419 px em português e até
  439 px em alemão no desktop — e nenhum erro no console. Uma volta completa de
  12 gestos passou nos dois sentidos sem salto nem travamento; `lint`, `build`
  e `git diff --check` também passaram. A revisão foi incorporada à publicação
  integral de 31 de agosto, depois das alterações complementares do mantenedor.
- Em 30 de agosto, o planejador anual passou a produzir um caderno A4 de
  exatamente 40 páginas. As páginas 4–29 formam 13 pares fixos: calendário do
  mês na página par e 28 espaços numerados de anotações na página seguinte, de
  modo que permaneçam lado a lado na impressão frente e verso. A sequência de
  destaque é roxo, verde, âmbar e rosa; o Dia do Ano é verde. O Dia Bissexto
  ocupa sempre a página 31: aparece âmbar quando existe e âmbar pálido, com
  aviso explícito, em ano comum. As sete páginas finais de anotações são
  divididas em duas áreas iguais: treze áreas identificam os meses e a décima
  quarta identifica os Dias Especiais.
- O botão usa o rótulo curto “Imprimir PDF”, localizado de forma equivalente
  nos 12 idiomas, mas não chama mais a
  impressão do navegador. Ele abre um diálogo próprio com seletor de ano e
  identifica automaticamente um dos dois modelos estruturais, ano comum ou
  bissexto. Cada folha visual de 210 × 297 mm é capturada separadamente e um
  gravador PDF mínimo insere exatamente uma imagem JPEG por página; assim a
  paginação não varia entre Safari, iPhone, iPad, Android e desktop. O capturador
  entra em chunk assíncrono somente após o clique e o gravador específico evita
  o peso de uma biblioteca genérica. Os modelos de 2026 e 2028 foram baixados,
  renderizados e inspecionados: ambos têm 40 páginas A4, cerca de 3,7 MB, sem
  página vazia, corte, duplicação ou perda dos pares mês/anotações. A página 31
  de 2028 mostra o Dia Bissexto ativo; em 2026, conserva o modelo pálido e o
  aviso de indisponibilidade.
- O ICS do planejador passou a oferecer três usos separados: marcos do ano,
  favoritos locais e sobreposição diária completa. As linhas seguem o limite
  de 75 bytes do formato, e as auditorias confirmam 14 eventos nos marcos de
  2026, 365/366 no modo diário e preservação das equivalências IFC. Os textos
  novos permanecem completos nos 12 idiomas, reaproveitando o catálogo comum
  para não duplicar conteúdo no carregamento.
- A autoexclusão comunitária passou a reservar a área do Turnstile antes do
  carregamento. A verificação ocupa uma faixa própria, independente do grupo
  de botões; os dois botões dividem largura e altura na mesma linha ou mudam
  juntos para a pilha móvel. Assim, a chegada assíncrona do widget não empurra
  nem comprime nenhuma ação. O Turnstile usa o tamanho `flexible` também no
  cadastro comunitário.
- O pente-fino de 30 de agosto criou `app-action-group`: ações textuais vizinhas
  dividem largura e altura, e uma tradução com duas linhas aumenta toda a linha
  do grupo. Aprenda centraliza as duas ações abaixo do título; Ferramentas usa
  dois botões compactos lado a lado; buscas, CTAs, compartilhamento, planner,
  votação e diálogos seguem a mesma regra. O diálogo ICS substituiu o glifo
  incompatível por `event_available` e, quando não há favoritos, centraliza as
  três ações com o mesmo tamanho. A proteção `app-no-double-tap` usa
  `touch-action: manipulation` somente nos carrosséis, resumos anuais,
  calendários e seletores laterais: evita zoom por dois toques no iPhone/iPad,
  sem desabilitar o zoom por pinça no restante do site.
- A revisão seguinte removeu uma regra ampla da página Ferramentas que forçava
  seus botões internos a 40 px e também eliminou `height: 100%` dos itens de uma
  linha automática, combinação que criava uma dependência circular de tamanho
  e só se corrigia depois de uma repintura ou hover. O contrato definitivo usa
  altura intrínseca e coloca a ausência de quebra como primeira prioridade.
  `src/boot/buttonLayout.js` mede, antes da pintura, a maior tradução de cada
  grupo e atribui a mesma largura a todos os irmãos. O flex reorganiza botões
  inteiros antes de reduzir o rótulo; somente abaixo de 430 px a quebra é
  liberada, e então a maior altura volta a ser compartilhada pela linha. A
  medição se repete após fontes, troca de idioma e inserção de diálogos, nunca
  por hover. Português e japonês foram conferidos no estado inicial com uma
  linha por ação, alturas de 44 px e zero transbordamento.
- Em 31 de agosto, a separação entre texto e ícone também entrou no contrato:
  são sempre 12 px, sem depender das margens internas do Quasar, e a medição
  reserva 8 px contra arredondamento, zoom e variação de fonte. O cálculo usa
  somente as larguras intrínsecas dos filhos; medir o contêiner já ampliado
  criaria uma realimentação crescente. O observador agora reage apenas a
  mudanças dentro de grupos de ações ou à inserção de um grupo novo, evitando
  recalcular por causa do relógio da página. No hero de Aprenda, os dois botões
  ficaram com 263 px por 44 px, 12 px livres entre rótulo e ícone e nenhum
  transbordamento na largura inspecionada.
- O contrato está documentado em `docs/UI_BUTTON_SYSTEM.md`. A auditoria de UI
  exige as três famílias, grupos compartilhados, a medição única e a exclusão
  explícita de `.app-action` em qualquer geometria de controle funcional. Os
  trechos estruturais e suas exceções continuam comentados em português; linhas
  triviais não recebem comentários redundantes.
- O carrossel editorial deixou a fila de passos unitários. Gestos podem avançar
  vários cards conforme distância e velocidade, enquanto cliques rápidos
  redirecionam a transição em curso. Sete cópias internas do conjunto e a
  recentralização invisível preservam o loop contínuo nos dois sentidos, sem
  salto visual. O calendário e seus cálculos não foram alterados. Esta revisão
  foi incorporada à publicação integral de 31 de agosto.
- O compartilhamento de data usa quatro redes com suas marcas oficiais:
  WhatsApp, Facebook, X/Twitter e Telegram. O card de controles tem largura
  máxima de 400 px e encolhe com a tela; o seletor e as três ações principais
  ocupam toda a largura interna. As redes permanecem numa grade compacta 2 × 2
  explícita por padrão, independente da largura automática calculada para os
  rótulos. Somente até 340 px ela passa para uma coluna compacta. Quando
  controles e imagem ficam lado a lado, a grade iguala suas alturas, reserva o
  espaço livre no centro e ancora as redes na base; abaixo de 820 px eles voltam
  a ter alturas independentes em duas linhas. No empilhamento sem espaço livre,
  a separação mínima entre o link e as redes é de 32 px. Esta frente foi
  incorporada à publicação integral de 31 de agosto.
- O capturador assíncrono do PDF acrescenta cerca de 157,5 KiB brutos e 40,4
  KiB em gzip ao pacote total, mas não ao carregamento inicial de quem não abre
  o gerador. Depois das explicações fiscal, escolar e de feriados nos 12 idiomas,
  o orçamento passou para 3,35 MB brutos e 840 kB compactados. A margem reconhece
  recursos carregados somente em suas rotas e a variação entre o zlib local e o
  do runner Linux; os tetos por arquivo permanecem inalterados.
- A verificação integral desta revisão passou: lint, build, auditorias de UI,
  educação, calendário, feriados, pacote de produção e segurança. O pacote
  final mediu 3.087,2 KiB brutos e 758,2 KiB gzip, abaixo dos novos limites, e
  as duas árvores de dependências de produção permaneceram sem vulnerabilidades
  conhecidas. `git diff --check` também passou sem erro.
- Após o refinamento do compartilhamento, `lint`, `ui:audit`,
  `education:audit`, `build` e `git diff --check` passaram novamente. O servidor
  local responde 200 em `/tools` na porta 9102.
- A curadoria externa revisada em 31 de agosto passou a ter dez publicações e
  seis projetos. Foram adicionados Cal.com, identificado explicitamente como
  peça fictícia de primeiro de abril; a discussão do Reddit em
  `r/worldbuilding`; a reportagem em português de Aventuras na História; o
  documento de usuário do Scribd, com ressalva de autoria e procedência; e o
  projeto multilíngue Year Zero Change, cuja convenção de Dia Zero difere da
  adotada aqui. O tipo `Discussão comunitária`, o idioma original português e
  os cinco resumos existem nos 12 idiomas. Os títulos preservam o idioma da
  publicação e informam esse idioma semanticamente ao navegador.
- A seção do Sabá passou a usar a sequência cromática roxo/verde na primeira
  alternativa e rosa/âmbar na segunda. O primeiro texto esclarece que o ciclo
  religioso paralelo teria circulação sobretudo nas comunidades observantes e
  que, depois dos Dias Especiais, sua contagem não coincidiria com os rótulos
  civis de sábado ou domingo, exigindo agendas paralelas de igrejas, escolas,
  famílias e empregadores. Antes da contribuição pública foram adicionadas as
  seções fiscais/acadêmicas, de passagem entre anos e de feriados previsíveis,
  todas completas nos 12 idiomas. O mapa das 52 semanas alterna Fiscal e
  Escolar/acadêmico; no segundo modo, Bimestre, Trimestre e Semestre aplicam
  respectivamente 4 × 10, 13 + 14 + 13 e 2 × 20 semanas letivas, com os meses
  1, 7 e 13 reservados às 12 semanas de férias. Os mini meses agora usam nomes
  curtos sem reticências. Os quatro marcos sazonais ficam nas semanas 12, 25, 38
  e 51 e reutilizam a fonte comum de emojis; um novo toggle Norte/Sul troca entre
  outono rosa, inverno roxo, primavera verde e verão âmbar. O trimestre fiscal
  inteiro segue a cor de seu marco. Na visualização escolar, bimestres e
  trimestres seguem a sequência rosa/roxo/verde/amarelo no Sul ou
  verde/amarelo/rosa/roxo no Norte, enquanto os semestres usam a primeira e a
  terceira cores. Um card anterior à
  explicação sazonal propõe nomes baseados em semanas para os períodos letivos.
  A seção seguinte distingue a data comemorativa da folga observada e visualiza
  o dia 2 e o dia 27 como janelas possíveis, não automáticas. Os dias
  fora dos meses continuam recebendo opções explícitas de festa, descanso,
  serviço essencial ou trabalho regulamentado. A publicação integral foi
  autorizada pelo mantenedor em 31 de agosto. Antes do envio, `npm run verify`,
  o dry-run do Worker e `git diff --check` passaram; o pacote mediu 3.249,9 KiB
  brutos e 811,0 KiB gzip, o Worker mediu 148,72 KiB gzip e `/learn` respondeu
  200 na porta 9102.
- A publicação integral de 31 de agosto saiu da `main` no commit privado
  `ef507f7` e foi espelhada no commit público `240bd5a`. A verificação privada
  (`33460394532`), a sincronização pública (`33460394550`), a verificação
  pública (`33460465601`), o GitHub Pages (`33460464780`) e o Cloudflare Pages
  (`33460465645`) concluíram com sucesso. A implantação imutável é
  `a086f83c.13calendar.pages.dev`; o alias principal respondeu HTTP 200 na raiz,
  em `/learn`, `/tools`, `/moon`, `/news`, `/community`, `/privacy` e `/widget`.
  `robots.txt` e `sitemap.xml` responderam 200, e `/reference-site/` redirecionou
  para `/learn`. O chunk publicado de Aprenda contém a nova seção fiscal e
  acadêmica. As APIs `/members`, `/analytics/stats` e `/feedback/votes`
  continuaram respondendo JSON com HTTP 200. Como não houve alteração do Worker
  comunitário, ele foi validado por dry-run, mas não recebeu uma publicação
  redundante. O PDF de teste permanece somente no diretório local ignorado
  `output/` e não foi enviado aos repositórios.
- O refinamento posterior unificou ao roxo oficial da paleta todas as etapas
  escolares que antes usavam o azul auxiliar das células de fim de semana. Elas
  agora reutilizam exatamente os tokens da estação Inverno nos cards e nas
  legendas de bimestres e trimestres dos dois hemisférios. Os semestres mantêm a
  combinação rosa/verde definida pelo modelo, sem introduzir uma cor extra. A
  correção foi publicada nos commits privado `c59d95a` e público `c029b4c`.
  Verificação privada (`33461044644`), sincronização (`33461044601`), verificação
  pública (`33461120131`), GitHub Pages (`33461119446`) e Cloudflare Pages
  (`33461120150`) concluíram com sucesso; a implantação imutável é
  `86fb811a.13calendar.pages.dev`. Na produção, o azul antigo não aparece em
  nenhum bloco escolar, e texto, fundo e borda do roxo escolar coincidem
  exatamente com os valores do trimestre fiscal de Inverno.
- O popup `Gerenciar perfil publicado` passou a impedir qualquer rolagem
  horizontal. A captura automática ocupa a primeira linha inteira; envio e
  remoção de foto dividem igualmente a linha seguinte. A criação do link
  privado e a exclusão também dividem a largura em telas amplas e são
  empilhadas, com larguras iguais e nessa ordem, quando a tela é pequena. O
  corpo só admite rolagem vertical quando a altura disponível realmente não
  comporta o conteúdo. As regras reutilizam o contrato global de botões para
  preservar o texto em uma linha sempre que houver espaço, inclusive após
  traduções.
- Os quatro cards da seção sobre o Sabá foram normalizados sem mudar suas
  cores: os dois da esquerda pertencem à alternativa 1 e os dois da direita à
  alternativa 2; todos agora têm número, título compacto, explicação e uma
  linha curta de destaque. As novas linhas existem nos 12 idiomas. As
  conclusões das seções do Sabá, planejamento fiscal/acadêmico, passagem entre
  anos e feriados previsíveis compartilham a mesma faixa editorial compacta,
  mantendo o tom cromático original de cada conteúdo. O componente e os
  trechos estruturais alterados permanecem comentados em português.
- A revisão visual foi inspecionada localmente em larguras de 1280, 760, 560 e
  390 px. Não houve vazamento lateral; em 390 px os cards e avisos ocupam a
  largura disponível e os botões do popup são empilhados sem texto fora da
  área. `git diff --check` e `npm run verify` passaram integralmente. O pacote
  mediu 3.253,2 KiB brutos e 812,6 KiB gzip, e as auditorias de UI, educação,
  calendário, feriados, segurança e dependências de produção concluíram sem
  erro.
- Essa revisão saiu no commit privado `f4d3296` e foi espelhada no público
  `279c798`. A verificação privada (`33493042952`), a sincronização pública
  (`33493042751`), a publicação privada de redundância no Cloudflare
  (`33493042827`), a verificação pública (`33493154907`), o GitHub Pages
  (`33493156519`) e o Cloudflare Pages público (`33493154906`) concluíram com
  sucesso. A implantação imutável é `f559d33b.13calendar.pages.dev`. Tanto ela
  quanto o alias principal responderam HTTP 200 na raiz, em `/learn`, `/tools`,
  `/moon`, `/news`, `/community`, `/privacy`, `/widget`, `robots.txt` e
  `sitemap.xml`. Os chunks publicados contêm o componente editorial comum, as
  quatro novas linhas de destaque por idioma e os três grupos corrigidos do
  popup. As APIs `/members`, `/analytics/stats` e `/feedback/votes` continuaram
  respondendo JSON com HTTP 200.
- Os cards coloridos de conteúdo das seções de implantação, planejamento
  fiscal/acadêmico e passagem entre anos passaram a usar o componente comum
  `EducationContentCard`. Sua altura sempre nasce do texto e da largura real do
  próprio card; a grade usa linhas `max-content`, um mínimo visual opcional e
  uma consulta de contêiner para reorganizar a composição sem depender apenas
  do viewport informado pelo WebKit. Isso corrige o recorte observado somente
  na PWA instalada em larguras extremas. Avisos finais continuam separados em
  `EducationClosingNotice`, com geometria editorial própria. Os dois contratos
  estão documentados em `docs/UI_CARD_SYSTEM.md` e protegidos por
  `npm run ui:audit`. A revisão local passou em português nas larguras 320,
  335, 390, 620, 760 e 900 px e em russo a 335 px, sem vazamento vertical ou
  lateral, sobreposição ou rolagem horizontal. `npm run verify` e
  `git diff --check` também passaram; o pacote mediu 3.253,2 KiB brutos e
  813,0 KiB gzip.
- O planejador anual recebeu uma terceira ação ao lado de ICS e PDF para
  anunciar a futura Agenda. Ela usa o contrato global de botões, tem
  `aria-disabled`, não possui rota nem endereço e mostra o texto localizado
  “Recurso disponível em breve” no hover, foco ou clique. Os dois textos novos
  existem nos 12 idiomas. A auditoria educacional impede que o acesso ganhe uma
  rota antes da criação do produto independente. Em 1280 px as três ações
  permanecem na mesma linha; em 360 px o grupo e o seletor se reorganizam em
  coluna, sem rolagem horizontal. A URL permaneceu inalterada após o clique.
  Antes da publicação autorizada, `git diff --check` e `npm run verify`
  passaram integralmente; o pacote mediu 3.255,0 KiB brutos e 813,6 KiB gzip,
  sem vulnerabilidades nas dependências de produção.
- O pacote foi publicado pelo commit privado `6840c88` e espelhado no público
  `301fb0f`. A verificação privada (`33502976472`), a sincronização pública
  (`33502976312`), a publicação privada de redundância no Cloudflare
  (`33502976386`), a verificação pública (`33503074042`), o GitHub Pages
  (`33503072822`) e o Cloudflare Pages público (`33503073990`) concluíram com
  sucesso. A implantação imutável informada pela esteira é
  `9ba20e65.13calendar.pages.dev`.
- A futura Agenda foi aberta como projeto local independente em
  `/Users/jean7rafael/Documents/Codex/2026-09-01/agenda-13-calendar`, na tarefa
  `Agenda 13 Calendar`. A primeira frente está limitada à criação de
  `docs/AGENDA_PRODUCT_GUIDE.md`: nenhuma rota, armazenamento, manifesto,
  service worker ou scaffold da Agenda será incorporado a este aplicativo.
- A ação da Agenda pertence ao próprio cabeçalho do planejador anual, depois de
  ICS e PDF; não existe uma segunda localização. Uma captura da PWA instalada
  em 1º de setembro ainda mostrou o pacote anterior: o card conservava o limite
  antigo de 980 px, apenas três redes sociais e somente as duas ações antigas.
  O fonte privado, o espelho público e a implantação de produção registrada no
  GitHub já contêm a terceira ação. A SPA aberta não troca seu JavaScript durante
  a execução; é necessário encerrar totalmente essa instância e abri-la outra
  vez para carregar o pacote publicado. As recargas comum, direta da origem e
  com consulta inédita continuaram no pacote antigo porque a conexão com os
  endereços `pages.dev` estava indisponível e o modo offline respondeu com sua
  reserva local; a implantação `ec0dfe3c` permanece classificada como produção
  no Cloudflare. O diagnóstico não encontrou regressão estrutural nem justificou
  mover ou duplicar o botão.
- O mecanismo offline foi fortalecido para não congelar uma publicação antiga.
  Cada build recebe `APP_RELEASE_ID` do commit do GitHub ou do Cloudflare e usa
  esse valor na URL do service worker; `updateViaCache: none` e uma chamada
  explícita a `registration.update()` obrigam a comparação em toda abertura. O
  cache passou de `13calendar-runtime-v1` para `v2`, eliminando a cópia anterior
  na ativação. Navegações, scripts, estilos e workers consultam a rede primeiro
  e só recorrem ao cache quando ela falha; os outros recursos mantêm a resposta
  rápida e a atualização em segundo plano. `/sw.js` recebe cabeçalho `no-store`.
  O aviso localizado de versão nova já existente continua oferecendo a recarga,
  sem apagar favoritos ou outras preferências locais. `npm run verify`, as
  verificações sintáticas, `git diff --check` e as duas auditorias de segurança
  passaram; o pacote mediu 3.255,1 KiB brutos e 813,7 KiB gzip.
- A correção de atualização foi publicada no commit privado `a59218c` e
  espelhada no público `3c4922b`. Verificação privada (`33524409207`),
  sincronização (`33524409314`), publicação Cloudflare privada de redundância
  (`33524409142`), verificação pública (`33524533074`), GitHub Pages
  (`33524530607`) e Cloudflare Pages público (`33524534145`) concluíram com
  sucesso. A implantação imutável de produção é
  `e1d201e7.13calendar.pages.dev`. Ela contém 48 arquivos novos e o cache `v2`.
  A recarga final do Safari ainda usou a reserva offline porque a conexão TCP
  deste Mac com `13calendar.pages.dev` continuava recusada; por isso a ausência
  temporária do botão nessa janela não representa falha da nova implantação.
- Em 1º de setembro, a ação de PDF do planejador foi abreviada para “Imprimir
  PDF”, com equivalentes curtos e auditados nos 12 idiomas, sem alterar o
  gerador determinístico de 40 páginas. O sistema universal de botões também
  passou a recalcular as larguras quando uma fonte tardia termina de carregar;
  isso elimina a medida provisória do texto do ícone sem depender de hover. Na
  inspeção local, as três ações ficaram em uma linha com 190 × 44 px a 1280 px,
  em 2 + 1 a 520 px e empilhadas a 360 px, sempre sem vazamento de rótulo nem
  rolagem horizontal. `npm run verify` e `git diff --check` passaram; o pacote
  mediu 3.255,0 KiB brutos e 813,6 KiB gzip, com zero vulnerabilidades nas duas
  árvores de produção.
- A correção final saiu no commit privado `968d49d` e foi espelhada no público
  `df0ae84`. A sincronização privada (`33526764528`), a verificação pública
  (`33526875928`), o GitHub Pages (`33526876245`) e o Cloudflare Pages
  (`33526875968`) concluíram com sucesso. A implantação imutável é
  `88ba8be0.13calendar.pages.dev`; os pacotes publicados contêm os rótulos
  curtos e a nova medição `loadingdone`. O alias principal respondeu HTTP 200
  na raiz, nas sete rotas públicas, em `robots.txt` e `sitemap.xml`; o legado
  redirecionou para `/learn`, e as três APIs comunitárias responderam HTTP 200.

## Pendências atuais

- Aguardar a aprovação humana de `13calendar.eu.org`; depois associá-lo ao
  Cloudflare Pages e executar a troca coordenada descrita em
  `docs/OWNER_ACTIONS.md`.
- Acompanhar no Google Search Console quais páginas e consultas começaram a
  receber impressões, a indexação das rotas novas, a substituição do nome de
  site `Cloudflare` por `13 Calendar` e a evolução em consultas genéricas. O
  domínio EU.org, quando aprovado, reforçará a identidade, mas não é requisito
  técnico para o nome próprio.

## Protocolo de manutenção deste arquivo

Ao finalizar cada nova solicitação do projeto:

1. atualize `Última atividade`;
2. incorpore decisões novas nas seções temáticas, sem duplicá-las;
3. atualize o estado atual, as pendências e os resultados das verificações;
4. remova informações superadas;
5. mantenha o documento curto e suficiente para outro agente continuar o
   trabalho sem acesso à conversa.
