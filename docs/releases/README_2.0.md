# 13 Calendar 2.0 — documento da versão

**Situação:** publicada pela `main` por meio dos workflows verificados de
release da página e da API comunitária.

## Direção da versão

A versão 2.0 deixa de se apresentar como um complemento dependente do
`13months.net`. O 13 Calendar passa a ser um produto educacional independente,
construído integralmente em Vue e Quasar, com fontes, limitações e referências
externas claramente identificadas. O conteúdo histórico da versão 1.0 foi
preservado em [`README_1.0.md`](README_1.0.md).

Referenciar o trabalho de outros projetos continua sendo importante, mas não
define mais a arquitetura, a navegação nem a identidade do produto.

## Nova estrutura do produto

A navegação pública segue uma ordem única em todas as páginas:

1. Aprenda;
2. Ferramentas;
3. Calendários;
4. Lua;
5. Notícias;
6. Comunidade;
7. tema, sempre como último controle.

A ordem da barra não define a entrada: a raiz `/` abre Calendários, a primeira
página desenvolvida no projeto. Aprenda permanece disponível em `/learn`.

Cada rota conserva um título curto na barra superior. A rota ativa recebe o
mesmo realce do estado de hover. Em larguras intermediárias, os textos dos
botões desaparecem antes dos ícones; na menor tela, a navegação migra para uma
gaveta à direita.

## Calendários e equivalências

- Calendário Gregoriano e Calendário Fixo Internacional usam a mesma fonte de
  conversão e permanecem sincronizados.
- Em tela ampla, os dois lados continuam visíveis e alinhados.
- No ponto em que os cards antes seriam empilhados, um seletor compacto permite
  alternar entre **Gregoriano** e **13 meses**. O calendário escolhido mantém
  juntos seu card de feriados, o calendário e o card de fases da Lua.
- Os dois calendários possuem o mesmo botão **Hoje**.
- Feriados e fases da Lua exibem tooltips de equivalência nos dois sentidos:
  datas gregorianas informam a data IFC com a abreviatura curta `IFC`; datas IFC
  informam a data gregoriana.
- Datas adaptadas preservam a data gregoriana realmente calculada, sem aplicar
  uma reconversão simplificada que alteraria o resultado.
- Comparações diretas sempre mostram o ano nos dois lados, nomes completos dos
  dias da semana e a mesma altura de rótulos. Em português, os nomes destacados
  não usam o sufixo `-feira`. Se uma tradução longa exigir redução, o maior
  texto determina a mesma escala para as duas colunas.
- A ordem mês/dia segue cada idioma de forma idêntica nos dois lados. O ponto
  `·` separa dia da semana e data. A regra universal apresenta `dia da semana ·`
  na primeira linha e dia/mês, inseparáveis, na segunda.
- No widget, rótulos, datas, anos e crédito ficam centralizados nas colunas.
- Na visualização reduzida, um aviso traduzido explica que girar a tela ou usar
  uma tela maior apresenta os dois calendários lado a lado.
- Dia do Ano e Dia Bissexto permanecem fora da semana. Na concepção adotada, o
  Dia Bissexto vem imediatamente depois do Dia do Ano.

## Seletores compartilhados

- Os seletores nativos de data do navegador foram removidos das ferramentas.
- Um componente único permite digitar no formato `AAAA/MM/DD` ou abrir uma
  janela com as grades de dia, mês e ano.
- A janela não fecha durante a troca de mês ou ano; a pessoa conclui a escolha
  somente depois de revisar a data inteira.
- Campos isolados de ano continuam aceitando digitação e também abrem uma grade
  visual de 21 anos com navegação por blocos.
- No aniversário, o ano da comemoração é escolhido primeiro e aparece uma única
  vez. Em seguida, o calendário de dia e mês é aberto já naquele ano, mostrando
  corretamente os dias da semana gregorianos sem criar uma segunda escolha de
  ano.
- O formato aparece como placeholder dentro do campo, não como uma linha de
  ajuda inferior que alteraria sua altura em formulários horizontais.
- O espaço inferior invisível dos seletores foi removido; campos e ações de uma
  mesma linha começam e terminam alinhados.
- Conversor, cartão compartilhável, aniversário, favoritos e nascer/pôr do Sol
  usam o seletor comum. Planejador, astronomia, conteúdo lunar, aniversário e
  conversão IFC usam o seletor comum de ano.
- No sentido IFC → Gregoriano, mês e dia regular usam um único campo com janela
  de 13 meses e 28 dias. Dia Bissexto fica desativado nos anos comuns; ao trocar
  de ano, uma escolha que deixou de ser válida retorna a Dia regular.
