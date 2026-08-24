import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

/* ===========================================================
   LIMITES DO PACOTE PÚBLICO

   Os valores possuem uma margem sobre o build validado. Eles não
   tentam substituir uma medição real de navegador: impedem apenas
   que uma alteração faça o download inicial crescer silenciosamente.
=========================================================== */

const limits = {
  totalRaw: 3_000_000,
  totalGzip: 680_000,
  largestRaw: 1_900_000,
  largestGzip: 360_000,
};

const assetsDirectory = resolve('dist/spa/assets');
const assetNames = (await readdir(assetsDirectory)).filter((name) => /\.(?:css|js)$/i.test(name));

if (assetNames.length === 0) {
  throw new Error('Nenhum JavaScript ou CSS foi encontrado em dist/spa/assets.');
}

/* ===========================================================
   MEDIÇÃO RAW E COMPACTADA
=========================================================== */

const measurements = await Promise.all(
  assetNames.map(async (name) => {
    const path = resolve(assetsDirectory, name);
    const [metadata, content] = await Promise.all([stat(path), readFile(path)]);

    return {
      name,
      raw: metadata.size,
      gzip: gzipSync(content, { level: 9 }).length,
    };
  }),
);

const totals = measurements.reduce(
  (result, item) => ({
    raw: result.raw + item.raw,
    gzip: result.gzip + item.gzip,
  }),
  { raw: 0, gzip: 0 },
);

const largestRaw = measurements.toSorted((a, b) => b.raw - a.raw)[0];
const largestGzip = measurements.toSorted((a, b) => b.gzip - a.gzip)[0];

function formatBytes(value) {
  return `${(value / 1024).toFixed(1)} KiB`;
}

const failures = [
  totals.raw > limits.totalRaw &&
    `total bruto ${formatBytes(totals.raw)} > ${formatBytes(limits.totalRaw)}`,
  totals.gzip > limits.totalGzip &&
    `total gzip ${formatBytes(totals.gzip)} > ${formatBytes(limits.totalGzip)}`,
  largestRaw.raw > limits.largestRaw &&
    `${largestRaw.name} bruto ${formatBytes(largestRaw.raw)} > ${formatBytes(limits.largestRaw)}`,
  largestGzip.gzip > limits.largestGzip &&
    `${largestGzip.name} gzip ${formatBytes(largestGzip.gzip)} > ${formatBytes(limits.largestGzip)}`,
].filter(Boolean);

console.log(
  `Pacote auditado: ${assetNames.length} arquivos, ` +
    `${formatBytes(totals.raw)} brutos e ${formatBytes(totals.gzip)} em gzip.`,
);
console.log(
  `Maior arquivo: ${largestRaw.name}, ${formatBytes(largestRaw.raw)} bruto e ` +
    `${formatBytes(largestRaw.gzip)} em gzip.`,
);

if (failures.length > 0) {
  throw new Error(`O pacote ultrapassou o orçamento:\n- ${failures.join('\n- ')}`);
}
