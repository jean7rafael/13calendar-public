# 13 Calendar — roteiro de produto, migração educacional e política sobre a Lua

Atualizado em 27 de agosto de 2026.

## 1. Decisão registrada

O 13 Calendar continuará sendo um projeto gratuito, independente e baseado na
infraestrutura já contratada. O domínio `.net` ou qualquer outro domínio pago
não é necessário para executar este roteiro. O alcance de projetos semelhantes
vem principalmente de conteúdo encontrável, ferramentas úteis, links
compartilháveis e uma experiência móvel consistente — não da extensão do
domínio.

A antiga página incorporada, adaptada do projeto `Andree37/13-months`, deixou de
ser o centro da apresentação. Seu conteúdo útil foi reescrito como uma área
educacional nativa em Vue 3 e Quasar, usando os mesmos cálculos, idiomas, tema,
navegação e padrões visuais do aplicativo. A cópia compilada foi retirada do
pacote público; o código-fonte original permanece isolado em `vendor` somente
como registro de contingência enquanto a autorização do autor não é encerrada.

Esta decisão evita manter dois produtos visuais e dois conjuntos de componentes
que podem divergir em fórmulas, traduções, responsividade e acessibilidade.

## 2. Princípios do produto

1. **Uma fonte para cada verdade.** Conversão de datas, fases da Lua,
   traduções, botões, avatares, campos e mensagens devem vir de módulos
   compartilhados.
2. **Ferramenta antes de promessa.** O site deve permitir comparar, converter,
   imprimir e compartilhar datas; não deve vender um calendário como solução
   médica, espiritual ou universal.
3. **Transparência editorial.** Sempre distinguir o Calendário Fixo
   Internacional histórico da convenção específica adotada pelo projeto.
4. **Sem bloqueio comercial.** Nenhuma função básica exigirá pagamento, conta
   ou e-mail.
5. **Celular é o caso normal.** Toda nova área precisa funcionar desde 320 px,
   com ações tocáveis, texto sem corte e conteúdo sem transbordamento lateral.
6. **Evidência proporcional à afirmação.** Astronomia pode ser apresentada com
   cálculos e fontes; tradição cultural deve ser identificada como tradição;
   alegações de saúde só podem aparecer quando houver evidência clínica robusta.

## 3. Melhorias em relação ao 13cal.net

### 3.1 Navegação e responsividade

- Usar uma única barra superior em todas as páginas, com título contextual,
  marca, menu, tema e caminhos previsíveis para calendário, conteúdo educativo
  e comunidade.
- Padronizar tamanho, área de toque, alinhamento, foco e `hover` dos ícones.
- Manter ações secundárias no menu lateral em telas estreitas.
- Exibir calendário gregoriano e IFC lado a lado quando houver espaço e em
  alternância clara no celular.
- Testar automaticamente larguras de 320, 360, 390, 768, 1024 e 1440 px nos 12
  idiomas.

### 3.2 Conteúdo compartilhável

- Criar um cartão “hoje” com a data gregoriana e a data IFC.
- Permitir baixar a imagem e compartilhar por WhatsApp, Facebook, X ou pelo
  menu nativo do aparelho.
- Criar links que preservem a data escolhida e a direção da conversão.
- Criar uma experiência de aniversário com cartão próprio.
- Produzir cartões editoriais de curiosidades históricas e astronômicas.
- Oferecer futuramente um `widget` incorporável com crédito e link para a fonte.

### 3.3 SEO e conteúdo encontrável

- Migrar gradualmente do roteamento baseado em `#` para endereços públicos
  reais, preservando redirecionamentos dos links antigos.
- Manter no `sitemap` apenas páginas públicas; moderação, remoção e acesso
  interno devem continuar fora dele.
- Publicar páginas ou seções específicas sobre:
  - o que é o IFC;
  - por que 13 meses e por que 28 dias;
  - IFC em comparação ao calendário gregoriano;
  - Moses Cotsworth, George Eastman e o uso na Kodak;
  - Solaris, Dia do Ano e Dia Bissexto na convenção do projeto;
  - conversão de datas e aniversários;
  - Lua, feriados, adaptação social, objeções religiosas e FAQ;
  - metodologia, fontes e limites.
- Dar a cada conteúdo título, descrição, imagem social, dados estruturados e
  ligações internas próprios.
- Garantir conteúdo legível pelo Google sem depender da execução completa da
  interface e auditar `canonical`, metadados, links quebrados e `sitemap`.

### 3.4 Ferramentas

- Visão anual dos 13 meses e comparação anual Gregoriano × IFC.
- Busca de data, ação “hoje” e detalhes do dia.
- Camadas opcionais para estações, solstícios, equinócios, duração do dia,
  nascer/pôr do Sol, periélio/afélio e fases da Lua.