- O espaço do campo IFC continua reservado em Dia do Ano e Dia Bissexto. Assim,
  o seletor de ano e a faixa de tipos mantêm exatamente a mesma altura e posição
  ao alternar entre as três opções.
- A auditoria de interface impede que um novo `type="date"` seja introduzido.

## Área Aprenda

- A antiga entrada incorporada é substituída gradualmente por conteúdo nativo
  Vue/Quasar.
- O topo nativo recupera a composição comparativa da referência: `Seu
  calendário` e Calendário Fixo Internacional ficam separados por `vs.`, com
  gradientes próprios, o ano nos dois lados, a quantidade real de dias do mês
  gregoriano, 28 dias em todos os meses fixos e o relógio fora do card.
- As duas ações do topo usam as famílias compartilhadas de botão e mantêm texto
  e seta na mesma linha em qualquer largura.
- A explicação estrutural reúne cinco cards mais detalhados, incluindo a semana
  invariável. O título do mês modelo permanece fora do card; domingos usam rosa
  e sábados continuam em roxo.
- A visão anual deixou de repetir uma faixa resumida separada. Ela apresenta os
  13 mini calendários e o card de Dias especiais numa única grade. Em desktop,
  são duas fileiras de sete; Solaris usa âmbar e o último card usa verde para
  mostrar `364 + 1 = 365` ou `364 + 1 + 1 = 366`, sem parcela zero no ano
  comum. As células são compactas e não têm caixas
  coloridas em torno dos números. As duas fileiras adotam a altura do maior
  card; no celular, Dias especiais ocupa o mesmo bloco ao lado de dezembro.
- A grade anual usa a largura disponível até 1700 px. Mantém sete colunas a
  partir de 1580 px, passa a quatro antes de as abreviações colidirem e usa duas
  até 860 px; os cabeçalhos compactos usam fonte de 6 px. O dia atual recebe
  roxo escuro translúcido, ou rosa escuro translúcido quando é domingo, nos dois
  temas; os dias úteis de Solaris mantêm a cor de texto dos demais meses.
- O seletor anual mantém `‹ ano ›` geometricamente centralizado. A posição do
  botão Hoje é reservada mesmo quando ele está oculto, evitando saltos entre
  anos; na menor tela, a reserva fica numa segunda linha.
- A história usa uma linha do tempo alternada, seis cards de perguntas com o
  mesmo hover, tenham destino ou não, e um destaque para os 61 anos de uso pela
  Kodak. A seção completa sobre o Sabá foi restaurada com duas alternativas,
  ciclos civil e contínuo, sequência visual, limitações e fontes históricas.
- O título de abertura da linha do tempo usa o mesmo peso forte dos demais
  títulos. O título do Sabá também usa esse peso. A seção lunar permanece
  inteira e, junto com a Metodologia, ocupa a rota própria `/moon`, disponível
  na barra superior; seus avisos finais reutilizam os painéis institucionais
  roxo e âmbar. A página usa o crescente roxo no cabeçalho e a Metodologia
  reutiliza a composição inferior dos cartões de contexto dos calendários. Os
  três textos metodológicos explicam o papel específico de cada fonte em vez de
  repetir os avisos lunares anteriores.
- No comparativo do topo, nenhuma palavra pode ser dividida. O maior texto
  continua definindo a escala dos dois lados e, até 1239 px, o herói completo
  muda antecipadamente para uma coluna antes que russo ou outro idioma
  transborde.
- A resolução de implantação é uma seção própria logo depois do Sabá e antes da
  votação. Ela combina quatro obstáculos coloridos com um formulário; em tela larga,
  o conjunto 2 × 2 da esquerda tem a mesma altura total do card da direita e,
  empilhado, volta à altura natural. A votação fica separada, substitui emojis
  por quatro expressões Material nas cores verde, roxa, âmbar e rosa e encerra
  com `13 ● MONTHS ● CALENDAR`. Voto e relato perguntam separadamente por
  publicação anônima ou associação ao próprio card aprovado da Comunidade
  mediante o código privado; não existe login nessa etapa.
- O conteúdo explica funcionamento, história, vantagens, limites e críticas do
  calendário de 13 meses sem transformar alegações externas em fatos.
- A seção lunar distingue o mês fixo de 28 dias do ciclo sinódico médio de
  aproximadamente 29,53 dias. Fases da Lua atravessam os limites dos meses e
  não funcionam como prova astronômica de um calendário civil.
- Fontes e metodologia permanecem visíveis para permitir revisão.
- Aprenda, Ferramentas, Lua e Notícias possuem conteúdo completo nos 12 idiomas. A
  auditoria rejeita qualquer fallback editorial literal em inglês, exceto anos
  históricos, nomes próprios e templates sem texto traduzível.

