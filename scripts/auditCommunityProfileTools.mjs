import assert from 'node:assert/strict';
import {
  areEqualSecrets,
  createSocialProfileUrl,
  normalizeDeletionCode,
  readOpenGraphImage,
} from '../cloudflare/community-registration-worker/src/index.js';
import { readFile } from 'node:fs/promises';

/* ===========================================================
   AUDITORIA DOS LINKS PRIVADOS E DA FOTO COMUNITÁRIA

   Garante que links completos, códigos isolados e metadados públicos
   continuem compatíveis com o formulário e com o Worker.
=========================================================== */

const id = 'a4775c9f-fdb9-4384-9304-67a6bddc5462';
const secret = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFG';
const code = `${id}.${secret}`;
const workerSource = await readFile(
  new URL('../cloudflare/community-registration-worker/src/index.js', import.meta.url),
  'utf8',
);

assert.equal(normalizeDeletionCode(code), code);
assert.equal(
  normalizeDeletionCode(`https://13calendar.pages.dev/#/community-remove?code=${code}`),
  code,
);
assert.equal(
  normalizeDeletionCode(`https://example.test/community-remove?code=${encodeURIComponent(code)}`),
  code,
);

assert.equal(
  createSocialProfileUrl('instagram', '@jean7rafael'),
  'https://www.instagram.com/jean7rafael/',
);
assert.equal(
  createSocialProfileUrl('facebook', 'https://m.facebook.com/example'),
  'https://m.facebook.com/example',
);
assert.equal(createSocialProfileUrl('other', 'https://example.com/profile'), '');

const imageUrl = 'https://cdn.example.test/avatar.jpg?width=100&height=100';
assert.equal(
  readOpenGraphImage(`<meta content="${imageUrl.replaceAll('&', '&amp;')}" property="og:image">`),
  imageUrl,
);

assert.equal(await areEqualSecrets('same-secret', 'same-secret'), true);
assert.equal(await areEqualSecrets('same-secret', 'different-secret'), false);

assert.match(
  workerSource,
  /ORDER BY created_at ASC, id ASC/,
  'A vitrine pública deve preservar a ordem histórica, com os primeiros participantes no início.',
);
assert.match(
  workerSource,
  /puppeteer\.launch\(env\.BROWSER\)/,
  'A captura automática deve abrir o perfil público com o navegador quando os metadados falharem.',
);
assert.match(
  workerSource,
  /CASE WHEN status = 'pending' THEN created_at END DESC/,
  'A moderação deve mostrar os cadastros mais recentes primeiro.',
);

console.log('Fluxo comunitário auditado: links, códigos, fotos públicas e segredos.');
