# Origem do site de referência

- Repositório: <https://github.com/Andree37/13-months>
- Branch copiada: `main`
- Commit copiado: `1bef9f6e979aeee1ece513f921e0c8c4c0e1d352`
- Data da incorporação: 2026-08-09

Esta pasta preserva o projeto Solid/Vite em separado do aplicativo Quasar.
A alteração local acrescenta, no início da página, um botão que abre o
conversor de datas, feriados e fases da Lua. A compilação é gravada em
`../../public/reference-site`, de onde o aplicativo principal a disponibiliza.
Também foram acrescentados um cabeçalho compatível com o aplicativo, um menu
lateral contendo somente os 12 idiomas disponíveis e um seletor de tema. O
idioma e o tema usam as mesmas chaves de armazenamento da página principal e,
por isso, permanecem sincronizados durante a navegação entre as duas páginas.

Os 172 textos visíveis e acessíveis da página possuem catálogos completos nos
12 idiomas. Textos estáticos são localizados pela ponte em `src/i18n.tsx`; datas,
controles e o compartilhamento usam a mesma tradução de forma reativa. O script
`scripts/generateSiteTranslations.mjs` mantém a extração e a atualização
incremental do catálogo sem recorrer a um serviço pago.

As dependências transitivas `seroval` e `seroval-plugins` possuem uma
substituição para a versão corrigida `1.6.2`, sem alteração do código visual.

O repositório original não continha um arquivo de licença no commit registrado
acima. A publicação experimental foi autorizada pelo mantenedor deste projeto
enquanto aguarda a resposta do autor em `Andree37/13-months#2`. Qualquer pedido
de licença, atribuição, alteração visual ou retirada deve ser aplicado e
registrado aqui.
