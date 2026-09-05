/**
 * Gera o pacote completo do ícone “folha 13”.
 *
 * O desenho replica a direção aprovada: o próprio quadrado violeta funciona
 * como a folha, com duas presilhas, uma linha superior, o número 13 e a dobra
 * discreta no canto inferior direito. Todos os elementos são vetoriais e não
 * recebem máscara, brilho ou sombra, pois esses efeitos pertencem ao sistema.
 *
 * A conversão para PNG usa ferramentas nativas do macOS. Os SVGs continuam
 * sendo as fontes editáveis e independem dessas ferramentas para serem usados.
 */

import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGE_ROOT = join(PROJECT_ROOT, 'branding', 'app-icon-calendar-page');
const SOURCE_DIR = join(PACKAGE_ROOT, 'sources');
const LAYER_DIR = join(PACKAGE_ROOT, 'icon-composer-layers');
const PREVIEW_DIR = join(PACKAGE_ROOT, 'previews');
const WEB_DIR = join(PACKAGE_ROOT, 'web-ready');
const PUBLIC_ICON_DIR = join(PROJECT_ROOT, 'public', 'icons');

// As seis aparências correspondem às visualizações atuais da Apple. O sistema
// deriva Clear e Tinted do modo Mono; os arquivos achatados servem para revisão.
const APPEARANCES = {
  default: {
    start: '#2437d8',
    end: '#7b24d8',
    mark: '#ffffff',
    ruleOpacity: 0.42,
    foldLight: '#c4b5fd',
    foldDark: '#5120a8',
  },
  dark: {
    start: '#080f2f',
    end: '#2d125f',
    mark: '#f3f0ff',
    ruleOpacity: 0.34,
    foldLight: '#7367dc',
    foldDark: '#17082f',
  },
  'clear-light': {
    start: '#eeeaff',
    end: '#d9d1ff',
    mark: '#43219a',
    ruleOpacity: 0.28,
    foldLight: '#a78bfa',
    foldDark: '#7650d6',
  },
  'clear-dark': {
    start: '#171426',
    end: '#281747',
    mark: '#f6f3ff',
    ruleOpacity: 0.3,
    foldLight: '#7569bc',
    foldDark: '#10081e',
  },
  'tinted-light': {
    start: '#ede8ff',
    end: '#d8ccff',
    mark: '#4c1d95',
    ruleOpacity: 0.3,
    foldLight: '#a78bfa',
    foldDark: '#6d3cca',
  },
  'tinted-dark': {
    start: '#21113d',
    end: '#3b1768',
    mark: '#e2d3ff',
    ruleOpacity: 0.32,
    foldLight: '#9069d0',
    foldDark: '#140824',
  },
};

// Os contornos abaixo vêm do Roboto Black, cuja licença Apache 2.0 já acompanha
// o projeto por meio de @quasar/extras. Assim, o “13” não depende de uma fonte
// instalada quando o SVG é aberto ou importado no Icon Composer.
const ONE_PATH =
  'M 228.59375 -398.125 L 228.59375 0 L 136.445312 0 L 136.445312 -294.21875 L 45.664062 -267.695312 L 45.664062 -337.695312 L 220.117188 -398.125 Z M 228.59375 -398.125';
