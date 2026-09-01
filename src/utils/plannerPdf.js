/* ===========================================================
   PDF ESTÁVEL DO PLANEJADOR ANUAL

   Cada artigo do modelo visual vira exatamente uma página A4.
   A paginação deixa de depender do mecanismo de impressão do
   navegador, que varia entre Safari, iOS, Android e desktop.
=========================================================== */

export const ANNUAL_PLANNER_PAGE_COUNT = 40;

function yieldToInterface() {
  return new Promise((resolve) => window.requestAnimationFrame(resolve));
}

function encodeText(value) {
  return new TextEncoder().encode(value);
}

function decodeJpegDataUrl(dataUrl) {
  const binary = window.atob(dataUrl.slice(dataUrl.indexOf(',') + 1));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function escapePdfText(value) {
  return String(value).replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)');
}

/**
 * Escreve somente o subconjunto do formato PDF necessário aqui: catálogo,
 * árvore de páginas e uma imagem JPEG por folha. Evitar uma biblioteca geral
 * reduz significativamente o download assíncrono sem alterar o arquivo final.
 */
function createPdfBlob(jpegPages, { year, locale }) {
  const objectCount = 3 * jpegPages.length + 3;
  const infoObject = objectCount;
  const objects = new Array(objectCount + 1);
  const pageReferences = jpegPages.map((_, index) => `${3 + index * 3} 0 R`).join(' ');

  objects[1] = [encodeText('<< /Type /Catalog /Pages 2 0 R >>')];
  objects[2] = [
    encodeText(`<< /Type /Pages /Count ${jpegPages.length} /Kids [${pageReferences}] >>`),
  ];

  jpegPages.forEach((page, index) => {
    const pageObject = 3 + index * 3;
    const contentObject = pageObject + 1;
    const imageObject = pageObject + 2;
    const content = encodeText('q\n595.28 0 0 841.89 0 0 cm\n/PlannerPage Do\nQ\n');

    objects[pageObject] = [
      encodeText(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /PlannerPage ${imageObject} 0 R >> >> /Contents ${contentObject} 0 R >>`,
      ),
    ];
    objects[contentObject] = [
      encodeText(`<< /Length ${content.length} >>\nstream\n`),
      content,
      encodeText('endstream'),
    ];
    objects[imageObject] = [
      encodeText(
        `<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.bytes.length} >>\nstream\n`,
      ),
      page.bytes,
      encodeText('\nendstream'),
    ];
  });

  objects[infoObject] = [
    encodeText(
      `<< /Title (${escapePdfText(`13 Calendar - ${year}`)}) /Subject (International Fixed Calendar annual planner) /Author (13 Calendar) /Creator (13 Calendar) /Producer (13 Calendar PDF writer) /Keywords (${escapePdfText(`13 Calendar, IFC, ${locale}, ${year}`)}) >>`,
    ),
  ];

  const header = new Uint8Array([
    ...encodeText('%PDF-1.4\n%'),
    0xe2,
    0xe3,
    0xcf,
    0xd3,
    ...encodeText('\n'),
  ]);
  const output = [header];
  const offsets = new Array(objectCount + 1).fill(0);
  let byteOffset = header.length;

  for (let objectNumber = 1; objectNumber <= objectCount; objectNumber += 1) {
    offsets[objectNumber] = byteOffset;
    const objectChunks = [
      encodeText(`${objectNumber} 0 obj\n`),
      ...objects[objectNumber],
      encodeText('\nendobj\n'),
    ];
    output.push(...objectChunks);
    byteOffset += objectChunks.reduce((total, chunk) => total + chunk.length, 0);
  }

  const xrefOffset = byteOffset;
  const xrefEntries = offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`)
    .join('');
  output.push(
    encodeText(
      `xref\n0 ${objectCount + 1}\n0000000000 65535 f \n${xrefEntries}trailer\n<< /Size ${objectCount + 1} /Root 1 0 R /Info ${infoObject} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`,
    ),
  );

  return new Blob(output, { type: 'application/pdf' });
}

/**
 * Converte as quarenta folhas já localizadas em um PDF único. As bibliotecas
 * de captura entram por importação dinâmica para não aumentar o carregamento
 * inicial das pessoas que não usam o planejador.
 */
export async function createAnnualPlannerPdf(pageElements, { year, locale, onProgress }) {
  if (pageElements.length !== ANNUAL_PLANNER_PAGE_COUNT) {
    throw new Error(
      `O modelo do planejador deve conter ${ANNUAL_PLANNER_PAGE_COUNT} páginas; recebeu ${pageElements.length}.`,
    );
  }

  const { default: html2canvas } = await import('html2canvas');
  const jpegPages = [];

  for (const [pageIndex, pageElement] of pageElements.entries()) {
    const canvas = await html2canvas(pageElement, {
      backgroundColor: '#ffffff',
      logging: false,
      scale: 1.5,
      useCORS: true,
      width: pageElement.offsetWidth,
      height: pageElement.offsetHeight,
      windowWidth: pageElement.offsetWidth,
      windowHeight: pageElement.offsetHeight,
    });

    /* JPEG mantém o arquivo leve e ainda preserva leitura confortável na
       escala escolhida. Uma imagem corresponde sempre a uma página inteira. */
    const image = canvas.toDataURL('image/jpeg', 0.9);
    jpegPages.push({
      bytes: decodeJpegDataUrl(image),
      width: canvas.width,
      height: canvas.height,
    });

    canvas.width = 1;
    canvas.height = 1;
    onProgress?.(pageIndex + 1, ANNUAL_PLANNER_PAGE_COUNT);

    /* Libera um quadro entre folhas para o navegador atualizar progresso e
       responder ao sistema, principalmente em iPhone e iPad. */
    await yieldToInterface();
  }

  return createPdfBlob(jpegPages, { year, locale });
}
