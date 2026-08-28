# Changelog

Todas as alterações importantes deste projeto serão registradas neste arquivo.
O formato segue a ideia de [Keep a Changelog](https://keepachangelog.com/) e o
versionamento segue [Semantic Versioning](https://semver.org/).

## [2.0.0] - 2026-08-28

### Adicionado

- Áreas independentes Aprenda, Ferramentas, Lua e Notícias, construídas em Vue e
  Quasar e integradas à navegação principal.
- Ferramentas de compartilhamento, aniversário, planejamento anual, astronomia,
  favoritos locais, widget, PWA e cartões editoriais.
- Seletor compartilhado de datas com digitação e grades de dia, mês e ano, além
  do seletor visual compartilhado para campos isolados de ano.
- Seletor IFC regular em um único campo, com janela de 13 meses e 28 dias,
  bloqueio do Dia Bissexto em anos comuns e altura estável nos dias especiais.
- Tooltips de equivalência nos cards gregorianos e IFC de feriados e fases da
  Lua, sempre apontando para o calendário oposto; o rótulo curto do lado fixo é
  `IFC`.
- Seletor móvel entre Gregoriano e 13 meses no breakpoint em que as colunas
  deixariam de caber lado a lado.
- Documentação histórica da versão 1.0 e documento detalhado da versão 2.0.
- Seção central de fontes de dados da versão 2.0 para feriados, NASA, Lua, Sol,
  astronomia, calendários e referências editoriais.
- Linha do tempo histórica nativa, seis perguntas frequentes, destaque dos 61
  anos da Kodak e seção completa sobre o Sabá, com alternativas, consequências
  e fontes históricas.
- Relatos opcionais sobre a implantação do calendário, publicados anonimamente
  ou associados a um card comunitário aprovado mediante seu código privado.
- Indicadores públicos de participação e relato nos cards da Comunidade, com
  leitura em diálogo, além de uma lista separada de respostas anônimas.
- Migração D1 `0007` para respostas da votação e aplicação automática das
  migrações antes da publicação do Worker.

### Alterado

- A raiz do site abre a página Calendários, a primeira desenvolvida no projeto,
  sem alterar a ordem Aprenda, Ferramentas, Calendários, Lua, Notícias e
  Comunidade da barra superior.
- A página inicial declara `13 Calendar` como nome do site em dados estruturados
  `WebSite`, com alternativas próprias para o Google não depender do nome do
  provedor de hospedagem.
- O produto passa a se apresentar como projeto independente, não como extensão
  arquitetural do 13months.net.
- Navegação, heróis, avisos, botões, paleta, avatares e rodapé passam a usar
  componentes e regras visuais compartilhados.
- Os dois calendários passam a oferecer o botão Hoje.
- Comparações de datas mostram nomes completos dos dias, ano dos dois lados e
  alinhamento estável em widgets, prévias e imagens.
- Comparações gregorianas e IFC usam a mesma ordem mês/dia do idioma, o mesmo
  separador `·` e duas linhas fixas: `dia da semana ·` acima e dia/mês abaixo.
  Traduções longas reduzem os dois lados juntos conforme o maior texto do par;
  palavras nunca são partidas e o herói inteiro se rearranja antes de qualquer
  transbordamento.
- O widget centraliza rótulos, datas, anos e crédito dentro das duas colunas.
- Campos de data, texto e ação dos favoritos passam a ocupar a mesma linha e
  altura, sem o espaço inferior invisível do seletor compartilhado.
- Na menor tela, cada calendário permanece agrupado com seus cards de feriados
  e fases da Lua em vez de empilhar simultaneamente as duas experiências.
- O seletor da menor tela explica, nos 12 idiomas, que a orientação horizontal
  ou uma tela maior permite comparar os calendários lado a lado.
- O aniversário pede primeiro o ano da comemoração e abre a escolha de dia e
  mês referenciada àquele ano. Assim, os dias da semana gregorianos ficam
  corretos sem repetir a seleção do ano.
- Mensagens de gerenciamento e validação passam a permanecer junto da ação que
  as originou e a usar causas mais específicas quando disponíveis.
- Conteúdo lunar diferencia explicitamente o mês civil fixo do ciclo sinódico.
- O topo de Aprenda passa a usar o comparativo visual completo entre os dois
  calendários, com gradientes, `vs.`, relógio externo, dias reais do mês civil e
  28 dias no mês fixo; suas setas permanecem ao lado do texto dos botões.
- A estrutura de Aprenda passa a ter cinco cards, mês modelo com título externo
  e domingo rosado. A visão anual reúne 13 meses e Dias especiais numa grade de
  duas fileiras de sete no desktop e duas colunas no celular, com o resumo ao
  lado de dezembro, alturas uniformes e soma `364 + 1`, acrescida de outro
  `+ 1` somente em ano bissexto.
- A navegação anual mantém o ano centralizado e reserva a posição de Hoje para
  não deslocar controles ao trocar de ano. Os seis cards de perguntas usam o
  mesmo hover, inclusive quando não possuem link.
- O título da linha do tempo histórica passa a usar o mesmo peso forte dos
  demais títulos. A seção lunar e a Metodologia passam a ocupar a rota própria
  `/moon`, ligada na barra superior depois de Calendários, com crescente roxo no
  cabeçalho e a mesma composição inferior de contexto dos calendários.
  Os três cards de Metodologia recebem textos próprios sobre o papel de cada
  fonte, sem repetir literalmente os avisos lunares anteriores.
- A grade anual passa a ocupar até 1700 px, usa cabeçalhos de 6 px e antecipa
  as quebras para quatro colunas em 1579 px e duas em 860 px, impedindo a
  sobreposição das abreviações. O dia atual recebe roxo escuro translúcido ou
  rosa escuro translúcido no domingo; Solaris preserva a cor normal dos dias
  úteis.
- A resolução de implantação torna-se uma seção própria imediatamente depois
  do Sabá e antes da votação; em tela larga, seus quatro cards possuem juntos a
  mesma altura do formulário. A votação permanece separada, troca emojis por
  expressões Material nas quatro cores da paleta e ganha a assinatura
  `13 ● MONTHS ● CALENDAR`. Voto e relato perguntam separadamente se serão
  anônimos ou ligados à Comunidade, sem criar conta nem revelar a escolha.
- O título do Sabá recebe o mesmo peso dos demais; os avisos lunares passam a
  usar os painéis compartilhados roxo e âmbar.
- Na Comunidade, `Faça parte` passa para logo depois do aviso verde, antes da
  vitrine de participantes.
- O orçamento compactado total passa a 715.000 bytes para acomodar os novos
  catálogos dos 12 idiomas, mantendo cerca de 20 mil bytes de margem e sem
  alterar os limites bruto ou por arquivo.
- Aprenda, Ferramentas, Lua e Notícias passam a ter catálogos completos nos 12
  idiomas, com auditoria que bloqueia fallback editorial em inglês.
- Resumos dos 11 links curados em Notícias e seus rótulos de idioma foram
  localizados nos 12 idiomas; os títulos originais das publicações são
  preservados como identificação da fonte.
- O rodapé separa os destinos: Fontes de dados abre a documentação da versão
  2.0 e Código-fonte abre a raiz do repositório.
- Em Astronomia, os cards do ano solar e de nascer/pôr do Sol passam a ter a
  mesma altura lado a lado; o primeiro distribui cabeçalho e seis eventos em
  sete faixas iguais. Empilhados, ambos mantêm altura natural.
- A licença MIT passa a declarar explicitamente todo o site e aplicativo
  autoral, incluindo interface, conteúdo editorial e documentação.

### Removido

- Uso de seletores nativos `type="date"` nas ferramentas.
- Dependência de navegação da página educacional incorporada na arquitetura da
  nova experiência.
- Instalação, build, auditoria e monitoramento da antiga página adaptada; o
  arquivo de proveniência permanece privado e excluído da sincronização pública.

Detalhes: [`docs/releases/README_2.0.md`](docs/releases/README_2.0.md).

## [1.0.0] - 2026-08-24

### Adicionado

- Conversão bidirecional entre o calendário gregoriano e o Calendário Fixo
  Internacional, incluindo Solaris, Dia do Ano e Dia Bissexto.
- Feriados, datas comemorativas e eventos astronômicos para 251 países e
  territórios, com modos adaptado e correspondente no calendário de 13 meses.
- Fases da Lua, horários opcionais, marcadores calendáricos e estações.
- Interface responsiva em 12 idiomas, com temas claro e escuro compartilhados.
- Página educacional adaptada que funciona como entrada da experiência.
- Retrato comunitário agregado, cadastro voluntário moderado, Turnstile, D1 e
  alertas de novas pendências pelo Telegram.
- Exclusão autônoma por link privado, importação automática de fotos públicas
  de Instagram e Facebook e gerenciamento administrativo dos perfis.
- Carregamento sob demanda do calendário civil e das traduções do país
  selecionado, com auditoria de cobertura dos 206 calendários disponíveis.
- Aviso de privacidade, política de segurança, licença do código original e
  delimitação explícita do material adaptado de terceiro.
- Publicação canônica no Cloudflare Pages, sitemap, metadados de busca e
  verificação contínua pelo GitHub Actions.
