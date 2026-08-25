-- ==========================================================
-- VOTOS DA PÁGINA DE REFERÊNCIA
--
-- Cada navegador recebe um identificador aleatório local. O banco
-- guarda somente esse identificador e a opção escolhida, sem IP,
-- nome, conta ou qualquer outro dado pessoal.
-- ==========================================================

CREATE TABLE IF NOT EXISTS reference_feedback_votes (
  voter_id TEXT PRIMARY KEY,
  option_index INTEGER NOT NULL CHECK (option_index BETWEEN 0 AND 3),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reference_feedback_votes_option
  ON reference_feedback_votes (option_index);