## Ferramentas

- Conversão bidirecional de datas.
- Cartão compartilhável gerado localmente e com ano nos dois calendários.
- Comparador de aniversários.
- Planejador anual com exportação ICS e impressão/PDF.
- Equinócios, solstícios, periélio, afélio, nascer e pôr do Sol.
- Os cards do ano solar e de nascer/pôr do Sol têm a mesma altura lado a lado.
  O primeiro reparte essa altura em sete faixas iguais; empilhados abaixo de
  860 px, os dois retomam sua altura natural.
- Favoritos armazenados somente no navegador.
- Widget IFC, PWA e cartões editoriais.
- Formatação, imagens e widgets usam o mesmo mecanismo de comparação do site.

## Notícias e referências externas

- Notícias é uma rota pública independente.
- A página reúne matérias, pesquisas e outros projetos, incluindo Google News,
  13months.net e 13cal.net, sem tratar a presença na lista como endosso.
- Avisos editoriais usam o painel visual compartilhado em âmbar.
- Links externos mantêm autoria e responsabilidade próprias.
- Títulos de matérias preservam o texto original da publicação. Os resumos
  escritos pelo 13 Calendar e os rótulos de idioma são traduzidos nos 12
  idiomas e auditados individualmente por referência.

## Fontes de dados e referências

Este é o destino do link **Fontes de dados** no rodapé. Ele separa as bases que
alimentam cálculos e feriados das referências editoriais usadas para explicar o
projeto. O link **Código-fonte** continua apontando para a raiz do repositório.

### Feriados civis