- Exportação ICS, planejador anual gratuito e PDF sem coleta de e-mail.
- Impressão econômica, PWA/offline e favoritos locais.
- Não transformar ritmos circadianos ou lunares em alegações de saúde sem
  evidência adequada.

### 3.5 Credibilidade

- Explicar o que pertence à proposta histórica e o que é escolha do 13
  Calendar — em especial a posição do Dia Bissexto.
- Informar fonte e data de consulta dos feriados.
- Explicar que uma fase lunar é um instante astronômico e que a data exibida
  depende do fuso do usuário.
- Diferenciar “instante exato da fase” da aparência gradual observada no céu.
- Manter metodologia, histórico de alterações, autoria e referências visíveis.
- Cobrir conversões e Dias Especiais com testes; não fixar datas relativas no
  código quando elas puderem ser calculadas.

### 3.6 Comunidade

- Continuar mostrando acessos agregados, evolução, países e páginas de
  interesse sem exibir dados pessoais.
- Preservar o histórico da votação e permitir compartilhar seu resultado.
- Explicar de forma simples que a participação de perfis é voluntária e
  moderada.
- Integrar visualmente comunidade, ferramenta e conteúdo educativo, sem
  transformar a participação em obstáculo.

### 3.7 Prevenção de regressões

- Um núcleo único para os cálculos dos dois calendários.
- Um catálogo compartilhado para cada idioma e uma auditoria de cobertura.
- Uma barra superior e classes universais para ações, campos, avatares,
  mensagens e popups.
- Foto de perfil sempre circular por meio do componente comum.
- Mensagens de sucesso ou erro dentro do componente que iniciou a ação.
- Testes de Dias Especiais, traduções, acessibilidade, responsividade e SEO.
- Arquivos com versão e aviso claro quando o navegador estiver usando uma
  publicação antiga.
- Uma única rotina de publicação: gerar dados, atualizar artefatos, auditar
  fórmulas, idiomas, interface, SEO e responsividade, publicar, testar a versão
  pública e registrar a versão.

### 3.8 Notícias, reportagens e outros projetos

- Manter a página independente `/news`, acessível pela navegação superior, e
  separar claramente reportagens, cobertura histórica, páginas de referência,
  projetos independentes e ofertas comerciais.
- Usar Google e Google Notícias para descoberta, mas sempre ligar o item à
  publicação original. O mecanismo de busca nunca deve ser apresentado como a
  fonte da informação.
- Registrar título, publicação, data, idioma, tipo e um resumo editorial curto.
- Identificar diferenças de convenção — especialmente a posição do Dia
  Bissexto — e avisar quando um site mistura ferramenta, comércio, opinião ou
  alegações científicas não verificadas.
- Tratar a inclusão como referência, não como endosso.
- Revisar periodicamente links quebrados e novas publicações, preservando uma
  data visível da última curadoria.

A seleção inicial inclui Washington Post, Bloomberg CityLab, BBC Worklife,
TIME, PetaPixel e Calculatorian entre as publicações; e 13months.net,
13cal.net, fixedcalendar.org, Wikipedia e Arion’s Calendar Reform Tools entre
os projetos e referências.

## 4. O que não será copiado

- Anúncios, captura obrigatória de e-mail ou produtos pagos neste momento.
- Afiliados sem relação direta com o calendário.
- Promessas de saúde, “detox lunar”, sincronização hormonal universal ou
  tratamento de parasitas.
- Conteúdo astral apresentado como fato científico.
- Linguagem conspiratória, “data verdadeira” ou explicações sem responsável e
  sem fonte.
- Textos enormes e repetidos na página inicial.
- Fórmulas duplicadas em cada tela.

## 5. Lua: análise científica e regra editorial

### 5.1 Por que a intuição dos 28 dias não se confirma

A semelhança entre quatro semanas e um ciclo lunar é intuitiva, mas compara
medidas diferentes:

| Medida                                       | Duração média |
| -------------------------------------------- | ------------: |
| Mês fixo do IFC                              |       28 dias |
| Órbita sideral da Lua em torno da Terra      |   27,322 dias |
| Lunação sinódica, de uma Lua Nova à seguinte |  29,5306 dias |
| Intervalo médio entre fases principais       |   7,3826 dias |

As fases dependem da geometria Sol–Terra–Lua. Durante uma órbita da Lua, a
Terra também avança ao redor do Sol; por isso a Lua precisa percorrer um pouco
mais para repetir o mesmo alinhamento. É a lunação sinódica, e não a órbita
sideral, que governa as fases.

