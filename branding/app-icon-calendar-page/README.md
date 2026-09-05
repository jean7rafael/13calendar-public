# Ícone “folha 13”

Este pacote transforma a direção visual aprovada em dois conjuntos distintos:

- arquivos realmente consumidos pelo site instalado no Safari e por outras PWAs;
- fontes vetoriais preparadas para montagem futura no Apple Icon Composer.

O desenho mantém a proposta original: fundo violeta como a própria folha, duas
presilhas superiores, linha de separação, número `13` dominante e uma pequena
dobra no canto inferior direito. Não há máscara de cantos, sombra, brilho ou
efeito de vidro gravado na arte.

## Aparências Apple

`sources/` contém versões achatadas para revisar as seis aparências atuais:

1. `default`;
2. `dark`;
3. `clear-light`;
4. `clear-dark`;
5. `tinted-light`;
6. `tinted-dark`.

Em um aplicativo nativo, as quatro últimas não são seis imagens independentes
entregues ao sistema. O Icon Composer trabalha com uma estrutura de camadas e
anotações Default, Dark e Mono; iOS, iPadOS e macOS produzem as apresentações
Clear e Tinted, claras ou escuras. Por isso, os PNGs dessa pasta são provas
visuais, não substitutos de um arquivo `.icon` compilado.

## Camadas para o Icon Composer

Importe os SVGs de `icon-composer-layers/` nesta ordem:

1. fundo;
2. presilhas e linha;
3. número 13;
4. dobra da página.

Use os fundos Default, Dark e Mono conforme a anotação selecionada. Os efeitos
de refração, translucidez, brilho especular e sombra devem ser configurados no
Icon Composer; eles não foram gravados nos SVGs. Isso preserva a adaptação do
Liquid Glass entre tamanhos, sistemas e dispositivos.

## Arquivos para o site

`web-ready/` contém:

- Apple Touch Icons de 120, 152, 167 e 180 px;
- ícones PWA `any` de 192, 512 e 1024 px;
- ícones PWA `maskable` de 192, 512 e 1024 px;
- favicon SVG e PNGs de 16, 32, 96 e 128 px;
- favicon escuro de 32 px;
- fonte monocromática SVG.

O Safari não aceita um arquivo do Icon Composer para um site. No iPhone e no
iPad, `apple-touch-icon` continua tendo precedência quando está declarado. No
Mac, o manifesto pode usar o ícone `maskable` opaco de 1024 px. As aparências
Liquid Glass, Clear e Tinted são então tratadas pelo sistema a partir desses
arquivos achatados; a página não consegue fornecer as seis variantes nativas.

## Referências verificadas em setembro de 2026

- [Apple Human Interface Guidelines — App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons/)
- [Apple — Creating your app icon using Icon Composer](https://developer.apple.com/documentation/Xcode/creating-your-app-icon-using-icon-composer)
- [Apple — Adopting Liquid Glass](https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass)
- [WebKit — ícones de web apps no Mac](https://webkit.org/blog/14787/webkit-features-in-safari-17-2/)
- [WebKit — precedência de `apple-touch-icon` no iPhone e iPad](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)

## Regeneração

Execute no macOS:

```sh
node scripts/generateAppIconAssets.mjs
```

O gerador é determinístico, mantém os SVGs como fonte e reinstala o conjunto
web na pasta `public/icons/`.
