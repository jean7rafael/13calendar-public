import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

/* ===========================================================
   AUDITORIA DA VOTAÇÃO EDUCACIONAL NATIVA

   Impede o retorno da simulação local, exige persistência no D1 e
   confirma que esquema, componente Vue e publicação continuam presentes.
=========================================================== */

const [
  workerSource,
  feedbackSource,
  implementationSource,
  attributionDialogSource,
  feedbackStoreSource,
  voteMigrationSource,
  responseMigrationSource,
  communityPageSource,
  workflowSource,
  environmentSource,
] =
  await Promise.all([
    readFile(
      new URL('../cloudflare/community-registration-worker/src/index.js', import.meta.url),
      'utf8',
    ),
    readFile(
      new URL('../src/components/EducationFeedback.vue', import.meta.url),
      'utf8',
    ),
    readFile(
      new URL('../src/components/EducationImplementationSection.vue', import.meta.url),
      'utf8',
    ),
    readFile(
      new URL('../src/components/EducationAttributionDialog.vue', import.meta.url),
      'utf8',
    ),
    readFile(
      new URL('../src/composables/useEducationFeedbackStore.js', import.meta.url),
      'utf8',
    ),
    readFile(
      new URL(
        '../cloudflare/community-registration-worker/migrations/0006_create_reference_feedback_votes.sql',
        import.meta.url,
      ),
      'utf8',
    ),
    readFile(
      new URL(
        '../cloudflare/community-registration-worker/migrations/0007_create_reference_feedback_responses.sql',
        import.meta.url,
      ),
      'utf8',
    ),
    readFile(new URL('../src/pages/CommunityPage.vue', import.meta.url), 'utf8'),
    readFile(new URL('../.github/workflows/deploy-community-worker.yml', import.meta.url), 'utf8'),
    readFile(new URL('../.env.production', import.meta.url), 'utf8'),
  ]);

assert.match(workerSource, /url\.pathname === '\/feedback\/votes'/);
assert.match(workerSource, /ON CONFLICT\(voter_id\) DO UPDATE/);
assert.match(workerSource, /Cache-Control': 'no-store'/);
assert.match(voteMigrationSource, /CREATE TABLE IF NOT EXISTS reference_feedback_votes/);
assert.match(voteMigrationSource, /CHECK \(option_index BETWEEN 0 AND 3\)/);
assert.match(responseMigrationSource, /CREATE TABLE IF NOT EXISTS reference_feedback_responses/);
assert.match(responseMigrationSource, /vote_community_registration_id TEXT UNIQUE/);
assert.match(responseMigrationSource, /response_community_registration_id TEXT UNIQUE/);
assert.doesNotMatch(responseMigrationSource, /REFERENCES reference_feedback_votes/);
assert.match(feedbackStoreSource, /getCommunityApiUrl\('feedback\/votes'\)/);
assert.match(feedbackStoreSource, /localStorage\.setItem\(VOTER_STORAGE_KEY/);
assert.match(feedbackSource, /shareResults/);
assert.match(feedbackSource, /sentiment_very_satisfied/);
assert.match(feedbackSource, /kind: 'vote'/);
assert.match(implementationSource, /kind: 'response'/);
assert.match(feedbackSource, /EducationAttributionDialog/);
assert.match(implementationSource, /EducationAttributionDialog/);
assert.match(attributionDialogSource, /communityCode/);
assert.doesNotMatch(feedbackSource, /😄|🙂|🙁|😠/);
assert.doesNotMatch(feedbackSource, /fetch\(["']\/api\/votes/);
assert.match(workerSource, /verifyApprovedCommunityRegistration/);
assert.match(workerSource, /reference_feedback_responses/);
assert.match(workerSource, /kind === 'vote'/);
assert.match(workerSource, /kind === 'response'/);
assert.match(workerSource, /vote_attribution_mode/);
assert.match(workerSource, /response_attribution_mode/);
assert.match(communityPageSource, /member\.hasVoted/);
assert.match(communityPageSource, /anonymousResponses/);
assert.match(workflowSource, /npx wrangler deploy --keep-vars/);
assert.match(workflowSource, /npm run migrate:remote/);
assert.match(environmentSource, /VITE_COMMUNITY_REGISTRATION_URL=https:\/\//);

const publicMembersQuery = workerSource.slice(
  workerSource.indexOf('async function listApprovedMembers'),
  workerSource.indexOf('async function listAdminRegistrations'),
);
assert.doesNotMatch(
  publicMembersQuery,
  /option_index|optionIndex/,
  'A opção escolhida nunca deve sair no endpoint público da Comunidade.',
);

console.log('Votação e relatos auditados: seções separadas, vínculos independentes e opção privada.');
