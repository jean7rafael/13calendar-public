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

- **Última atividade:** 2026-08-25.
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
- O `README.md` apresenta em inglês, com resumo em português, as funcionalidades
  consolidadas, a integração bidirecional e o botão `X` de retorno. Ele também
  registra que o repositório original `Andree37/13-months` não possui licença
  publicada e que a demonstração integrada é experimental enquanto o autor é
  consultado.
- A solicitação de autorização e colaboração foi enviada ao autor em
  `https://github.com/Andree37/13-months/issues/2`. Ela oferece uma demonstração
  privada, resume as funcionalidades e destaca que o botão `X` retorna ao site
  original. O pedido segue aberto; revisar a publicação quando houver resposta.
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
- A barra da página incorporada foi medida contra a barra Quasar: ações usam
  caixas de aproximadamente 34 px, intervalo de 8 px e desenhos de 24 px para
  menu e calendário. Isso eliminou a diferença de escala e espaçamento sem
  aumentar os ícones de comunidade e tema. O rodapé agora aceita uma variação
  compacta: a comunidade não repete “Datas merecem contexto”, mas mantém a
  mesma faixa institucional inferior da página dos calendários. A versão
  completa continua somente na página principal. O separador superior também
  passou a pertencer ao componente compartilhado: nas duas páginas ele tem 2 px,
  maior intensidade no centro e desaparece gradualmente nas bordas. `lint`,
  compilação Solid, compilação Quasar e inspeção local passaram.
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
- O código original do projeto recebeu licença MIT em `LICENSE`. A página
  educacional adaptada permanece fora dessa licença e documentada em
  `THIRD_PARTY_NOTICES.md` e `vendor/13months-site/UPSTREAM.md`, pois o projeto
  de origem ainda não publicou uma licença própria. `SECURITY.md`,
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

## Pendências atuais

- Acompanhar `Andree37/13-months#2`. Em 2026-08-24, o pedido ainda está aberto e
  o repositório de origem continua sem licença explícita. A demonstração
  experimental foi publicada por decisão do mantenedor; aplicar prontamente
  qualquer pedido de licença, atribuição, mudança visual ou retirada do autor.
- Aguardar a aprovação humana de `13calendar.eu.org`; depois associá-lo ao
  Cloudflare Pages e executar a troca coordenada descrita em
  `docs/OWNER_ACTIONS.md`.
- Concluir a verificação de `https://13calendar.pages.dev/` no Google Search
  Console e enviar `sitemap.xml`. A tag HTML já está publicada; essa etapa pode
  ser concluída antes da aprovação do domínio próprio.

## Protocolo de manutenção deste arquivo

Ao finalizar cada nova solicitação do projeto:

1. atualize `Última atividade`;
2. incorpore decisões novas nas seções temáticas, sem duplicá-las;
3. atualize o estado atual, as pendências e os resultados das verificações;
4. remova informações superadas;
5. mantenha o documento curto e suficiente para outro agente continuar o
   trabalho sem acesso à conversa.