const THREE_PATH =
  'M 108.554688 -237.617188 L 153.398438 -237.617188 C 164.882812 -237.617188 174.316406 -239.667969 181.699219 -243.769531 C 189.082031 -247.871094 194.597656 -253.703125 198.242188 -261.269531 C 201.886719 -268.835938 203.710938 -277.8125 203.710938 -288.203125 C 203.710938 -296.222656 202.023438 -303.605469 198.652344 -310.351562 C 195.28125 -317.097656 190.128906 -322.519531 183.203125 -326.621094 C 176.277344 -330.722656 167.433594 -332.773438 156.679688 -332.773438 C 149.386719 -332.773438 142.277344 -331.269531 135.351562 -328.261719 C 128.425781 -325.253906 122.726562 -321.015625 118.261719 -315.546875 C 113.796875 -310.078125 111.5625 -303.425781 111.5625 -295.585938 L 19.140625 -295.585938 C 19.140625 -318.191406 25.382812 -337.558594 37.871094 -353.691406 C 50.359375 -369.824219 66.855469 -382.21875 87.363281 -390.878906 C 107.871094 -399.539062 129.972656 -403.867188 153.671875 -403.867188 C 181.925781 -403.867188 206.71875 -399.539062 228.046875 -390.878906 C 249.375 -382.21875 266.007812 -369.460938 277.949219 -352.597656 C 289.890625 -335.734375 295.859375 -314.910156 295.859375 -290.117188 C 295.859375 -276.445312 292.667969 -263.59375 286.289062 -251.5625 C 279.910156 -239.53125 270.976562 -228.957031 259.492188 -219.84375 C 248.007812 -210.730469 234.5625 -203.574219 219.160156 -198.378906 C 203.757812 -193.183594 186.941406 -190.585938 168.710938 -190.585938 L 108.554688 -190.585938 Z M 108.554688 -168.984375 L 108.554688 -214.921875 L 168.710938 -214.921875 C 188.582031 -214.921875 206.71875 -212.6875 223.125 -208.222656 C 239.53125 -203.757812 253.660156 -197.148438 265.507812 -188.398438 C 277.355469 -179.648438 286.472656 -168.847656 292.851562 -155.996094 C 299.230469 -143.144531 302.421875 -128.425781 302.421875 -111.835938 C 302.421875 -93.242188 298.683594 -76.652344 291.210938 -62.070312 C 283.738281 -47.488281 273.253906 -35.183594 259.765625 -25.15625 C 246.277344 -15.128906 230.507812 -7.519531 212.460938 -2.324219 C 194.414062 2.871094 174.816406 5.46875 153.671875 5.46875 C 137.082031 5.46875 120.496094 3.234375 103.90625 -1.230469 C 87.316406 -5.695312 72.1875 -12.625 58.515625 -22.011719 C 44.84375 -31.398438 33.859375 -43.429688 25.566406 -58.105469 C 17.273438 -72.78125 13.125 -90.324219 13.125 -110.742188 L 105.546875 -110.742188 C 105.546875 -102.355469 107.871094 -94.746094 112.519531 -87.910156 C 117.167969 -81.074219 123.410156 -75.652344 131.25 -71.640625 C 139.089844 -67.628906 147.566406 -65.625 156.679688 -65.625 C 167.980469 -65.625 177.597656 -67.765625 185.527344 -72.050781 C 193.457031 -76.335938 199.519531 -82.121094 203.710938 -89.414062 C 207.902344 -96.707031 210 -104.816406 210 -113.75 C 210 -127.238281 207.765625 -137.996094 203.300781 -146.015625 C 198.835938 -154.035156 192.363281 -159.871094 183.886719 -163.515625 C 175.410156 -167.160156 165.246094 -168.984375 153.398438 -168.984375 Z M 108.554688 -168.984375';

function svgShell(content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">\n${content}\n</svg>\n`;
}

function backgroundMarkup(colors, gradientId = 'page-gradient') {
  return `  <defs>
    <linearGradient id="${gradientId}" x1="72" y1="54" x2="954" y2="978" gradientUnits="userSpaceOnUse">
      <stop stop-color="${colors.start}"/>
      <stop offset="1" stop-color="${colors.end}"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#${gradientId})"/>`;
}

function bindingsMarkup(mark, ruleOpacity) {
  return `  <path d="M0 181H1024" stroke="${mark}" stroke-opacity="${ruleOpacity}" stroke-width="4"/>
  <rect x="228" y="54" width="56" height="140" rx="28" fill="${mark}"/>
  <rect x="740" y="54" width="56" height="140" rx="28" fill="${mark}"/>`;
}

function numberMarkup(mark) {
  return `  <g fill="${mark}" transform="translate(150 760)">
    <path d="${ONE_PATH}" transform="translate(16)"/>
    <path d="${THREE_PATH}" transform="translate(340.578125)"/>
  </g>`;
}

function foldMarkup(foldLight, foldDark) {
  return `  <path d="M820 1024C862 986 870 922 874 874C927 873 986 850 1024 820L820 1024Z" fill="${foldLight}"/>
  <path d="M884 1024L1024 884V1024H884Z" fill="${foldDark}" fill-opacity="0.88"/>`;
}

function buildMasterSvg(colors) {
  return svgShell(
    [
      backgroundMarkup(colors),
      bindingsMarkup(colors.mark, colors.ruleOpacity),
      numberMarkup(colors.mark),
      foldMarkup(colors.foldLight, colors.foldDark),
    ].join('\n'),
  );
}

function writeText(target, contents) {
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents, 'utf8');
}

function renderPng(svgPath, outputPath, size) {
  const renderDir = mkdtempSync(join(tmpdir(), '13calendar-icon-'));

  try {
    execFileSync('/usr/bin/qlmanage', ['-t', '-s', String(size), '-o', renderDir, svgPath], {
      stdio: 'ignore',
    });
    renameSync(join(renderDir, `${basename(svgPath)}.png`), outputPath);
  } finally {
    rmSync(renderDir, { recursive: true, force: true });
  }
}

