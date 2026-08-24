-- Ciclo completo de moderação e retenção dos cadastros voluntários.
ALTER TABLE community_registrations ADD COLUMN updated_at TEXT;

CREATE INDEX IF NOT EXISTS idx_community_registrations_reviewed
  ON community_registrations (status, reviewed_at DESC);
