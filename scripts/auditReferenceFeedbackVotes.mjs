import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

/* ===========================================================
   AUDITORIA DA VOTAÇÃO DA PÁGINA DE REFERÊNCIA

   Impede o retorno da simulação local, exige persistência no D1 e
   confirma que esquema, frontend e publicação continuam presentes.
=========================================================== */

const [workerSource, feedbackSource, migrationSource, workflowSource, environmentSource] =
  await Promise.all([
    readFile(
      new URL('../cloudflare/community-registration-worker/src/index.js', import.meta.url),
      'utf8',
    ),
    readFile(
      new URL('../vendor/13months-site/src/components/FeedbackRating.tsx', import.meta.url),
      'utf8',
    ),
    readFile(
      new URL(
        '../cloudflare/community-registration-worker/migrations/0006_create_reference_feedback_votes.sql',
        import.meta.url,
      ),
      'utf8',
    ),
    readFile(new URL('../.github/workflows/deploy-community-worker.yml', import.meta.url), 'utf8'),
    readFile(new URL('../vendor/13months-site/.env.production', import.meta.url), 'utf8'),
  ]);

assert.match(workerSource, /url\.pathname === '\/feedback\/votes'/);
assert.match(workerSource, /ON CONFLICT\(voter_id\) DO UPDATE/);
assert.match(workerSource, /Cache-Control': 'no-store'/);
assert.match(migrationSource, /CREATE TABLE IF NOT EXISTS reference_feedback_votes/);
assert.match(migrationSource, /CHECK \(option_index BETWEEN 0 AND 3\)/);
assert.match(feedbackSource, /VITE_COMMUNITY_API_URL/);
assert.match(feedbackSource, /localStorage\.setItem\(VOTER_STORAGE_KEY/);
assert.doesNotMatch(feedbackSource, /fetch\("\/api\/votes"/);
assert.match(workflowSource, /npx wrangler deploy --keep-vars/);
assert.match(environmentSource, /VITE_COMMUNITY_API_URL=https:\/\//);

console.log('Votação auditada: identidade anônima, D1, frontend e publicação do Worker.');