function renderAppearanceSources() {
  for (const [name, colors] of Object.entries(APPEARANCES)) {
    const svgPath = join(SOURCE_DIR, `calendar-page-${name}.svg`);
    const pngPath = join(PREVIEW_DIR, `calendar-page-${name}-1024.png`);
    writeText(svgPath, buildMasterSvg(colors));
    renderPng(svgPath, pngPath, 1024);
  }
}

function writeIconComposerLayers() {
  const defaults = APPEARANCES.default;

  writeText(join(LAYER_DIR, '01-background-default.svg'), svgShell(backgroundMarkup(defaults)));
  writeText(
    join(LAYER_DIR, '01-background-dark.svg'),
    svgShell(backgroundMarkup(APPEARANCES.dark)),
  );
  writeText(
    join(LAYER_DIR, '01-background-mono.svg'),
    svgShell('  <rect width="1024" height="1024" fill="#202020"/>'),
  );
  writeText(
    join(LAYER_DIR, '02-binding-line.svg'),
    svgShell(bindingsMarkup('#ffffff', defaults.ruleOpacity)),
  );
  writeText(join(LAYER_DIR, '03-number-13.svg'), svgShell(numberMarkup('#ffffff')));
  writeText(
    join(LAYER_DIR, '04-page-fold.svg'),
    svgShell(foldMarkup(defaults.foldLight, defaults.foldDark)),
  );
}

function writeWebAssets() {
  const defaultSvg = join(SOURCE_DIR, 'calendar-page-default.svg');
  const darkSvg = join(SOURCE_DIR, 'calendar-page-dark.svg');
  const appleSizes = [120, 152, 167, 180];
  const generalSizes = [192, 512, 1024];
  const faviconSizes = [16, 32, 96, 128];

  mkdirSync(WEB_DIR, { recursive: true });
  mkdirSync(PUBLIC_ICON_DIR, { recursive: true });

  for (const size of appleSizes) {
    renderPng(defaultSvg, join(WEB_DIR, `apple-touch-icon-${size}x${size}.png`), size);
  }

  for (const size of generalSizes) {
    renderPng(defaultSvg, join(WEB_DIR, `app-icon-${size}x${size}.png`), size);
    renderPng(defaultSvg, join(WEB_DIR, `maskable-icon-${size}x${size}.png`), size);
  }

  for (const size of faviconSizes) {
    renderPng(defaultSvg, join(WEB_DIR, `favicon-${size}x${size}.png`), size);
  }

  // O favicon escuro beneficia navegadores que respeitam o atributo media.
  renderPng(darkSvg, join(WEB_DIR, 'favicon-dark-32x32.png'), 32);
  copyFileSync(defaultSvg, join(WEB_DIR, 'favicon.svg'));
  copyFileSync(defaultSvg, join(WEB_DIR, 'maskable-icon.svg'));

  // A finalidade monochrome usa somente a silhueta dos elementos essenciais;
  // o navegador escolhe a cor final quando emprega o arquivo como máscara.
  writeText(
    join(WEB_DIR, 'monochrome-icon.svg'),
    svgShell(
      `${bindingsMarkup('#000000', 1)}\n${numberMarkup('#000000')}\n${foldMarkup('#000000', '#000000')}`,
    ),
  );

  // A pasta pública recebe apenas os formatos que navegadores realmente usam.
  for (const file of readdirSync(WEB_DIR)) {
    copyFileSync(join(WEB_DIR, file), join(PUBLIC_ICON_DIR, file));
  }

  copyFileSync(
    join(WEB_DIR, 'apple-touch-icon-180x180.png'),
    join(PUBLIC_ICON_DIR, 'apple-touch-icon.png'),
  );

  execFileSync(
    '/usr/bin/sips',
    [
      '-s',
      'format',
      'ico',
      join(WEB_DIR, 'favicon-32x32.png'),
      '--out',
      join(PROJECT_ROOT, 'public', 'favicon.ico'),
    ],
    { stdio: 'ignore' },
  );
}

function main() {
  if (!existsSync('/usr/bin/qlmanage') || !existsSync('/usr/bin/sips')) {
    throw new Error('A exportação PNG requer qlmanage e sips no macOS.');
  }

  mkdirSync(SOURCE_DIR, { recursive: true });
  mkdirSync(LAYER_DIR, { recursive: true });
  mkdirSync(PREVIEW_DIR, { recursive: true });

  renderAppearanceSources();
  writeIconComposerLayers();
  writeWebAssets();
}

main();