Um mês fixo fica cerca de **1,5306 dia aquém** de uma lunação. Se uma Lua Nova
coincidisse com o primeiro dia do primeiro mês, a diferença acumulada chegaria
a aproximadamente 19,37 dias no décimo terceiro mês. Além disso, uma lunação
real varia aproximadamente entre 29,26 e 29,80 dias por causa da órbita
elíptica e de perturbações gravitacionais.

O ano tropical contém, em média, `365,2422 ÷ 29,5306 = 12,368` lunações. Treze
lunações completas exigem cerca de 383,9 dias. Portanto, um ano que contém 13
Luas Cheias não contém necessariamente 13 ciclos lunares completos.

### 5.2 O que os próprios calendários de 13 meses demonstram

O 13cal.net reconhece em sua página técnica que o calendário é solar, não
lunar, e que 28 foi escolhido por ser divisível em quatro semanas. A Lua é uma
camada de informação que atravessa os meses fixos.

Em 2026 há 13 Luas Cheias e, por coincidência, uma cai em cada mês regular da
convenção usada pelo 13 Calendar. Elas aparecem nos dias IFC 3, 4, 6, 7, 9,
11, 12, 14, 16, 17, 19, 20 e 21 — uma demonstração visual do deslocamento. Em
2028 também há 13 Luas Cheias, mas uma cai em um Dia Especial segundo a nossa
convenção. O calendário deve mostrar essa realidade, não forçar alinhamentos.

### 5.3 Avaliação do discurso agressivo encontrado

O conteúdo “Lunar Reset” observado no concorrente mistura uma curiosidade
astronômica válida com afirmações não demonstradas: metabolismo humano
universal de 28 dias, controle lunar de melatonina, serotonina e cortisol,
sincronização menstrual generalizada, marés controlando linfa e células,
jejum por fase e protocolos para parasitas com ervas ou argila bentonita.

A evidência disponível não sustenta esse conjunto:

- estudos pequenos encontraram associações com sono, mas análises populacionais
  maiores não reproduziram um efeito lunar consistente;
- ciclos menstruais variam amplamente; grandes bases não mostram uma regra
  universal de 28 dias nem sincronização estável com a Lua;
- a existência de marés oceânicas não demonstra um efeito biologicamente
  relevante em fluidos humanos;
- não há ensaios clínicos que validem “desintoxicação lunar” ou tratamento de
  parasitas por fase; produtos de argila podem inclusive envolver risco de
  contaminação por chumbo.

O padrão de comunicação observado usa exclusividade, certeza, um problema
oculto, falsa precisão, apelo à natureza, relatos tratados como mecanismo e
efeitos adversos reinterpretados como prova de “limpeza”. O funil começa em
astronomia, passa para “ritmos naturais”, diagnostica um problema pessoal e
leva a guia por e-mail ou produto afiliado. Esse modelo não será adotado.

### 5.4 Regra canônica do 13 Calendar

> O calendário de 13 meses organiza o ano solar em blocos iguais de 28 dias. A
> Lua mantém seu próprio ciclo médio de 29,53 dias; por isso suas fases
> atravessam progressivamente os meses fixos. O calendário não tenta controlar
> esse ritmo — apenas mostra onde cada evento astronômico realmente acontece.

O aplicativo usa Astronomy Engine para calcular os instantes das quatro fases
principais, preserva o instante UTC e o converte para a data e o horário locais
do usuário. A Lua é uma camada astronômica independente da regra civil dos
meses.

Conteúdo futuro poderá explicar órbita sideral e ciclo sinódico, deslocamento
mensal, anos com 13 Luas Cheias, iluminação, distância, perigeu, apogeu e fuso
horário. Tradições culturais podem aparecer em seção identificada, separadas de
ciência e sem promessas biológicas.

## 6. Migração da página incorporada

| Conteúdo antigo              | Destino nativo                          | Regra                                                         |
| ---------------------------- | --------------------------------------- | ------------------------------------------------------------- |
| Cabeçalho próprio            | `MainLayout`                            | Uma barra superior para todo o produto                        |
| Data de hoje                 | Página educativa                        | Usa o núcleo compartilhado do IFC                             |
| Explicação 13 × 28           | Página educativa                        | Texto reescrito e localizado                                  |
| Modelo mensal e ano completo | Página educativa                        | Componentes responsivos Quasar                                |
| Conversor                    | Ferramenta principal + resumo educativo | Nunca duplicar fórmulas                                       |
| História e FAQ               | Página educativa                        | Fontes e linguagem sem exagero                                |
| Objeção do Sabbath           | Página educativa                        | Contexto histórico e alternativas, não uma “solução” absoluta |
| Votação                      | Componente Vue/Quasar                   | Mantém a mesma API e os votos no D1                           |
| Lua                          | Página educativa + calendários          | Política científica desta documentação                        |
| Rodapé                       | `AppFooter`                             | Links, privacidade e fontes comuns                            |

