# Endereços de produção

Somente um endereço deve ser anunciado como canônico por vez. Para trocar no
futuro, comente a linha ativa e descomente a alternativa correspondente nos
arquivos indicados abaixo.

```text
CANÔNICO ATIVO: https://13calendar.pages.dev/
# ALTERNATIVA FUTURA: https://13calendar.eu.org/
# LEGADO: https://jean7rafael.github.io/13calendar-public/
```

Arquivos que usam o endereço canônico:

- `index.html` — canonical, Open Graph e dados estruturados;
- `public/robots.txt` e `public/sitemap.xml` — indexação;
- `cloudflare/community-registration-worker/wrangler.jsonc` — moderação,
  Analytics, CORS e hostnames aceitos pelo Turnstile;
- `.env.production` — endereço público exposto ao aplicativo;
- `vendor/13months-site/index.html` — metadados da página institucional.

As três origens podem permanecer na lista de segurança durante a transição.
Isso não as torna canônicas: apenas permite que formulários legítimos continuem
funcionando enquanto os endereços antigos redirecionam para o principal.
