# 13 Calendar

An independent, open-source learning and productivity project for comparing the
Gregorian calendar with the International Fixed Calendar (IFC).

**Stable site:** <https://13calendar.pages.dev/>
**Version 2.0:** published from the private `main` source through the verified
public release workflow.

13 Calendar is no longer structured as a companion to another website. It has
its own Vue/Quasar navigation, educational material, calendars, tools, news hub
and privacy-first community area. External projects such as 13months.net and
13cal.net remain credited research references, not product dependencies.

## Product areas

The site root opens **Calendars**, the project’s original page. The navigation
order remains Learn, Tools, Calendars, Moon, News and Community.

- **Learn:** an evidence-aware introduction to the IFC, its history, promises,
  limitations and the difference between a 28-day civil month and the 29.53-day
  mean lunar cycle.
- **Tools:** bidirectional conversion, shareable date cards, birthday comparison,
  annual planning, ICS export, astronomy, local favorites, PWA access and a
  compact IFC widget.
- **Calendars:** synchronized Gregorian and 13-month views with holidays, Moon
  phases, seasons and equivalent-date tooltips in both directions.
- **News:** independent coverage of articles, research and other calendar
  projects, with a clear no-endorsement notice.
- **Community:** aggregate visit statistics and optional moderated public
  profiles without social-network login.

## Calendar experience

- Thirteen regular 28-day months, with **Solaris** between June and July.
- **Year Day** and **Leap Day** outside the weekly cycle; in this project’s
  adopted model, Leap Day follows Year Day.
- Gregorian and IFC dates use the same tested conversion engine.
- Both calendars include a Today action.
- Holiday and Moon-phase cards show the equivalent date in the other calendar.
- Desktop keeps both calendar columns visible. At the stacking breakpoint,
  visitors switch between Gregorian and 13-month views while each calendar’s
  holiday, date and Moon cards stay together.
- Shared date fields accept keyboard entry and provide visual day, month and
  year grids instead of the browser’s inconsistent native date picker.

## Holidays, astronomy and languages

- 251 selectable countries and territories, with civil data for 206 locations
  plus a reviewable official-source appendix.
- Adapted and corresponding holiday interpretations for the IFC.
- New Moon, First Quarter, Full Moon and Last Quarter events, plus equinoxes,
  solstices, perihelion and aphelion.
- 12 interface languages: Arabic, Chinese, English, French, German, Hindi,
  Italian, Japanese, Korean, Portuguese, Russian and Spanish.
- Light and dark themes with a documented semantic color system.

## Privacy and architecture

- No account is required for calendars or tools.
- Preferences and local favorites remain in the browser.
- Cloudflare analytics are aggregate; voluntary profiles are separately
  moderated and protected with Turnstile.
- Vue 3, Quasar, Vue I18n, Astronomy Engine and curated civil-holiday data form
  the independent application. The former incorporated reference site is being
  retired rather than carried forward as a second frontend.

## Version documents

- [Version 2.0 scope and detailed changes](docs/releases/README_2.0.md)
- [Preserved version 1.0 presentation](docs/releases/README_1.0.md)
- [Changelog](CHANGELOG.md)
- [Calendar rules](docs/CALENDAR_13_STANDARD.md)
- [Country and holiday rules](docs/HOLIDAY_COUNTRY_STANDARD.md)
- [UI color palette](docs/UI_COLOR_PALETTE.md)

## Local development

```bash
npm install
npm run dev
```

Full verification:

```bash
npm run verify
```

Focused checks:

```bash
npm run lint
npm run ui:audit
npm run education:audit
npm run calendar:conversion:audit
npm run build
```

## Rights and attribution

The entire first-party 13 Calendar website and application—original source,
interface assets, editorial content and documentation—is available under the
MIT license in [`LICENSE`](LICENSE). Third-party material and historical adaptation
boundaries are recorded in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
13 Calendar is independent and is not affiliated with 13months.net, 13cal.net or
any calendar standardization body.

<details>
<summary><strong>Resumo em português</strong></summary>

O 13 Calendar 2.0 é um projeto educacional independente para comparar o
calendário gregoriano e o Calendário Fixo Internacional. Reúne aprendizado,
ferramentas, calendários, notícias e comunidade numa única aplicação Vue e
Quasar. Outros sites continuam reconhecidos como referências, mas não definem
mais a arquitetura nem a identidade do produto.

A raiz do site abre Calendários, a primeira página desenvolvida no projeto. A
ordem da barra continua Aprenda, Ferramentas, Calendários, Lua, Notícias e
Comunidade. A versão 2.0 é publicada pela `main` por meio do fluxo verificado de
release.

</details>