- [date-holidays](https://github.com/commenthol/date-holidays): base civil
  internacional usada pelo provedor principal de 206 países e territórios.
- [Padrão de países e feriados](../HOLIDAY_COUNTRY_STANDARD.md): critérios de
  inclusão, tradução, substituição e revisão.
- [Cobertura oficial por país e ano](../OFFICIAL_HOLIDAY_COVERAGE.md): explica
  quando o aplicativo possui ou ainda aguarda confirmação oficial.
- [Apêndice completo de fontes governamentais](../../src/holidays/generated/officialHolidayAppendix.json):
  relação mantida pelo projeto para os locais que não são cobertos diretamente
  pela base civil ou que precisam de confirmação adicional.
- [Brasil — calendário da Administração Pública Federal](https://www.gov.br/gestao/pt-br/assuntos/gestao-e-inovacao/feriados-e-pontos-facultativos)
  e [legislação federal](https://www.planalto.gov.br/ccivil_03/leis/l0662.htm).
- [Estados Unidos — Office of Personnel Management](https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/).
- [França — Service Public](https://www.service-public.fr/particuliers/vosdroits/F2405).
- [Espanha — Boletín Oficial del Estado](https://www.boe.es/buscar/doc.php?id=BOE-A-2025-21667).
- [Alemanha — Ministério Federal do Trabalho](https://www.bmas.de/SharedDocs/Downloads/DE/Publikationen/a711-arbeitsrecht.pdf?__blob=publicationFile&v=1).
- [Rússia — calendário oficial de 2026](https://government.ru/docs/all/161028/).

Os links governamentais exibidos dentro dos próprios cards continuam sendo a
fonte mais específica para cada ocorrência. Datas marcadas como editoriais não
são apresentadas como feriados legais.

### Lua, Sol, estações e eventos astronômicos

- [Astronomy Engine](https://github.com/cosinekitty/astronomy): motor usado no
  aplicativo para fases da Lua, equinócios, solstícios, periélio, afélio, nascer
  e pôr do Sol. Os resultados são convertidos para o fuso local quando a tela
  exige uma data civil.
- [NASA — fases da Lua](https://science.nasa.gov/moon/moon-phases/): referência
  conceitual para a sequência e a natureza das fases.
- [NASA/GSFC — catálogo de fases da Lua](https://eclipse.gsfc.nasa.gov/phase/phase2001gmt.html):
  referência tabular independente para conferência de instantes.
- [NASA/GSFC — calendário de eventos do céu](https://eclipse.gsfc.nasa.gov/SKYCAL/SKYCAL.html):
  referência externa para eventos astronômicos por ano.
- [NASA — o Sol](https://science.nasa.gov/sun/): referência geral para o astro
  e o ano solar que serve de base aos calendários civis.
- [Política científica e lunar do projeto](../PRODUCT_ROADMAP_AND_LUNAR_POLICY.md#9-fontes-principais):
  documentação das limitações, alegações analisadas e fontes complementares.

### Calendários e história

- [Calendário Fixo Internacional — Wikipédia](https://en.wikipedia.org/wiki/International_Fixed_Calendar):
  visão geral histórica; permanece também como link próprio no rodapé.
- [Regras adotadas pelo 13 Calendar](../CALENDAR_13_STANDARD.md): convenções
  explícitas da conversão, dos dias especiais e da apresentação visual.
- [13months.net](https://13months.net/) e [13cal.net](https://13cal.net/):
  projetos independentes analisados como referências comparativas, sem vínculo
  técnico, endosso ou dependência do 13 Calendar.

### Transparência de uso

As fontes acima têm papéis diferentes: algumas fornecem dados calculáveis,
outras permitem conferência e outras documentam contexto histórico ou alegações
externas. A presença nesta lista não transforma conteúdo de terceiros em
posição oficial do projeto. Licenças e limites de adaptação ficam registrados
em [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md).

## Comunidade e privacidade

- Totais agregados de visita podem ser exibidos sem criar perfis individuais.
- Cadastro público continua voluntário, moderado e protegido por Turnstile.
- Vitrine pública preserva a ordem histórica; moderação preserva os mais novos
  primeiro.
- Fotos usam uma máscara circular compartilhada em todas as superfícies.
- Captura pública, reenvio manual e mensagens de erro acionáveis fazem parte do
  fluxo de gerenciamento.
- Sucesso e erro de uma ação modal aparecem dentro do próprio modal.
- Remoção privada limpa universalmente o estado de validação após sucesso.
- A composição começa com o aviso verde e, logo em seguida, `Faça parte`; a
  vitrine de participantes vem depois, para que o convite não fique esquecido.
- Cards associados à votação exibem um ícone de participação sem revelar a
  escolha e, quando há relato, outro ícone abre o texto completo em diálogo.
  Relatos anônimos ficam numa seção posterior: a lista mostra só os títulos e o
  mesmo diálogo revela cada resposta.
- Voto, título e relato são persistidos no D1; a migração
  `0007_create_reference_feedback_responses.sql` conserva modos e vínculos
  independentes para voto e resposta. O código privado é conferido por hash e
  não é publicado; a opção de voto nunca entra na resposta pública de membros.
  O workflow aplica as migrações D1 antes de publicar uma nova versão do Worker.
- Os novos textos de votação, autoria, participantes e relatos anônimos possuem
  catálogos próprios e completos nos 12 idiomas. O aviso de privacidade descreve
  a publicação anônima ou associada e a agregação dos votos.

## Sistema visual

- Três famílias de botões: primário violeta preenchido, secundário neutro
  preenchido e terciário contornado.
- Paleta oficial documentada em [`../UI_COLOR_PALETTE.md`](../UI_COLOR_PALETTE.md):
  roxo para navegação e ação, verde para segurança/confirmação e âmbar para
  atenção, ressalvas e Dia Bissexto.
- `AppPageHero`, `AppNoticePanel`, `AppProfileAvatar` e `AppFooter` evitam
  variações locais.
- Rodapé público tem altura e conteúdo únicos: fontes dos dados, Wikipédia,
  código-fonte e aviso de privacidade, cada um com ícone.
- “Datas merecem contexto” permanece conteúdo exclusivo da página Calendários,
  não parte do rodapé.

## Qualidade, continuidade e manutenção

- Regras universais são validadas por auditorias, não corrigidas tela por tela.
- O protocolo de continuidade e o checkpoint vivo registram objetivo, decisões,
  verificações e próxima ação para reduzir perdas após limites de uso.
- Conversões, feriados, traduções, interface, comunidade, bundle e produção têm
  verificações próprias.
- O orçamento gzip total foi recalibrado de 680.000 para 715.000 bytes depois
  dos 12 catálogos de votação e comunidade; o build atual ocupa cerca de 690
  mil bytes, preservando uma margem de aproximadamente 20 mil. Os limites por
  arquivo e o teto bruto não foram ampliados.
- A supervisão foi concluída e a versão é publicada a partir da `main` somente
  depois de passar pelo fluxo integral de verificação e sincronização pública.

## Serviços externos em acompanhamento

- `13calendar.eu.org` aguarda aprovação humana. O pedido foi tecnicamente
  validado e tem três dias; a documentação oficial informa que essa etapa pode
  levar alguns dias. O DNS principal do EU.org continua recebendo atualizações,
  mas não há fila pública que permita medir a frequência dos moderadores.
- O Google Search Console está configurado e apenas processa sitemap e
  indexação no prazo do Google.

Nenhum dos dois bloqueia o site: Cloudflare Pages permanece canônico e o
Search Console é observabilidade, não requisito de funcionamento.
