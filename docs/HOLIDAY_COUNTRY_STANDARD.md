# Padrão obrigatório para feriados por país

Este documento deve ser lido antes de acrescentar um país, uma regra, um
mecanismo de data ou uma correção histórica. Ele é a referência única para
manter todos os países no mesmo padrão.

## 1. Princípio de funcionamento

- A base deve guardar as regras completas, sem limitar os dados a uma faixa
  fixa como 1900–2100.
- O aplicativo calcula ocorrências somente sob demanda: ano selecionado, dois
  anos anteriores e dois posteriores.
- Ao mudar o ano, a janela de cinco anos acompanha a seleção. Portanto, não
  existe um ano mínimo ou máximo artificial.
- Traduções são descobertas diretamente nas regras. Nunca se deve percorrer
  centenas de anos apenas para descobrir nomes.

## 2. Fontes e procedência

Use esta ordem de preferência:

1. lei, decreto, diário oficial ou calendário do governo;
2. órgão público, embaixada ou representação oficial;
3. organismo internacional ou fonte institucional reconhecida;
4. base `date-holidays`, preservando as referências declaradas no arquivo do
   país;
5. fonte editorial secundária, somente quando nenhuma das anteriores existir.

Toda regra local nova deve ter uma fonte. Referências encontradas nos arquivos
de `date-holidays` são copiadas automaticamente para
`src/holidays/generated/holidayCountries.json`.

### Apêndice oficial dos casos sem calendário civil

- Os 45 países e territórios sem calendário civil na base principal permanecem
  cadastrados em `src/holidays/generated/officialHolidayAppendix.json`.
- Cada caso aplicável deve registrar a melhor fonte governamental localizada e
  um estado de revisão. Casos sem população ou calendário público próprio usam
  explicitamente `not-applicable`; ausência de uma fonte utilizável usa
  `official-source-pending`.
- Datas publicadas no aplicativo exigem fonte e revisão humana. A varredura
  automática cria somente candidatos em `holiday-source-review/generated`.
- A automação consulta sempre os 45 casos em 20 de dezembro e 5 de janeiro. Os
  206 calendários da base também são consultados quando a versão estiver há 120
  dias sem atualização ou quando a varredura completa for solicitada.
- Falha temporária, bloqueio HTTP ou documento que exija leitura manual nunca
  autorizam a criação automática de uma data.
- Os nomes publicados pelo apêndice participam do catálogo central com ids
  `official.<id>`. Nunca os duplique nos arquivos gerais da interface.

### Aviso de cobertura oficial na interface

- O aviso no encarte gregoriano se refere exclusivamente aos feriados oficiais
  publicados pelo governo. Ele nunca significa que o mês está vazio.
- Eventos astronômicos, datas religiosas calculáveis e datas comemorativas ou
  comerciais continuam disponíveis mesmo quando falta um calendário oficial.
- Não mostre o aviso quando o apêndice possuir ocorrências oficiais para o ano
  selecionado. Nos outros anos, informe os anos oficiais disponíveis.
- O aviso cobre integralmente o corpo do encarte para impedir que linhas em
  movimento sejam vistas por trás, pode ser fechado e desaparece sozinho após
  dez segundos.
- A matriz temporal vigente está documentada em
  `docs/OFFICIAL_HOLIDAY_COVERAGE.md`.

## 3. Passado, presente e futuro

### Anos anteriores

- Respeite cronologias históricas conhecidas, incluindo início, fim, troca de
  nome e alteração de data.
- Quando uma fonte oficial termina em determinado ano e não existe evidência
  de mudança, replique para trás a regra recorrente mais antiga disponível.
- Não replique uma regra para antes de sua criação quando a data legal de
  início for conhecida.
- Uma extrapolação histórica deve ser documentada na extensão do país.

### Anos futuros

- Uma regra recorrente atual continua ativa até existir fonte que a revogue ou
  substitua.
- Leis futuras já publicadas devem usar limites de validade explícitos.
- Calendários publicados anualmente podem usar datas específicas por ano, mas
  o mecanismo recorrente deve continuar separado quando existir.
- Uma atualização futura da dependência pode adicionar países e regras; a
  geração deve importar a lista integral automaticamente.

## 4. Novas leis, exceções e mecanismos

Use `src/holidays/holidayCountryExtensions.js` quando a fonte internacional
ainda não representar corretamente uma situação. Uma extensão pode:

