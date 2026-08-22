CREATE TABLE IF NOT EXISTS community_registrations (
  id TEXT PRIMARY KEY,
  public_name TEXT NOT NULL,
  social_network TEXT NOT NULL,
  social_profile TEXT NOT NULL,
  locale TEXT NOT NULL,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TEXT NOT NULL,
  reviewed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_community_registrations_status_created
  ON community_registrations (status, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_community_registrations_social_profile
  ON community_registrations (social_network, social_profile);
