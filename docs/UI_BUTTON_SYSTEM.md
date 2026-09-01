# Sistema universal de botões

Este contrato evita que cada página resolva largura, altura e traduções de uma
forma diferente. A fonte de estilo é `src/css/app.scss`; componentes podem
escolher a família e os limites responsivos, mas não recriar a geometria.

## 1. Botão textual

Todo `q-btn` com texto usa `app-action` e exatamente uma família:

- `app-action--primary`: ação principal;
- `app-action--secondary`: alternativa neutra preenchida;
- `app-action--tertiary`: ação complementar contornada.

O botão tem mínimo acessível de 44 px, altura automática e ícone inseparável da
área de conteúdo. Texto e ícone mantêm uma distância universal de 12 px, sem
depender das margens internas do componente visual. O rótulo permanece em uma linha enquanto houver espaço para
ampliar o botão ou reorganizar o grupo. Somente em telas estreitas, quando nem
um botão isolado comporta a tradução, a quebra é liberada e a tradução passa a
determinar a altura real. Não se usa `height`, `block-size` nem observador
JavaScript para ajustar o texto.

## 2. Ações vizinhas

Dois ou mais botões textuais da mesma decisão ficam em `app-action-group`.
O maior rótulo traduzido é medido uma vez pelo inicializador compartilhado e
define a largura de todos os botões do grupo. O layout flexível centraliza as
ações e coloca uma delas na linha seguinte antes de reduzir essa largura. A
medição roda na primeira pintura, depois do carregamento das fontes e após uma
troca de idioma; não depende de hover nem de correções específicas por língua.
O cálculo soma somente as larguras intrínsecas de texto, ícone e distância —
nunca o espaço vazio do botão já ampliado — e reserva 8 px para arredondamento
subpixel, zoom e variações da fonte carregada.
Somente abaixo do limite móvel compartilhado o grupo ocupa toda a largura e
admite uma tradução em mais de uma linha.

Os componentes podem ajustar somente:

- `--app-action-group-max`: largura máxima do conjunto;
- `--app-action-min-width`: largura mínima de cada coluna;
- `--app-action-min-height`: mínimo maior quando o botão precisa acompanhar um
  campo de formulário.

## 3. Controles funcionais

Botões somente com ícone, dias de calendário, grades de ano e seletores
segmentados não são ações textuais e podem ter geometria própria. Qualquer
regra local de altura para `q-btn` deve usar `:not(.app-action)`, tornando a
exceção explícita e incapaz de atingir os botões textuais.

## 4. Traduções e manutenção

Não existem listas de tamanhos por idioma. Português, inglês, alemão, francês,
italiano, espanhol, russo, árabe, hindi, chinês, japonês e coreano passam pelo
mesmo cálculo intrínseco do navegador. Um texto maior aumenta a linha inteira;
um texto menor não cria um botão isolado mais baixo.

`src/boot/buttonLayout.js` é a única medição do sistema; componentes não criam
observadores próprios. Os comentários estruturais permanecem em português e explicam intenção,
limites e exceções. Linhas triviais não recebem comentários redundantes.
`npm run ui:audit` verifica famílias, contrato compartilhado e proíbe alturas
locais que possam voltar a vencer a solução universal.
