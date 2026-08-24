-- Autoexclusão segura e imagem opcional administrada de cada perfil.
ALTER TABLE community_registrations ADD COLUMN deletion_token_hash TEXT;
ALTER TABLE community_registrations ADD COLUMN avatar_data BLOB;
ALTER TABLE community_registrations ADD COLUMN avatar_content_type TEXT;
ALTER TABLE community_registrations ADD COLUMN avatar_updated_at TEXT;

CREATE INDEX IF NOT EXISTS idx_community_registrations_deletion_token
  ON community_registrations (id, deletion_token_hash);
