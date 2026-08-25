import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

/* ===========================================================
   AUDITORIA DOS PADRÕES REUTILIZÁVEIS DA INTERFACE

   Esta verificação transforma decisões visuais e de formulário
   em regras do build. Assim uma nova tela não pode reintroduzir
   avatares quadrados nem validação vermelha depois do sucesso.
=========================================================== */

const root = process.cwd();
const sourceDirectory = path.join(root, 'src');
const vueFiles = collectFiles(sourceDirectory, (filePath) => filePath.endsWith('.vue'));
const failures = [];

for (const filePath of vueFiles) {
  const relativePath = path.relative(root, filePath);
  const source = fs.readFileSync(filePath, 'utf8');
  const inputTags = source.match(/<q-input\b[\s\S]*?>/g) || [];

  for (const inputTag of inputTags) {
    if (/:rules=/.test(inputTag) && !/\blazy-rules\b/.test(inputTag)) {
      failures.push(`${relativePath}: todo q-input com regras deve usar lazy-rules.`);
    }
  }

  if (/community-(?:member|admin)-avatar/.test(source)) {
    failures.push(`${relativePath}: use AppProfileAvatar em vez de criar outro avatar.`);
  }

  if (filePath !== path.join(sourceDirectory, 'composables', 'useSuccessfulFormReset.js')) {
    if (/\.resetValidation\s*\(/.test(source)) {
      failures.push(
        `${relativePath}: use useSuccessfulFormReset em vez de limpar validações diretamente.`,
      );
    }
  }
}

const communityPage = fs.readFileSync(path.join(sourceDirectory, 'pages', 'CommunityPage.vue'), 'utf8');
const adminPage = fs.readFileSync(
  path.join(sourceDirectory, 'pages', 'CommunityAdminPage.vue'),
  'utf8',
);

if (!communityPage.includes('<AppProfileAvatar')) {
  failures.push('CommunityPage.vue: a vitrine deve usar AppProfileAvatar.');
}

if (!adminPage.includes('<AppProfileAvatar')) {
  failures.push('CommunityAdminPage.vue: a moderação deve usar AppProfileAvatar.');
}

if (failures.length) {
  console.error('A auditoria da interface encontrou divergências:\n');
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Padrões da interface auditados: formulários, avatares e reutilização visual.');
}

function collectFiles(directoryPath, predicate) {
  const files = [];

  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) files.push(...collectFiles(entryPath, predicate));
    else if (predicate(entryPath)) files.push(entryPath);
  }

  return files;
}
