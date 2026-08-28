# International Fixed Calendar Companion — versão 1.0

> Arquivo histórico. Este texto preserva a apresentação do projeto antes da
> migração para a experiência independente da versão 2.0.

An independent companion application for exploring the International Fixed
Calendar alongside the Gregorian calendar. It extends the educational experience
of [13months.net](https://www.13months.net/) with bidirectional date conversion,
country-aware holidays, Moon phases, seasons and multilingual tools.

**Live site:** <https://13calendar.pages.dev/>

> **Project status:** the clean companion build and its adapted educational home
> page are public for evaluation. A conversation with the creator of
> `13months.net` remains open. The upstream repository currently has no
> published license, so this project will promptly honor any attribution,
> visual-change or removal request from its author.

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

- A consistent community button in the three top bars opens a dedicated,
  multilingual dashboard without covering mobile content.
- The page presents privacy-first, aggregated Cloudflare Web Analytics data:
  estimated visits, page views, daily activity, countries, popular pages,
  referrers and devices. Daily snapshots are preserved in D1 beyond the
  analytics API window.
- No individual visitor profile is published, and the interface never invents
  figures while analytics collection is not configured.
- Visitors may optionally submit a public name and social profile. The backend
  stores the request as pending and exposes it only after moderation.
- Each approved participant receives a private removal link that deletes only
  their own profile. Full links and isolated private codes are accepted.
- Instagram and Facebook profile pictures are imported automatically from
  public page metadata when available, with moderated retry and manual upload
  as fallbacks. No social-network login is used.
- The public gallery preserves the historical order, while the moderation view
  keeps the newest requests at the top.

## Navigation integration with 13months.net

The two experiences were designed to feel connected:

1. The adapted reference page began with a prominent conversion button.
2. The companion’s top bar kept a visible return button.
3. That button returned to the incorporated reference home page.
4. Language and light/dark theme preferences were shared in both directions.

The adapted upstream source was isolated in `vendor/13months-site`; its generated
static build was served from `public/reference-site`.

## Technology in version 1.0

- Vue 3 and Quasar for the companion application
- SolidJS and Vite for the adapted reference page
- Astronomy Engine for lunar and seasonal calculations
- `date-holidays` and curated official sources for civil holiday data
- Vue I18n plus incremental, curated translation catalogs
- Cloudflare Workers, D1, Turnstile and aggregate analytics

## Data quality and maintenance

Holiday changes were protected by automated audits for country coverage, merge
rules, weekday-based holidays, adapted IFC rules, translations, canonical names,
emoji consistency, official-source appendix validity and unsupported mechanisms.

The official-source refresh process was designed for late December and early
January. Candidates remained reviewable and were not published automatically
without validation. No paid translation API was required.

The project standards were documented in:

- [`../CALENDAR_13_STANDARD.md`](../CALENDAR_13_STANDARD.md)
- [`../HOLIDAY_COUNTRY_STANDARD.md`](../HOLIDAY_COUNTRY_STANDARD.md)
- [`../OFFICIAL_HOLIDAY_COVERAGE.md`](../OFFICIAL_HOLIDAY_COVERAGE.md)

## License and adapted reference page

Original 13 Calendar code and documentation were available under the MIT
license. The substantially adapted educational entrance in
`vendor/13months-site`, and its generated `public/reference-site` build,
remained outside that MIT grant while the upstream repository had no published
license. The privacy notice was available inside the application.

## Local development

```bash
npm install
npm run dev
```

Main quality checks included lint, build and the complete holiday audit suite.

## Collaboration proposal

Version 1.0 stated that the project was intended as a complementary tool rather
than a replacement for `13months.net`. A possible integration would have kept
the educational site as the home experience and exposed the companion through
a button or subdomain.

The adapted demonstration was public while review was pending. The project
committed to honor attribution, visual-change, integration or removal requests
from the upstream author.

<details>
<summary><strong>Resumo em português preservado</strong></summary>

Este era um aplicativo complementar independente para comparar o calendário
gregoriano com o Calendário Fixo Internacional. Ele convertia datas nos dois
sentidos, apresentava feriados de 251 países e territórios, adaptava regras de
feriados ao calendário de 13 meses, calculava fases da Lua e estações e oferecia
12 idiomas, temas claro e escuro e uma interface responsiva.

A integração visual mantinha a página educacional adaptada como página inicial.
A demonstração permanecia pública enquanto a conversa com o criador do
`13months.net` estava aberta.

</details>

## Historical intent

Version 1.0 was presented as a complementary tool rather than a replacement for
`13months.net`. Version 2.0 preserves attribution and research references while
moving the product, navigation, content and tools to an independent Vue/Quasar
experience.
