# International Fixed Calendar Companion

An independent companion application for exploring the International Fixed
Calendar alongside the Gregorian calendar. It extends the educational experience
of [13months.net](https://www.13months.net/) with bidirectional date conversion,
country-aware holidays, Moon phases, seasons and multilingual tools.

**Live clean demo:** <https://jean7rafael.github.io/13calendar-public/>

> **Project status:** a clean companion build is public for technical review.
> The adapted local copy of the reference website remains private while a
> conversation with the creator of `13months.net` is pending. The upstream
> repository currently has no published license, so this project does not
> assume permission to redistribute that adapted reference source.

## What the application does

### Side-by-side calendars

- Converts selected dates between the Gregorian calendar and the International
  Fixed Calendar.
- Keeps Sunday as the first day of the week in both calendars.
- Uses 13 regular months of 28 days, with **Sol** between June and July.
- Presents **Year Day** and **Leap Day** as Special Days outside the weekly
  cycle. Leap Day comes immediately after Year Day.
- Provides month and year selectors without the former artificial 1900–2100
  limit.

### Holidays for 251 countries and territories

- Keeps all 251 geographic options available in a region-based selector.
- Supplies civil calendars for 206 countries and territories from the installed
  international source.
- Maintains an official-source appendix for the remaining 45 locations. When
  official government dates are unavailable for a selected year, the Gregorian
  holiday card explains that limitation without hiding astronomical events,
  calculated religious dates or recurring commemorative dates.
- Handles observed and substitute holidays without silently replacing the civil
  date. The Gregorian side can show the original date and its observed date;
  isolated observed dates that would not exist in the hypothetical 13-month
  calendar are omitted there.
- Merges equivalent entries, standardizes emoji meanings and avoids generic
  labels such as “Holiday” whenever a specific name is available.
- Calculates occurrences on demand for the selected year and a two-year window
  on either side instead of storing a fixed 1900–2100 table.

### Holidays adapted to a 13-month calendar

The International Fixed Calendar holiday card offers two interpretations:

- **Adapted dates:** fixed dates and weekday rules are reapplied to the equivalent
  month in the 13-month system. Rules such as “the first Monday” therefore remain
  meaningful in that calendar.
- **Corresponding dates:** the same physical instant is converted from the
  Gregorian calendar.

Western Easter and its dependent dates have a dedicated adapted calculation.
Religious or lunisolar calendars without an equivalent month preserve the
corresponding physical instant.

### Moon phases and seasons

- Calculates New Moon, First Quarter, Full Moon and Last Quarter events.
- Displays compact phase markers inside both calendars, with translated tooltips.
- Shows phase dates and optional transition times in dedicated cards.
- Calculates seasonal transitions and applies the correct Northern or Southern
  Hemisphere interpretation for the selected country.

### Languages, themes and responsive interface

- 12 interface languages: English, Portuguese, German, French, Italian, Spanish,
  Russian, Arabic, Hindi, Simplified Chinese, Japanese and Korean.
- Curated calendar terminology prevents ambiguous machine translations such as
  confusing Sunday with the month Sol or losing the fact that Leap Day follows
  Year Day.
- Light and dark themes share the visual language of the reference project.
- Calendar cells remain square and aligned while cards adapt to the available
  width without overlapping.
- Long holiday lists use a compact internal scrollbar only when their real
  content exceeds the five-line card area.

### Community portrait

- A discreet **“See how many of us there are →”** link in the page flow opens a
  dedicated, multilingual community dashboard without covering mobile content.
- The page is prepared for privacy-first, aggregated Cloudflare Web Analytics
  data: estimated visits, page views, daily activity, countries, popular pages,
  referrers and devices.
- No individual visitor profile is published, and the interface never invents
  figures while analytics collection is not configured.
- The public data contract and setup boundary are documented in
  [`docs/CLOUDFLARE_COMMUNITY_ANALYTICS.md`](docs/CLOUDFLARE_COMMUNITY_ANALYTICS.md).

## Navigation integration with 13months.net

The two experiences are designed to feel connected:

1. The adapted reference page begins with a prominent
   **“Date conversion, holidays & Moon phases”** button that opens this companion.
2. The companion’s top bar keeps a clearly visible **X** button with the tooltip
   **“Back to the home page”**.
3. That **X button returns directly to the incorporated reference home page**.
4. Language and light/dark theme preferences are shared in both directions.

The adapted upstream source is isolated in `vendor/13months-site`; its generated
static build is served from `public/reference-site`. Provenance and local changes
are documented in [`vendor/13months-site/UPSTREAM.md`](vendor/13months-site/UPSTREAM.md).

## Data quality and maintenance

Holiday changes are protected by automated audits for:

- country coverage and merge rules;
- weekday-based holidays in both calendars;
- adapted International Fixed Calendar rules;
- translations, canonical names and emoji consistency;
- official-source appendix validity;
- unknown or unsupported date mechanisms.

The official-source refresh process is designed for runs in late December and
early January. Candidates remain reviewable and are not published automatically
without validation. No paid translation API is required.

The project standards are documented in:

- [`docs/CALENDAR_13_STANDARD.md`](docs/CALENDAR_13_STANDARD.md)
- [`docs/HOLIDAY_COUNTRY_STANDARD.md`](docs/HOLIDAY_COUNTRY_STANDARD.md)
- [`docs/OFFICIAL_HOLIDAY_COVERAGE.md`](docs/OFFICIAL_HOLIDAY_COVERAGE.md)

## Technology

- Vue 3 and Quasar for the companion application
- SolidJS and Vite for the adapted reference page
- Astronomy Engine for lunar and seasonal calculations
- `date-holidays` and curated official sources for civil holiday data
- Vue I18n plus incremental, curated translation catalogs
- Cloudflare Web Analytics integration prepared as an optional, cookie-free
  aggregate data source

## Local development

```bash
npm install
npm run dev
```

Main quality checks:

```bash
npm run lint
npm run build
npm run holidays:audit
npm run holidays:weekday:audit
npm run holidays:calendar13:audit
npm run holidays:merge:audit
npm run holidays:emoji:audit
npm run holidays:translation:audit
npm run holidays:official:audit
```

## Collaboration proposal

This project is intended as a complementary tool rather than a replacement for
`13months.net`. A possible integration would keep the educational site as the
home experience and expose the companion through a button or a subdomain for
visitors who want to convert dates or explore holidays and Moon phases.

Before a public release, the preferred next step is to obtain the upstream
creator’s review and explicit permission for the adapted reference source and
visual integration.

<details>
<summary><strong>Resumo em português</strong></summary>

Este é um aplicativo complementar independente para comparar o calendário
gregoriano com o Calendário Fixo Internacional. Ele converte datas nos dois
sentidos, apresenta feriados de 251 países e territórios, adapta regras de
feriados ao calendário de 13 meses, calcula fases da Lua e estações e oferece
12 idiomas, temas claro e escuro e uma interface responsiva.

A integração visual mantém o site de referência como página inicial: um botão
abre o conversor e o botão **X**, em evidência na barra superior do aplicativo,
volta diretamente à página inicial incorporada. Idioma e tema são compartilhados
entre as duas páginas.

Antes da publicação pública, ainda é necessário solicitar ao criador do
`13months.net` autorização para redistribuir a fonte adaptada e validar a forma
de colaboração, pois o repositório original não possui uma licença publicada.

</details>
