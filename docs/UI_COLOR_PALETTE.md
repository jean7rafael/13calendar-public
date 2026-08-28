# Paleta de cores da interface

Este documento é a referência visual para novas telas, componentes e estados do
13 Calendar. A fonte executável da paleta fica em `src/css/app.scss`; os nomes
abaixo devem ser usados no lugar de novos valores hexadecimais isolados.

## Princípios

- Roxo comunica identidade, navegação e ação principal.
- Verde comunica segurança, privacidade, confirmação e dados confiáveis.
- Amarelo-alaranjado comunica atenção, ressalva e os Dias Especiais, sobretudo
  o Dia Bissexto.
- Rosa é uma exceção calendárica restrita aos domingos nos exemplos didáticos;
  ele não cria uma quarta família de ação, aviso ou navegação.
- Cor nunca é o único sinal: avisos também recebem ícone, texto e, quando
  necessário, título.
- Fundo, borda e texto de uma mesma família devem ser usados em conjunto. Não
  combine, por exemplo, fundo verde com borda roxa.
- Os temas claro e escuro preservam o significado; apenas contraste e
  luminosidade mudam.

## Escala semântica

Cada família possui cinco papéis uniformes.

| Papel | Uso | Roxo | Verde | Amarelo-alaranjado |
| --- | --- | --- | --- | --- |
| `strong` | início de gradiente e ênfase forte | `#4f46e5` | `#047857` | `#b45309` |
| `base` | ícone, marcador e identidade | `#8b5cf6` | `#10b981` | `#f59e0b` |
| `text` | texto colorido sobre fundo suave | `#6d28d9` | `#047857` | `#92400e` |
| `border` | contorno de baixa intensidade | `#c4b5fd` | `#a7f3d0` | `#fcd34d` |
| `soft` | superfície de aviso ou destaque | `#f3f0ff` | `#ecfdf5` | `#fffbeb` |

No tema escuro, os mesmos tokens recebem variantes próprias:

| Papel | Roxo | Verde | Amarelo-alaranjado |
| --- | --- | --- | --- |
| `strong` | `#a78bfa` | `#34d399` | `#f59e0b` |
| `base` | `#8b5cf6` | `#10b981` | `#f59e0b` |
| `text` | `#c4b5fd` | `#6ee7b7` | `#fcd34d` |
| `border` | roxo a 38% | verde a 34% | âmbar a 38% |
| `soft` | roxo a 12% | verde a 10% | âmbar a 10% |

## Tokens CSS

O padrão de nomes é:

```css
--app-accent-{purple|green|amber}-{strong|text|border|soft}
--app-accent-{purple|green|amber}
```

Inventário completo protegido pela auditoria:

```text
--app-accent-purple-strong
--app-accent-purple
--app-accent-purple-text
--app-accent-purple-border
--app-accent-purple-soft
--app-accent-green-strong
--app-accent-green
--app-accent-green-text
--app-accent-green-border
--app-accent-green-soft
--app-accent-amber-strong
--app-accent-amber
--app-accent-amber-text
--app-accent-amber-border
--app-accent-amber-soft
--calendar-sunday-cell
--calendar-sunday-text
--calendar-current-day-cell
--calendar-current-sunday-cell
```

Exemplos:

```css
color: var(--app-accent-amber-text);
background: var(--app-accent-amber-soft);
border-color: var(--app-accent-amber-border);
```

## Componentes que materializam a paleta

- `AppNoticePanel` é a única família de avisos editoriais e institucionais.
  Use `tone="purple"` para informação, `tone="green"` para privacidade ou
  confirmação e `tone="amber"` para ressalvas e atenção.
- `AppPageHero` usa a esfera roxa compartilhada. O ícone identifica a área:
  calendário em Calendários, jornal em Notícias e globo somente em Comunidade.
- `app-action--primary` usa o gradiente roxo; os outros dois modelos de botão
  continuam neutros para manter a hierarquia.
- O Dia Bissexto e avisos editoriais usam sempre a família âmbar, evitando um
  quarto amarelo ou laranja criado localmente.
- O mês modelo e as miniaturas anuais usam `--calendar-sunday-text` para os
  domingos. O mês modelo também pode usar `--calendar-sunday-cell`; a grade
  anual compacta mantém somente a cor do texto, sem caixa em torno dos números.
- Na grade anual, o dia atual usa `--calendar-current-day-cell`, em roxo escuro,
  ou `--calendar-current-sunday-cell`, em rosa escuro, quando cai no domingo.
  Ambos usam 78% de opacidade para destacar sem criar uma célula sólida.
  O mês Solaris colore sua identidade e seus fins de semana, mas mantém dias
  úteis com o texto normal do tema.
- As quatro respostas da votação usam, em ordem, verde, roxo, âmbar e rosa. O
  rosa continua sem criar uma família de ação: ele identifica apenas a opção
  mais negativa e o domingo, sempre acompanhado de texto ou ícone.
- Os quatro obstáculos de implantação reutilizam a mesma sequência cromática;
  o formulário ao lado permanece roxo para indicar a ação principal.

## Regras de manutenção

1. Antes de criar uma cor, procure um papel semântico equivalente nesta paleta.
2. Prefira tokens a valores literais dentro de componentes Vue.
3. Novas famílias só entram depois de justificar um significado que roxo,
   verde e âmbar não cobrem.
4. Confira contraste em tema claro e escuro, foco de teclado e telas estreitas.
5. Imagens geradas com datas devem obter os textos pelos formatadores
   compartilhados; não devem manter listas próprias de dias da semana.
