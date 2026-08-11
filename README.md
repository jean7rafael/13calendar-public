# International Fixed Calendar Companion

Public companion application for exploring the International Fixed Calendar
alongside the Gregorian calendar.

**Live demo:** <https://jean7rafael.github.io/13calendar-public/>

The interface was designed as a possible complement to
[13months.net](https://www.13months.net/). The **X** button in the application
always returns directly to the original website.

## What the application does

- Converts selected dates in both directions between the Gregorian calendar
  and the 13-month International Fixed Calendar.
- Displays the two calendars side by side with synchronized navigation.
- Supports the 13 regular 28-day months plus Year Day and Leap Day.
- Offers adapted and corresponding interpretations for holidays in the
  hypothetical 13-month calendar.
- Lists civil holidays and observances for 251 selectable countries and
  territories, with 206 international calendars and a separate official-source
  appendix for locations not covered by the main dataset.
- Shows Moon phases, optional transition times and Moon markers directly on
  calendar cells.
- Calculates equinoxes and solstices for the appropriate hemisphere.
- Supports filters for holiday categories and observed dates.
- Provides 12 interface languages: English, Portuguese, German, French,
  Italian, Spanish, Russian, Arabic, Hindi, Simplified Chinese, Japanese and
  Korean.
- Shares light/dark theme and language preferences across the experience.
- Includes documented audit scripts for dates, weekday rules, calendar-13
  adaptation, official sources, translations, merges and emojis.

## Performance and privacy

Holiday translations are loaded on demand for the selected country instead of
being included in the first JavaScript download. The public repository and
deployment intentionally exclude local conversation archives, credentials and
the adapted copy of the reference website.

## Development

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run build
npm run holidays:translate:check
npm run holidays:official:audit
npm run holidays:merge:audit
npm run holidays:emoji:audit
```

## Data sources

The international civil-holiday layer is based on the open-source
[`date-holidays`](https://github.com/commenthol/date-holidays) dataset. The
application also records official government references for the separate
appendix and keeps those occurrences reviewable before publication.

## Project status and rights

This is an independent prototype shared for evaluation and collaboration. It is
not an official product of 13months.net. No upstream source code or static copy
of that website is included in this public repository. No reuse license is
granted for this repository unless a `LICENSE` file is added later.