- excluir uma regra em um intervalo de anos;
- criar ocorrências com um cálculo específico;
- informar os nomes-fonte das novas regras para o tradutor;
- registrar a fonte da correção.

Prefira uma extensão pequena e rastreável. Quando a correção entrar em
`date-holidays`, remova a duplicação local depois de comparar os resultados.

### Regras vinculadas a dias da semana

- O encarte gregoriano sempre usa a data civil oficial calculada pela fonte.
- No modo **Datas correspondentes**, converta esse mesmo dia físico.
- No modo **Datas adaptadas**, reaplique a regra no calendário de 13 meses.
  Exemplo: a primeira segunda-feira de agosto torna-se o dia 2 do mês chamado
  agosto no calendário 13.
- Os mecanismos locais aceitam qualquer dia da semana e:
  - primeira, segunda, terceira, quarta ou quinta ocorrência no mês;
  - última ocorrência no mês;
  - dia da semana na data ou antes/depois dela;
  - dia da semana estritamente antes/depois de uma data;
  - deslocamento relativo a outra regra e alternativas condicionais.
- Regras internacionais mais extensas, inclusive substituições de fim de
  semana, são resolvidas integralmente por `date-holidays-parser`. Quando uma
  regra depende do contexto completo do país e não pode ser reaplicada com
  segurança, o aplicativo preserva a data civil final e registra essa decisão.
- Black Friday é a sexta-feira posterior à quarta quinta-feira de novembro
  (Dia de Ação de Graças nos Estados Unidos), não simplesmente a última
  sexta-feira de novembro.

### Datas fixas, Páscoa e outros calendários

- Datas fixas entre os dias 1 e 28 preservam mês e dia no modo adaptado.
- Como os meses regulares não possuem 29, 30 ou 31, essas datas preservam o
  mesmo instante físico.
- A Páscoa ocidental adaptada usa a lua cheia posterior ao equinócio de março
  e o domingo seguinte da semana do calendário 13. Todas as datas relativas à
  Páscoa usam essa mesma âncora.
- Feriados islâmicos, hebraicos, chineses, persas e de outros calendários de
  origem são calculados anualmente por `date-holidays-parser`. Como esses
  calendários não possuem meses homônimos no calendário 13, preserve a
  ocorrência física calculada, inclusive para a Páscoa ortodoxa.
- Nunca transforme uma data lunar ou lunissolar em data gregoriana fixa.
- Ao aparecer uma nova função de calendário na base, classifique-a em
  `calendar13HolidayRules.js` e acrescente-a à auditoria antes de publicar.

### Base geral e complementos editoriais

- O menu parte do catálogo geográfico completo, mesmo quando a fonte
  internacional ainda não possui um calendário civil para o país.
- Países atendidos pela `date-holidays` usam suas regras normalmente. Os
  demais permanecem selecionáveis com eventos astronômicos e podem receber
  fontes e extensões locais posteriormente.
- Nunca inicialize o provedor civil para um país marcado como não atendido.
- Os seis catálogos editoriais originais são complementos: preservam nomes,
  emojis, fontes e regras mais precisas que a base geral ainda não possua.
- Quando base geral e complemento representam o mesmo conceito, una as duas
  entradas. A ocorrência civil da base e a curadoria editorial devem resultar
  em uma única linha.

## 5. Datas substitutivas e duplicatas

- No calendário gregoriano, preserve a data civil original e acrescente a data
  observada quando a legislação ou o calendário oficial conceder a folga em
  outro dia. A ocorrência observada pode atravessar a divisa do ano.
- As duas linhas usam o mesmo nome curto. A data observada recebe o emoji
  `↪️` e explica sua função apenas no tooltip; não acrescente ao nome textos
  como “comemoração na segunda-feira”, “dia substituto” ou frases longas.
- No calendário 13, omita ocorrências marcadas como `observed` ou com tipo
  `substitute`: o dia da semana do calendário hipotético pode ser outro e essa
  folga isolada deixa de ter fundamento. Essa proteção vale globalmente para
  as fontes internacionais, oficiais e editoriais.
- Não confunda uma data observada com um período oficial de vários dias.
  Blocos como as férias russas de Ano-Novo permanecem nos dois calendários,
  pois cada data é uma ocorrência civil real do período.
- Duas ocorrências idênticas na mesma data devem virar uma linha.
- Um evento realmente celebrado durante vários dias pode manter várias
  linhas, desde que cada dia seja parte oficial do período e não uma cópia
  acidental.