Na transição concluída nesta branch:

1. todos os novos links internos apontam para a área educativa nativa;
2. a cópia antiga saiu do pacote público e de novas divulgações;
3. links antigos recebem redirecionamento para a rota nativa;
4. o código antigo não recebe novas funcionalidades;
5. a exclusão do código-fonte arquivado em `vendor` depende do encerramento da
   pendência de autorização; ele não participa do build nem do `verify` normal.

## 6.1. Ferramentas entregues nesta branch

- cartão de data com link, compartilhamento nativo, WhatsApp, Facebook, X e PNG;
- conversor e cartão de aniversário com link reproduzível;
- planejador anual comparativo, exportação ICS e impressão/salvamento em PDF;
- equinócios, solstícios, periélio, afélio, nascer e pôr do Sol opcionais;
- favoritos armazenados somente no navegador;
- widget IFC incorporável, sem beacon próprio e fora do índice de busca;
- acesso offline instalável às páginas já abertas;
- cartões editoriais científicos e históricos para download;
- resultado da votação compartilhável, preservando a mesma API e o mesmo D1.

Todas as ferramentas usam o motor compartilhado do calendário. A localização é
solicitada somente ao tocar no comando de nascer/pôr do Sol, é processada no
navegador e não é armazenada no site.

## 7. Ordem de implementação

1. [x] Barra superior universal e responsividade.
2. [x] Área educacional nativa e retirada da página incorporada da navegação.
3. [x] Rotina única de auditoria e publicação.
4. [x] Endereços públicos reais, `sitemap` e SEO estruturado.
5. [x] Cartão compartilhável de hoje.
6. [x] Página e cartão de aniversário.
7. [x] `widget` incorporável.
8. [x] Visão anual e PDF.
9. [x] Camadas astronômicas adicionais.
10. [x] Expansão da comunidade por compartilhamento da votação e atalhos nativos.

## 8. Critérios de aceite desta migração

- Conteúdo essencial disponível nos 12 idiomas, com fallback controlado e
  auditoria de chaves.
- Nenhuma conversão implementada novamente dentro da página educativa.
- Lua exibida como ciclo de 29,53 dias, independente dos meses de 28 dias.
- Votação continuando no mesmo D1 e preservando votos anteriores.
- Barra superior, tema, menu de idioma e rodapé comuns; `AppFooter` é a única
  composição pública e todo botão textual usa uma das três famílias visuais.
- Navegação principal sem depender de `/reference-site/`.
- Layout utilizável em 320 px sem rolagem horizontal.
- Foco visível, ordem de títulos coerente e controles com nomes acessíveis.
- `lint`, build e auditorias do projeto aprovados antes de publicar.

## 9. Fontes principais

### Astronomia e calendários

- [NASA — Moon Phases](https://science.nasa.gov/moon/moon-phases/)
- [NASA — Tides](https://science.nasa.gov/moon/tides/)
- [NASA/GSFC — Phases of the Moon](https://eclipse.gsfc.nasa.gov/phase/phase2001gmt.html)
- [NASA/GSFC — Sky Events Calendar](https://eclipse.gsfc.nasa.gov/SKYCAL/SKYCAL.html?cal=2026)
- [13cal.net — Is the 13-month calendar lunar?](https://13cal.net/is-13-month-calendar-lunar)
- [13cal.net — Lunar calendar](https://13cal.net/lunar)

### Saúde e avaliação das alegações lunares

- [Cajochen et al. — Evidence that the lunar cycle influences human sleep](https://pubmed.ncbi.nlm.nih.gov/23891110/)
- [Cordì et al. — Lunar cycle effects on sleep and the file drawer problem](https://pubmed.ncbi.nlm.nih.gov/26498230/)
- [Large-scale menstrual-cycle analysis](https://pubmed.ncbi.nlm.nih.gov/33779457/)
- [Menstrual-cycle variation study](https://pubmed.ncbi.nlm.nih.gov/31482137/)
- [Menstrual cycles and lunar phases](https://pubmed.ncbi.nlm.nih.gov/32442161/)
- [Lunar synchrony study](https://pubmed.ncbi.nlm.nih.gov/23889481/)
- [PMC — Women temporarily synchronize their menstrual cycles with luminance and gravimetric cycles of the Moon](https://pmc.ncbi.nlm.nih.gov/articles/PMC7840133/)
- [NCCIH — Detoxes and cleanses](https://www.nccih.nih.gov/health/detoxes-cleanses)

### Conteúdo analisado, não adotado como fonte científica

- [13cal.net — Lunar Reset](https://13cal.net/lunar-reset)
- [13cal.net — Astral projection](https://13cal.net/how-to-astral-project)
