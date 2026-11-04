# Correção local de deepmerge

Esta é uma cópia mínima da API CommonJS de `deepmerge` 4.3.1, licenciada sob
MIT, com versão local 4.3.2 para satisfazer a dependência do
`date-holidays-parser`. Ela filtra `__proto__`, `constructor` e `prototype` nos
objetos de origem e destino e define propriedades sem acionar setters herdados.
Isso corrige o envenenamento do protótipo do objeto retornado descrito em
`GHSA-gcqx-w48m-w2h4`, para o qual ainda não existe versão oficial corrigida.

A API normal (mesclagem de objetos, arrays, símbolos, `deepmerge.all` e opções)
é mantida. `npm run security:merge:audit` cobre a regressão de segurança e a
compatibilidade básica; as auditorias de feriados conferem os resultados reais.
Quando houver uma versão oficial corrigida, substituir esta cópia somente após
repetir essas verificações e confirmar que os resultados dos feriados não mudam.
