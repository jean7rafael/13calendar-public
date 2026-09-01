# Sistema dos cards educacionais

Este contrato separa dois elementos que têm funções e geometrias diferentes:
cards coloridos de conteúdo e avisos editoriais no fim de uma seção. A divisão
evita que um ajuste responsivo feito para um grupo altere silenciosamente o
outro.

## 1. Cards coloridos de conteúdo

Conteúdo explicativo repetido usa `EducationContentCard`. O componente oferece
os tons oficiais `purple`, `green`, `pink` e `amber` e três composições:

- `compact`: ícone e texto curto;
- `stacked`: ícone, título, explicação e possível destaque final;
- `inline`: ícone lateral, título e explicação.

A altura real sempre é calculada pelo conteúdo. Não se usa `height`,
`max-height`, linhas `minmax(0, 1fr)` nem recorte interno para forçar igualdade.
Quando um alinhamento visual precisa de um piso, o contêiner define somente
`--content-card-min-height`; em telas empilhadas o valor volta a zero.

Grades que reúnem esses cards usam `education-content-card-grid`, cujas linhas
nunca ficam menores que `max-content`. O componente consulta sua própria
largura, e não somente a largura da janela, para reorganizar a variante
`inline`. Isso cobre navegador, janela redimensionada e PWA instalada mesmo
quando o WebKit informa um viewport diferente da largura visual disponível.

## 2. Avisos de encerramento

Ressalvas e conclusões no fim de uma seção usam `EducationClosingNotice`. O
aviso é uma faixa editorial compacta, com ícone, título opcional e texto. Ele
tem altura natural, mas não herda mínimo, variante, padding ou consulta de
contêiner de `EducationContentCard`.

O componente de aviso preserva os mesmos quatro tons por coerência cromática,
sem transformar a faixa em um card de conteúdo. Uma seção não deve aplicar a
classe `education-content-card-grid` ao aviso nem envolvê-lo em seletores de
geometria dos cards.

## 3. Manutenção

As regras estruturais permanecem comentadas em português. Novas seções devem
reutilizar um dos dois componentes conforme a função do texto, em vez de copiar
CSS local. `npm run ui:audit` verifica altura natural, medição pela largura do
card, linhas `max-content`, paleta, separação dos componentes e uso nas seções
educacionais migradas.
