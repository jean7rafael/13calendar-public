# Estrutura adotada para o calendário de 13 meses

Este documento registra a ordem dos meses utilizada pelo aplicativo. Qualquer
alteração futura na conversão de datas, nos seletores ou nos feriados precisa
preservar esta estrutura, salvo nova decisão explícita sobre o calendário.

## Ordem dos meses

1. Janeiro
2. Fevereiro
3. Março
4. Abril
5. Maio
6. Junho
7. Solaris
8. Julho
9. Agosto
10. Setembro
11. Outubro
12. Novembro
13. Dezembro
14. Dias Especiais

Solaris fica entre junho e julho. Nos arquivos de idioma, essa ordem deve ser
montada tanto para os nomes completos quanto para as abreviações.

## Dias Especiais

O funcionamento existente foi mantido por decisão do projeto:

- anos comuns possuem o Dia do Ano em `14/01`;
- anos bissextos possuem o Dia do Ano em `14/01` e o Dia Bissexto
  imediatamente depois, em `14/02`;
- os Dias Especiais continuam no final da navegação anual;
- esta etapa não desloca um dos dias para o meio do ano.

A apresentação visível usa `XX/01` e `XX/02`. Diferentemente da descrição
do site de referência, o Dia Bissexto não é descrito como situado entre junho
e Solaris: ele sucede o Dia do Ano para permanecer coerente com a conversão e
com as fases da Lua já calculadas pelo aplicativo.

## Conversão e exibição

Os números internos de 1 a 13 representam os treze blocos regulares de 28
dias. A mudança de Solaris corrigiu o nome associado a cada bloco, sem alterar
as tabelas de correspondência ou a seleção sincronizada entre calendários.

Exemplo em 2026: 3 de agosto gregoriano continua correspondendo internamente a
`08/19`, mas o oitavo mês agora é exibido corretamente como julho.

## Dois modos para feriados

O encarte de feriados do calendário de 13 meses oferece duas leituras. A escolha
não altera o encarte gregoriano nem a conversão da data selecionada.

- **Datas adaptadas:** reaplica no calendário 13 a regra que dá significado ao
  feriado.
- **Datas correspondentes:** mostra o mesmo instante civil do calendário
  gregoriano convertido pelas tabelas de correspondência.

No modo adaptado, janeiro a junho conservam seus números e julho a dezembro
avançam uma posição por causa de Solaris. Datas fixas entre 1 e 28 conservam
nome do mês e número do dia. Os dias 29, 30 e 31 não existem nos meses
regulares; nesses casos, o aplicativo preserva o mesmo instante físico.

Regras como primeira segunda-feira, última sexta-feira, dia da semana antes ou
depois de uma âncora e deslocamentos relativos são recalculadas na semana do
calendário 13. Como cada mês regular começa no domingo, a primeira
segunda-feira é sempre o dia 2.

## Páscoa e calendários de origem

A Páscoa ocidental adaptada possui mecanismo próprio: o aplicativo encontra a
primeira lua cheia após o equinócio de março e escolhe o domingo seguinte na
semana do calendário 13. Sexta-feira Santa, Ascensão, Pentecostes e outras
regras relativas usam a mesma data-base adaptada.

Feriados islâmicos, hebraicos, chineses e de outros calendários religiosos,
lunares ou lunissolares seguem outro princípio. Eles não possuem um mês
homônimo no calendário 13. A base internacional calcula, a cada ano, a
ocorrência correta no calendário de origem; o aplicativo então posiciona esse
instante físico no calendário 13. Isso abrange atualmente:

- islâmico;
- hebraico;
- chinês, coreano e vietnamita;
- bengali revisado;
- persa/jalaali;
- juliano, inclusive a Páscoa ortodoxa.

Eventos puramente astronômicos também preservam o instante calculado. Essa
decisão é classificada pelo motor e auditada separadamente; não é um fallback
desconhecido.

## Limites de segurança

- Nenhuma regra adaptada atravessa o limite do ano, pois isso atribuiria
  indevidamente um dia da semana aos Dias Especiais.
- Pontes, dependências contextuais entre feriados e casos que exigem todo o
  calendário oficial do país preservam a ocorrência calculada pela fonte.
- Uma função nova da base internacional precisa ser classificada antes de ser
  aceita; a auditoria deve terminar com zero fallbacks desconhecidos.