## 6. Nomes

- O nome deve ser curto, específico e compreensível fora do país de origem.
- Não aceite sozinho: “Feriado”, “Feriado público”, “Dia nacional”, “Dia
  adicional” ou equivalentes.
- Preserve nomes culturais quando forem essenciais e acrescente contexto curto
  ao texto-fonte do tradutor. Exemplo: `Matariki — Māori New Year`.
- Uma data equivalente não obriga todos os países a usarem o mesmo nome.
  Em 26 de dezembro, preserve conforme o país: `Boxing Day`, `Segundo dia de
Natal` ou `Dia de Santo Estêvão`. O emoji pode continuar compartilhado.
- O contexto usado para traduzir não deve virar uma explicação extensa no
  cartão.
- Datas excepcionais de um único ano precisam dizer o evento real, como
  eleição, memorial ou celebração, em vez de apenas “feriado especial”.

## 7. Traduções

- Textos da interface ficam em `src/i18n`.
- Nomes de feriados ficam nos catálogos editoriais ou no cache gerado em
  `src/holidays/generated/holidayTranslations.json`.
- Não copie todos os feriados para cada arquivo de idioma.
- O tradutor recebe um texto-fonte contextualizado e gera somente o que ainda
  estiver pendente.
- Sequências que repetem o mesmo conceito com uma data no nome devem usar
  `holidayTranslationFamilies.js`. A família fixa uma terminologia por idioma
  e usa `Intl.DateTimeFormat` para a parte variável, evitando que linhas da
  mesma sequência alternem sinônimos produzidos por traduções isoladas.
- Toda família deve contemplar todos os idiomas da interface. A auditoria
  `holidays:translation:audit` falha quando um idioma, identificador ou valor
  do cache deixa de seguir a terminologia canônica.
- `holidayTranslationOverrides.js` serve apenas para corrigir um resultado
  ruim do tradutor, nunca para duplicar catálogos inteiros.
- APIs pagas não devem ser usadas. Execute `npm run holidays:translate:check`
  e depois `npm run holidays:translate:export` para preparar os arquivos do
  Google Tradutor gratuito.
- Quando houver conexão, `npm run holidays:translate:google-free` traduz os
  blocos exportados sem chave de API e valida todos os identificadores antes
  da importação. Se o serviço gratuito estiver indisponível, os mesmos
  arquivos continuam podendo ser traduzidos manualmente no navegador.

## 8. Emojis

- Preserve os emojis dos seis catálogos editoriais originais quando o mesmo
  conceito aparecer em outro país. Exemplo: Dia das Mães mantém o coração já
  adotado no projeto.
- O mesmo conceito deve usar o mesmo emoji em todos os países. Paixão de
  Cristo/Sexta-feira Santa, segundo dia de Natal e Dia do Trabalho são
  equivalências globais, mesmo quando os nomes locais forem diferentes.
- Prefira um símbolo semântico para a data.
- O símbolo genérico por tipo é apenas o último recurso.
- Não atribua o mesmo emoji a quase todos os feriados de um país.
- Regras de texto devem procurar palavras ou expressões completas. Nunca use
  uma sequência curta que possa coincidir dentro de outra palavra, como
  `holi` dentro de `holiday`.
- Conceitos específicos vêm antes dos amplos. Por exemplo, funeral real vem
  antes de realeza e Festival Tuen Ng vem antes de festival genérico.
- O contexto acrescentado ao nome para melhorar a tradução não pode mudar o
  emoji do título principal.
- Todo caso de colisão corrigido deve entrar em
  `scripts/auditHolidayEmojis.mjs` como verificação permanente.

## 9. Categorias, regiões e hemisfério

- Use os tipos: oficial, substitutivo, facultativo, comemorativo, bancário,
  escolar, comercial ou astronômico.
- Todos os filtros permanecem ativados por padrão.
- Continente, região e hemisfério são gerados a partir de metadados
  geográficos; um país novo não deve ser cadastrado manualmente no menu.
- Os nomes dos países são localizados por `Intl.DisplayNames`. Quando os
  navegadores divergirem ou o rótulo precisar de curadoria, registre uma
  exceção pequena em `countryNameOverridesByLocale`, sem alterar o código do
  país ou seus dados geográficos.
