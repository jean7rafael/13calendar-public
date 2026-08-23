CREATE TABLE IF NOT EXISTS community_analytics_daily (
  date TEXT PRIMARY KEY,
  visits INTEGER NOT NULL DEFAULT 0,
  page_views INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS community_analytics_countries (
  date TEXT NOT NULL,
  country TEXT NOT NULL,
  visits INTEGER NOT NULL DEFAULT 0,
  page_views INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (date, country)
);

CREATE TABLE IF NOT EXISTS community_analytics_pages (
  date TEXT NOT NULL,
  path TEXT NOT NULL,
  visits INTEGER NOT NULL DEFAULT 0,
  page_views INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (date, path)
);

CREATE TABLE IF NOT EXISTS community_analytics_referrers (
  date TEXT NOT NULL,
  host TEXT NOT NULL,
  visits INTEGER NOT NULL DEFAULT 0,
  page_views INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (date, host)
);

CREATE TABLE IF NOT EXISTS community_analytics_devices (
  date TEXT NOT NULL,
  device TEXT NOT NULL,
  visits INTEGER NOT NULL DEFAULT 0,
  page_views INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (date, device)
);

CREATE INDEX IF NOT EXISTS idx_community_analytics_countries_country
  ON community_analytics_countries (country);

CREATE INDEX IF NOT EXISTS idx_community_analytics_pages_path
  ON community_analytics_pages (path);
