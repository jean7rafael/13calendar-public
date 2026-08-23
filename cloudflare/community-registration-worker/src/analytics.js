/* ===========================================================
   RETRATO PÚBLICO DA COMUNIDADE

   A Cloudflare fornece somente dados agregados do Web
   Analytics. O Worker preserva resumos diários no D1 para que
   o histórico não desapareça quando a janela da API avançar.
=========================================================== */

const ANALYTICS_ENDPOINT = 'https://api.cloudflare.com/client/v4/graphql';
const ANALYTICS_WINDOW_DAYS = 89;
const MAXIMUM_PUBLIC_ROWS = 12;

const COMMUNITY_ANALYTICS_QUERY = `
  query CommunityAnalytics(
    $accountTag: string!
    $start: Time!
    $end: Time!
    $host: string!
  ) {
    viewer {
      accounts(filter: { accountTag: $accountTag }) {
        daily: rumPageloadEventsAdaptiveGroups(
          filter: {
            datetime_geq: $start
            datetime_leq: $end
            requestHost: $host
            bot: 0
          }
          limit: 120
          orderBy: [date_ASC]
        ) {
          count
          sum { visits }
          dimensions { date }
        }
        countries: rumPageloadEventsAdaptiveGroups(
          filter: {
            datetime_geq: $start
            datetime_leq: $end
            requestHost: $host
            bot: 0
          }
          limit: 2000
          orderBy: [date_ASC]
        ) {
          count
          sum { visits }
          dimensions { date countryName }
        }
        pages: rumPageloadEventsAdaptiveGroups(
          filter: {
            datetime_geq: $start
            datetime_leq: $end
            requestHost: $host
            bot: 0
          }
          limit: 2000
          orderBy: [date_ASC]
        ) {
          count
          sum { visits }
          dimensions { date requestPath }
        }
        referrers: rumPageloadEventsAdaptiveGroups(
          filter: {
            datetime_geq: $start
            datetime_leq: $end
            requestHost: $host
            bot: 0
          }
          limit: 2000
          orderBy: [date_ASC]
        ) {
          count
          sum { visits }
          dimensions { date refererHost }
        }
        devices: rumPageloadEventsAdaptiveGroups(
          filter: {
            datetime_geq: $start
            datetime_leq: $end
            requestHost: $host
            bot: 0
          }
          limit: 1000
          orderBy: [date_ASC]
        ) {
          count
          sum { visits }
          dimensions { date deviceType }
        }
      }
    }
  }
`;

/* ===========================================================
   ATUALIZAÇÃO E LEITURA DO PAINEL
=========================================================== */

export async function refreshAndReadCommunityAnalytics(env) {
  try {
    const snapshot = await requestCloudflareSnapshot(env);
    await persistSnapshot(env.DB, snapshot);
  } catch (error) {
    // Um retrato já preservado continua disponível durante falhas externas.
    console.error('Cloudflare Web Analytics refresh failed', error);
  }

  return readStoredCommunityAnalytics(env.DB);
}

export async function refreshCommunityAnalytics(env) {
  const snapshot = await requestCloudflareSnapshot(env);
  await persistSnapshot(env.DB, snapshot);
}

/* ===========================================================
   CONSULTA PRIVADA À API GRAPHQL DA CLOUDFLARE
=========================================================== */

