-- ==========================================================
-- RELATOS E VÍNCULO VOLUNTÁRIO COM A COMUNIDADE
--
-- O voto continua agregado e não revela a opção no card público.
-- Voto e relato podem ser vinculados de forma independente ao mesmo
-- perfil aprovado, sempre mediante o código privado do cadastro.
-- Esse código nunca é persistido nesta tabela.
-- ==========================================================

CREATE TABLE IF NOT EXISTS reference_feedback_responses (
  voter_id TEXT PRIMARY KEY,
  public_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  suggestion TEXT NOT NULL DEFAULT '',
  vote_attribution_mode TEXT NOT NULL DEFAULT 'anonymous'
    CHECK (vote_attribution_mode IN ('anonymous', 'community')),
  vote_community_registration_id TEXT UNIQUE,
  response_attribution_mode TEXT NOT NULL DEFAULT 'anonymous'
    CHECK (response_attribution_mode IN ('anonymous', 'community')),
  response_community_registration_id TEXT UNIQUE,
  locale TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (vote_community_registration_id) REFERENCES community_registrations (id) ON DELETE SET NULL,
  FOREIGN KEY (response_community_registration_id) REFERENCES community_registrations (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_reference_feedback_vote_community
  ON reference_feedback_responses (vote_community_registration_id);

CREATE INDEX IF NOT EXISTS idx_reference_feedback_response_community
  ON reference_feedback_responses (response_community_registration_id);