- As exceções de nomes devem existir em todos os idiomas disponíveis. Os nomes
  das regiões usam estilo de título quando o sistema de escrita diferencia
  letras maiúsculas e minúsculas. Artigos, preposições e contrações permanecem
  minúsculos nas línguas latinas, como em `América do Sul`, `Europa del Este`,
  `Europe de l'Ouest` e `Tutte le Regioni`.
- O seletor segue obrigatoriamente esta ordem:
  1. América do Norte, América Central, Caribe e América do Sul;
  2. África do Norte, Ocidental, Central, Oriental e Austral;
  3. Europa Nórdica, Ocidental, Meridional e Leste Europeu;
  4. Oriente Médio, Ásia Central, Meridional, Oriental e Sudeste Asiático;
  5. Oceania;
  6. Antártida.
- Canadá, Estados Unidos e México aparecem primeiro na América do Norte.
- A Europa Ocidental reúne Reino Unido, Alemanha, França, Itália, Espanha,
  Portugal, Países Baixos, Suíça, Bélgica, Áustria, Irlanda, Luxemburgo,
  Mônaco, Liechtenstein, Malta, Vaticano, San Marino, Ilha de Man, Jersey e
  Guernsey, nesta ordem editorial de destaque.
- A Europa Nórdica contém Dinamarca, Finlândia, Islândia, Noruega e Suécia,
  além das Ilhas Faroé por integrarem o Reino da Dinamarca. A Groenlândia
  permanece na América do Norte. Países bálticos e os demais territórios
  classificados geograficamente como norte-europeus integram a Europa
  Leste Europeu no menu.
- No agrupamento editorial asiático, Turquia, Geórgia, Armênia e Azerbaijão
  integram a Ásia Central. Afeganistão e Irã integram o Oriente Médio.
- A Ásia Central mantém a ordem alfabética, exceto por Turquia no primeiro
  lugar e Geórgia imediatamente antes do Cazaquistão: Turquia, Armênia,
  Azerbaijão, Geórgia, Cazaquistão, Quirguistão, Tajiquistão, Turcomenistão e
  Uzbequistão.
- O Leste Europeu começa por Rússia, Ucrânia, Polônia, Romênia,
  Tchéquia, Hungria, Bielorrússia, Bulgária, Eslováquia, Lituânia, Letônia,
  Estônia e Moldávia. Territórios aparecem depois dos países soberanos.
- A Oceania começa por Austrália e Nova Zelândia; os demais permanecem em
  ordem alfabética.
- A Europa Central integra a Europa Oriental, exceto Áustria na Ocidental e
  Eslovênia na Meridional. A Europa Sudeste integra a Meridional, exceto
  Bulgária e Romênia na Oriental.
- O hemisfério controla os nomes das estações; ele não pode ser escolhido
  apenas pelo idioma do país.

## 10. Sequência obrigatória de validação

Depois de atualizar a dependência ou alterar regras:

```bash
npm run holidays:data
npm run holidays:audit -- --year 2026
npm run holidays:weekday:audit -- --year 2026
npm run holidays:calendar13:audit -- --year 2026
npm run holidays:merge:audit -- 2026
npm run holidays:emoji:audit
npm run holidays:translate:check
npm run holidays:translate:export
npm run holidays:translation:audit
npm run holidays:official:audit
# tradução gratuita automática ou preenchimento manual dos arquivos
npm run holidays:translate:google-free
# depois de devolver os arquivos traduzidos:
npm run holidays:translate:import
npm run lint
npm run build
```

Troque `2026` pelo ano usado como centro da auditoria. O comando sempre testa
esse ano e a janela de dois anos para cada lado.

## 11. Checklist antes de concluir um país

- [ ] Fontes registradas e validade temporal confirmada.
- [ ] Regras futuras continuam calculáveis sem ano máximo artificial.
- [ ] Passado usa a cronologia conhecida e a extrapolação foi documentada.
- [ ] A data civil e a data observada estão distintas, com seta e tooltip,
      sem explicação longa no nome.
- [ ] Regras semanais passaram nos modos adaptado e correspondente.
- [ ] Calendários religiosos/lunares foram classificados pela origem.
- [ ] A auditoria do calendário 13 terminou sem fallback desconhecido.
- [ ] Não existem nomes genéricos nem explicações excessivas.
- [ ] Traduções foram auditadas antes de chamar a API.
- [ ] Emojis respeitam os conceitos editoriais existentes.
- [ ] Região, continente e hemisfério estão corretos.
- [ ] Auditoria, lint e compilação terminaram sem erros.