async function requestCloudflareSnapshot(env) {
  if (
    !env.CLOUDFLARE_ANALYTICS_API_TOKEN ||
    !env.CLOUDFLARE_ACCOUNT_ID ||
    !env.CLOUDFLARE_ANALYTICS_HOST
  ) {
    throw new Error('Cloudflare Analytics configuration is incomplete');
  }

  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - ANALYTICS_WINDOW_DAYS);

  const response = await fetch(ANALYTICS_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.CLOUDFLARE_ANALYTICS_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(12_000),
    body: JSON.stringify({
      query: COMMUNITY_ANALYTICS_QUERY,
      variables: {
        accountTag: env.CLOUDFLARE_ACCOUNT_ID,
        start: start.toISOString(),
        end: end.toISOString(),
        host: env.CLOUDFLARE_ANALYTICS_HOST,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Cloudflare Analytics HTTP ${response.status}`);
  }

  const payload = await response.json();
  const account = payload?.data?.viewer?.accounts?.[0];

  if (payload?.errors?.length || !account) {
    throw new Error(payload?.errors?.[0]?.message || 'Cloudflare Analytics returned no account');
  }

  return account;
}

/* ===========================================================
   PERSISTÊNCIA DIÁRIA IDEMPOTENTE
=========================================================== */

async function persistSnapshot(database, snapshot) {
  const updatedAt = new Date().toISOString();
  const statements = [];

  for (const row of snapshot.daily || []) {
    const date = normalizeDate(row?.dimensions?.date);

    if (!date) continue;

    statements.push(
      database
        .prepare(
          `INSERT INTO community_analytics_daily (date, visits, page_views, updated_at)
           VALUES (?, ?, ?, ?)
           ON CONFLICT(date) DO UPDATE SET
             visits = excluded.visits,
             page_views = excluded.page_views,
             updated_at = excluded.updated_at`,
        )
        .bind(date, normalizeCount(row?.sum?.visits), normalizeCount(row?.count), updatedAt),
    );
  }

  appendDimensionStatements(
    statements,
    database,
    'community_analytics_countries',
    'country',
    snapshot.countries,
    (row) => normalizeCountry(row?.dimensions?.countryName),
    updatedAt,
  );
  appendDimensionStatements(
    statements,
    database,
    'community_analytics_pages',
    'path',
    snapshot.pages,
    (row) => normalizeDimension(row?.dimensions?.requestPath, 240),
    updatedAt,
  );
  appendDimensionStatements(
    statements,
    database,
    'community_analytics_referrers',
    'host',
    snapshot.referrers,
    (row) => normalizeDimension(row?.dimensions?.refererHost, 180) || 'direct',
    updatedAt,
  );
  appendDimensionStatements(
    statements,
    database,
    'community_analytics_devices',
    'device',
    snapshot.devices,
    (row) => normalizeDimension(row?.dimensions?.deviceType, 40),
    updatedAt,
  );

  // O limite evita lotes excessivos mesmo se a API ampliar a cardinalidade.
  for (let index = 0; index < statements.length; index += 80) {
    await database.batch(statements.slice(index, index + 80));
  }
}

function appendDimensionStatements(
  statements,
  database,
  table,
  dimensionColumn,
  rows,
  getDimension,
  updatedAt,
) {
  for (const row of rows || []) {
    const date = normalizeDate(row?.dimensions?.date);
    const dimension = getDimension(row);

    if (!date || !dimension) continue;

    statements.push(
      database
        .prepare(
          `INSERT INTO ${table} (date, ${dimensionColumn}, visits, page_views, updated_at)
           VALUES (?, ?, ?, ?, ?)
           ON CONFLICT(date, ${dimensionColumn}) DO UPDATE SET
             visits = excluded.visits,
             page_views = excluded.page_views,
             updated_at = excluded.updated_at`,
        )
        .bind(
          date,
          dimension,
          normalizeCount(row?.sum?.visits),
          normalizeCount(row?.count),
          updatedAt,
        ),
    );
  }
}

/* ===========================================================
   AGREGAÇÃO PÚBLICA SEM IDENTIFICADORES INDIVIDUAIS
=========================================================== */

async function readStoredCommunityAnalytics(database) {
  const [period, summary, activity, countries, pages, referrers, devices] = await Promise.all([
    database
      .prepare('SELECT MIN(date) AS dateFrom, MAX(date) AS dateTo FROM community_analytics_daily')
      .first(),
    database
      .prepare(
        `SELECT COALESCE(SUM(visits), 0) AS visits,
                COALESCE(SUM(page_views), 0) AS pageViews,
                MAX(updated_at) AS generatedAt
           FROM community_analytics_daily`,
      )
      .first(),
    database
      .prepare(
        `SELECT date, visits, page_views AS pageViews
           FROM community_analytics_daily
          ORDER BY date ASC`,
      )
      .all(),
    readRanking(database, 'community_analytics_countries', 'country', 'code', 'visits'),
    readRanking(database, 'community_analytics_pages', 'path', 'path', 'page_views', 'views'),
    readRanking(database, 'community_analytics_referrers', 'host', 'host', 'visits'),
    readRanking(database, 'community_analytics_devices', 'device', 'name', 'page_views', 'visits'),
  ]);

  const countryRows = countries.results || [];
  const hasData = Boolean(period?.dateFrom && period?.dateTo);

  return {
    status: hasData ? 'ready' : 'awaiting_configuration',
    generatedAt: summary?.generatedAt || null,
    period: { from: period?.dateFrom || null, to: period?.dateTo || null },
    summary: {
      visits: hasData ? Number(summary?.visits) || 0 : null,
      pageViews: hasData ? Number(summary?.pageViews) || 0 : null,
      countries: hasData ? countryRows.length : null,
    },
    activity: activity.results || [],
    countries: countryRows,
    pages: pages.results || [],
    referrers: referrers.results || [],
    devices: devices.results || [],
  };
}

function readRanking(
  database,
  table,
  dimensionColumn,
  responseColumn,
  metricColumn,
  responseMetric = 'visits',
) {
  return database
    .prepare(
      `SELECT ${dimensionColumn} AS ${responseColumn},
              COALESCE(SUM(${metricColumn}), 0) AS ${responseMetric}
         FROM ${table}
        GROUP BY ${dimensionColumn}
        ORDER BY ${responseMetric} DESC
        LIMIT ${MAXIMUM_PUBLIC_ROWS}`,
    )
    .all();
}

/* ===========================================================
   NORMALIZAÇÃO DOS VALORES RECEBIDOS
=========================================================== */

function normalizeCount(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.round(number) : 0;
}

function normalizeDate(value) {
  const date = String(value || '');
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
}

function normalizeCountry(value) {
  const country = String(value || '').toUpperCase();
  return /^[A-Z]{2}$/.test(country) ? country : null;
}

function normalizeDimension(value, maximumLength) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maximumLength);
}
