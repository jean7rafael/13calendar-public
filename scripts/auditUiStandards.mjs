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
const buttonVariants = ['app-action--primary', 'app-action--secondary', 'app-action--tertiary'];

for (const filePath of vueFiles) {
  const relativePath = path.relative(root, filePath);
  const source = fs.readFileSync(filePath, 'utf8');
  const inputTags = source.match(/<q-input\b[\s\S]*?>/g) || [];
  const buttonTags = source.match(/<q-btn\b[\s\S]*?>/g) || [];

  for (const inputTag of inputTags) {
    if (/\btype=["']date["']/.test(inputTag)) {
      failures.push(`${relativePath}: use AppDateInput em vez do seletor nativo type=date.`);
    }

    if (/:rules=/.test(inputTag) && !/\blazy-rules\b/.test(inputTag)) {
      failures.push(`${relativePath}: todo q-input com regras deve usar lazy-rules.`);
    }
  }

  for (const buttonTag of buttonTags) {
    const hasTextLabel = /(?:^|\s):?label=/.test(buttonTag);
    const isIconOnly = /\bround\b/.test(buttonTag);
    const isCalendarSelector = /\b(?:selector-option|calendar-today-button)\b/.test(buttonTag);
    if (!hasTextLabel || isIconOnly || isCalendarSelector) continue;

    if (!/\bapp-action\b/.test(buttonTag)) {
      failures.push(`${relativePath}: todo botão textual deve usar a classe app-action.`);
      continue;
    }

    const appliedVariants = buttonVariants.filter((variant) => buttonTag.includes(variant));
    if (appliedVariants.length !== 1) {
      failures.push(
        `${relativePath}: todo botão textual deve usar exatamente um dos três modelos compartilhados.`,
      );
    }
  }

  if (/app-primary-action/.test(source)) {
    failures.push(`${relativePath}: a classe antiga app-primary-action não pode reaparecer.`);
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
const appStyles = fs.readFileSync(path.join(sourceDirectory, 'css', 'app.scss'), 'utf8');
const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
const footer = fs.readFileSync(path.join(sourceDirectory, 'components', 'AppFooter.vue'), 'utf8');
const calendarContext = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'CalendarContextSection.vue'),
  'utf8',
);
const layout = fs.readFileSync(path.join(sourceDirectory, 'layouts', 'MainLayout.vue'), 'utf8');
const calendarTools = fs.readFileSync(path.join(sourceDirectory, 'utils', 'calendarTools.js'), 'utf8');
const comparisonDateTitle = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'AppComparisonDateTitle.vue'),
  'utf8',
);
const noticePanel = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'AppNoticePanel.vue'),
  'utf8',
);
const pageHero = fs.readFileSync(path.join(sourceDirectory, 'components', 'AppPageHero.vue'), 'utf8');
const resourcesSection = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'EducationResourcesSection.vue'),
  'utf8',
);
const widgetPage = fs.readFileSync(path.join(sourceDirectory, 'pages', 'WidgetPage.vue'), 'utf8');
const shareCard = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'ToolsShareCard.vue'),
  'utf8',
);
const birthdayCard = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'ToolsBirthdayCard.vue'),
  'utf8',
);
const educationPage = fs.readFileSync(
  path.join(sourceDirectory, 'pages', 'EducationPage.vue'),
  'utf8',
);
const dateConverter = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'EducationDateConverter.vue'),
  'utf8',
);
const localFavorites = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'ToolsLocalFavorites.vue'),
  'utf8',
);
const moonSection = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'EducationMoonSection.vue'),
  'utf8',
);
const astronomyLayers = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'ToolsAstronomyLayers.vue'),
  'utf8',
);
const productNavigation = fs.readFileSync(
  path.join(sourceDirectory, 'i18n', 'productNavigation.js'),
  'utf8',
);
const colorPaletteDocument = fs.readFileSync(
  path.join(root, 'docs', 'UI_COLOR_PALETTE.md'),
  'utf8',
);
const appDateInput = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'AppDateInput.vue'),
  'utf8',
);
const appInternationalFixedDateInput = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'AppInternationalFixedDateInput.vue'),
  'utf8',
);
const appYearInput = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'AppYearInput.vue'),
  'utf8',
);
const annualPlanner = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'ToolsAnnualPlanner.vue'),
  'utf8',
);
const calendar12 = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'Calendario12Meses.vue'),
  'utf8',
);
const calendar13 = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'Calendario13Meses.vue'),
  'utf8',
);
const holidays12 = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'Feriados12Calendario.vue'),
  'utf8',
);
const holidays13 = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'Feriados13Calendario.vue'),
  'utf8',
);
const moonPhases12 = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'Fases12Lua.vue'),
  'utf8',
);
const moonPhases13 = fs.readFileSync(
  path.join(sourceDirectory, 'components', 'Fases13Lua.vue'),
  'utf8',
);

if (!communityPage.includes('<AppProfileAvatar')) {
  failures.push('CommunityPage.vue: a vitrine deve usar AppProfileAvatar.');
}

if (!adminPage.includes('<AppProfileAvatar')) {
  failures.push('CommunityAdminPage.vue: a moderação deve usar AppProfileAvatar.');
}

for (const variant of buttonVariants) {
  if (!appStyles.includes(`.${variant}`)) {
    failures.push(`src/css/app.scss: falta o modelo compartilhado ${variant}.`);
  }
}

const publicPageNames = [
  'IndexPage.vue',
  'CommunityPage.vue',
  'PrivacyPage.vue',
  'EducationPage.vue',
  'ToolsPage.vue',
  'MoonPage.vue',
  'NewsPage.vue',
];

for (const pageName of publicPageNames) {
  const pageSource = fs.readFileSync(path.join(sourceDirectory, 'pages', pageName), 'utf8');
  if (/<AppFooter|show-context/.test(pageSource)) {
    failures.push(`${pageName}: o rodapé pertence ao layout global, não à página.`);
  }
}

const indexPage = fs.readFileSync(path.join(sourceDirectory, 'pages', 'IndexPage.vue'), 'utf8');
if (!indexPage.includes('<CalendarContextSection')) {
  failures.push('IndexPage.vue: o contexto dos dados deve permanecer na página dos calendários.');
}

for (const pageName of publicPageNames.filter(
  (name) => !['IndexPage.vue', 'MoonPage.vue'].includes(name),
)) {
  const pageSource = fs.readFileSync(path.join(sourceDirectory, 'pages', pageName), 'utf8');
  if (/CalendarContextSection|footer\.(?:title|sourcesTitle|limitationsTitle)/.test(pageSource)) {
    failures.push(`${pageName}: Datas merecem contexto pertence somente aos calendários.`);
  }
}

if (!calendarContext.includes("t('footer.title')") || !calendarContext.includes('sourcesTitle')) {
  failures.push('CalendarContextSection.vue: o contexto dos calendários ficou incompleto.');
}

if (/defineProps|showContext|footer\.(?:title|sourcesTitle|limitationsTitle)/.test(footer)) {
  failures.push('AppFooter.vue: o rodapé público deve ter uma única estrutura.');
}

if (
  !layout.includes('<AppFooter v-if="showsPublicFooter"') ||
  !layout.includes("const publicFooterRoutes = new Set")
) {
  failures.push('MainLayout.vue: o rodapé público deve ser renderizado uma vez pelo layout.');
}

const footerLinks = footer.match(/<(?:a|router-link)\b/g) || [];
if (footerLinks.length !== 4) {
  failures.push('AppFooter.vue: o rodapé deve ter exatamente quatro apontamentos.');
}

for (const requiredFooterFragment of [
  'dataSourcesLink',
  'wikipediaLink',
  'sourceCodeLink',
  'privacy.footerLink',
  'name="database"',
  'name="menu_book"',
  'name="code"',
  'name="shield"',
]) {
  if (!footer.includes(requiredFooterFragment)) {
    failures.push(`AppFooter.vue: falta o apontamento compartilhado ${requiredFooterFragment}.`);
  }
}

if (/name: '(?:home|education|tools|news|community)'/.test(footer)) {
  failures.push('AppFooter.vue: o rodapé não deve apontar para as próprias áreas do produto.');
}

const dataSourcesHref =
  'https://github.com/jean7rafael/13calendar-public/blob/main/docs/releases/README_2.0.md#fontes-de-dados-e-refer%C3%AAncias';
const sourceCodeHref = 'https://github.com/jean7rafael/13calendar-public';

if (!footer.includes(`href="${dataSourcesHref}"`)) {
  failures.push('AppFooter.vue: Fontes de dados deve abrir a seção documental da versão 2.0.');
}

if (!footer.includes(`href="${sourceCodeHref}"`)) {
  failures.push('AppFooter.vue: Código-fonte deve abrir a raiz do repositório.');
}

if (dataSourcesHref === sourceCodeHref) {
  failures.push('AppFooter.vue: Fontes de dados e Código-fonte precisam de destinos distintos.');
}

if (!layout.includes('app-toolbar-button--active') || !layout.includes('side="right"')) {
  failures.push('MainLayout.vue: a navegação precisa de estado ativo e gaveta móvel à direita.');
}

const navigationOrder = ['education', 'tools', 'home', 'moon', 'news', 'community'].map((routeName) =>
  layout.indexOf(`routeName: '${routeName}'`),
);
if (
  navigationOrder.some((position) => position < 0) ||
  navigationOrder.some((position, index) => index > 0 && position <= navigationOrder[index - 1])
) {
  failures.push(
    'MainLayout.vue: a ordem deve ser Aprenda, Ferramentas, Calendários, Lua, Notícias e Comunidade.',
  );
}

if (/news:\s*['"][^'"\n]*(?:projet|project)/iu.test(productNavigation)) {
  failures.push('productNavigation.js: o rótulo da barra deve ser somente Notícias.');
}

for (const [pageName, expectedIcon] of [
  ['IndexPage.vue', 'calendar_month'],
  ['MoonPage.vue', 'brightness_3'],
  ['NewsPage.vue', 'newspaper'],
  ['CommunityPage.vue', 'public'],
]) {
  const pageSource = fs.readFileSync(path.join(sourceDirectory, 'pages', pageName), 'utf8');
  if (!pageSource.includes('<AppPageHero') || !pageSource.includes(`icon="${expectedIcon}"`)) {
    failures.push(`${pageName}: a página deve usar AppPageHero com o ícone ${expectedIcon}.`);
  }
}

if (!pageHero.includes('var(--app-accent-purple)')) {
  failures.push('AppPageHero.vue: a esfera compartilhada deve vir da paleta oficial.');
}

for (const tone of ['purple', 'green', 'amber']) {
  if (!noticePanel.includes(`app-notice-panel--${tone}`)) {
    failures.push(`AppNoticePanel.vue: falta o tom compartilhado ${tone}.`);
  }
}

if (
  !communityPage.includes('<AppNoticePanel') ||
  !communityPage.includes('tone="green"') ||
  !resourcesSection.includes('tone="amber"')
) {
  failures.push('Os avisos de Comunidade e Notícias devem usar AppNoticePanel e a paleta semântica.');
}

for (const family of ['purple', 'green', 'amber']) {
  for (const role of ['strong', 'text', 'border', 'soft']) {
    const token = `--app-accent-${family}-${role}`;
    if (!appStyles.includes(token) || !colorPaletteDocument.includes(token)) {
      failures.push(`Paleta compartilhada: falta documentar ou declarar ${token}.`);
    }
  }

  const baseToken = `--app-accent-${family}`;
  if (!appStyles.includes(baseToken) || !colorPaletteDocument.includes(baseToken)) {
    failures.push(`Paleta compartilhada: falta documentar ou declarar ${baseToken}.`);
  }
}

if (!calendarTools.includes("replace(/-feira$/iu, '')")) {
  failures.push('calendarTools.js: a forma portuguesa destacada deve remover o sufixo -feira.');
}

if (!calendarTools.includes('export function buildDateComparisonPresentation')) {
  failures.push('calendarTools.js: falta a apresentação única para comparações de datas.');
}

if (
  !calendarTools.includes('formatInternationalFixedMonthDay') ||
  !calendarTools.includes('function composeComparisonTitle') ||
  !calendarTools.includes('splitComparisonTitle') ||
  !calendarTools.includes("replace(/\\s/gu, '\\u00a0')")
) {
  failures.push(
    'calendarTools.js: comparações devem compartilhar a ordem mês/dia do idioma e o separador central.',
  );
}

if (
  !comparisonDateTitle.includes('splitComparisonTitle') ||
  !comparisonDateTitle.includes('parts.weekday') ||
  !comparisonDateTitle.includes('parts.date') ||
  !comparisonDateTitle.includes('overflow-wrap: normal') ||
  !comparisonDateTitle.includes('word-break: normal') ||
  !comparisonDateTitle.includes('white-space: nowrap')
) {
  failures.push(
    'AppComparisonDateTitle.vue: cada linha da comparação deve permanecer inteira, sem quebrar palavras.',
  );
}

if (
  !educationPage.includes('todayComparisonFitClasses') ||
  !educationPage.includes('comparisonFitTier') ||
  !educationPage.includes('education-today__calendars--weekday-dense') ||
  !educationPage.includes('@media (max-width: 1239px)')
) {
  failures.push(
    'EducationPage.vue: os calendários devem reduzir juntos e o conjunto precisa se rearranjar antes de qualquer palavra transbordar.',
  );
}

for (const [surfaceName, source] of [
  ['WidgetPage.vue', widgetPage],
  ['ToolsShareCard.vue', shareCard],
  ['ToolsBirthdayCard.vue', birthdayCard],
  ['EducationPage.vue', educationPage],
  ['EducationDateConverter.vue', dateConverter],
]) {
  if (!source.includes('AppComparisonDateTitle')) {
    failures.push(`${surfaceName}: comparações diretas devem usar a quebra universal em duas linhas.`);
  }
}

for (const [surfaceName, source] of [
  ['WidgetPage.vue', widgetPage],
  ['ToolsShareCard.vue', shareCard],
  ['ToolsBirthdayCard.vue', birthdayCard],
  ['EducationPage.vue', educationPage],
  ['EducationDateConverter.vue', dateConverter],
  ['ToolsLocalFavorites.vue', localFavorites],
  ['EducationMoonSection.vue', moonSection],
]) {
  if (!source.includes('buildDateComparisonPresentation')) {
    failures.push(`${surfaceName}: comparações visuais devem usar a apresentação compartilhada.`);
  }
}

if (
  !widgetPage.includes('min-height: 2.5em') ||
  !widgetPage.includes('align-items: flex-end') ||
  !widgetPage.includes('justify-items: center') ||
  !widgetPage.includes('white-space: normal') ||
  !widgetPage.includes('comparisonYear')
) {
  failures.push(
    'WidgetPage.vue: rótulos, quebras lógicas e ano devem permanecer alinhados nos dois lados.',
  );
}

if (!astronomyLayers.includes('`${presentation.title} · ${presentation.year}`')) {
  failures.push('ToolsAstronomyLayers.vue: a data IFC deve preservar o ano exibido no evento.');
}

if (
  !astronomyLayers.includes('align-items: stretch') ||
  !astronomyLayers.includes('height: 100%') ||
  !astronomyLayers.includes('height: auto') ||
  !astronomyLayers.includes('grid-template-rows: repeat(7, minmax(0, 1fr))') ||
  !astronomyLayers.includes('grid-template-rows: repeat(6, minmax(0, 1fr))')
) {
  failures.push(
    'ToolsAstronomyLayers.vue: os cards devem igualar a altura, distribuir sete faixas e voltar ao natural empilhados.',
  );
}

for (const [surfaceName, source] of [
  ['EducationDateConverter.vue', dateConverter],
  ['ToolsShareCard.vue', shareCard],
  ['ToolsBirthdayCard.vue', birthdayCard],
  ['ToolsAstronomyLayers.vue', astronomyLayers],
  ['ToolsLocalFavorites.vue', localFavorites],
]) {
  if (!source.includes('<AppDateInput')) {
    failures.push(`${surfaceName}: datas digitáveis devem usar AppDateInput.`);
  }
}

for (const [surfaceName, source] of [
  ['EducationDateConverter.vue', dateConverter],
  ['ToolsBirthdayCard.vue', birthdayCard],
  ['ToolsAstronomyLayers.vue', astronomyLayers],
  ['ToolsAnnualPlanner.vue', annualPlanner],
  ['EducationMoonSection.vue', moonSection],
]) {
  if (!source.includes('<AppYearInput')) {
    failures.push(`${surfaceName}: anos isolados devem usar AppYearInput.`);
  }
}

if (!birthdayCard.includes('month-day-only')) {
  failures.push('ToolsBirthdayCard.vue: o nascimento escolhe somente dia e mês.');
}

if (!birthdayCard.includes(':reference-year="celebrationYear"')) {
  failures.push(
    'ToolsBirthdayCard.vue: o seletor de dia e mês deve usar o ano da comemoração como referência.',
  );
}

if (birthdayCard.indexOf('<AppYearInput') > birthdayCard.indexOf('<AppDateInput')) {
  failures.push(
    'ToolsBirthdayCard.vue: o ano deve ser escolhido antes do dia e do mês.',
  );
}

if (!appDateInput.includes('effectiveReferenceYear')) {
  failures.push('AppDateInput.vue: o modo dia/mês deve respeitar o ano de referência.');
}

if (
  !dateConverter.includes('<AppInternationalFixedDateInput') ||
  !dateConverter.includes('disable: !fixedYearIsLeap.value') ||
  !dateConverter.includes("fixedKind.value === 'leap-day'") ||
  !dateConverter.includes('isGregorianLeapYear') ||
  !dateConverter.includes('education-converter__fixed-fields--reserved') ||
  !dateConverter.includes('visibility: hidden')
) {
  failures.push(
    'EducationDateConverter.vue: a data IFC deve usar o seletor compartilhado, bloquear o Dia Bissexto em anos comuns e preservar a altura dos controles.',
  );
}

if (
  !appInternationalFixedDateInput.includes('v-for="dayOption in 28"') ||
  !appInternationalFixedDateInput.includes('pickerMonth >= 13') ||
  !appInternationalFixedDateInput.includes('hide-bottom-space')
) {
  failures.push(
    'AppInternationalFixedDateInput.vue: o seletor IFC deve oferecer 13 meses, 28 dias e um único campo alinhado.',
  );
}

if (/:hint=|formatHint/.test(appDateInput)) {
  failures.push('AppDateInput.vue: a dica inferior não deve desalinhár os formulários.');
}

if (!appDateInput.includes('hide-bottom-space') || !appYearInput.includes('hide-bottom-space')) {
  failures.push('Seletores compartilhados: o espaço inferior invisível não deve desalinhár linhas.');
}

if (
  !localFavorites.includes('align-items: start') ||
  !localFavorites.includes('min-height: 56px')
) {
  failures.push('ToolsLocalFavorites.vue: campos e ação devem começar e terminar alinhados.');
}

for (const [componentName, source] of [
  ['AppDateInput.vue', appDateInput],
  ['AppInternationalFixedDateInput.vue', appInternationalFixedDateInput],
  ['AppYearInput.vue', appYearInput],
]) {
  if (!source.includes('app-picker-popup-shell')) {
    failures.push(`${componentName}: o popup deve remover a borda fantasma externa.`);
  }
}

if (!appStyles.includes('.app-picker-popup-shell')) {
  failures.push('src/css/app.scss: falta a superfície única dos seletores compartilhados.');
}

for (const [surfaceName, source] of [
  ['Feriados12Calendario.vue', holidays12],
  ['Feriados13Calendario.vue', holidays13],
  ['Fases12Lua.vue', moonPhases12],
  ['Fases13Lua.vue', moonPhases13],
]) {
  if (!source.includes('<CalendarEquivalentDateTooltip')) {
    failures.push(`${surfaceName}: falta a equivalência com o calendário oposto.`);
  }
}

for (const [surfaceName, source] of [
  ['Feriados12Calendario.vue', holidays12],
  ['Fases12Lua.vue', moonPhases12],
]) {
  if (!source.includes('calendar-label="IFC"')) {
    failures.push(`${surfaceName}: a tooltip do calendário fixo deve usar somente IFC.`);
  }
}

for (const [surfaceName, source] of [
  ['Calendario12Meses.vue', calendar12],
  ['Calendario13Meses.vue', calendar13],
]) {
  if (!source.includes('<CalendarTodayButton')) {
    failures.push(`${surfaceName}: ambos os calendários devem oferecer o mesmo botão Hoje.`);
  }
}

if (
  !indexPage.includes('showFixedCalendarMobile') ||
  !indexPage.includes('calendar-column--active') ||
  !indexPage.includes('calendar-mobile-view-switch') ||
  !indexPage.includes('calendar.mobileComparisonHint') ||
  !indexPage.includes('screen_rotation')
) {
  failures.push(
    'IndexPage.vue: o seletor móvel deve manter cada calendário com seus cards e orientar a comparação lado a lado.',
  );
}

if (
  !agents.includes('app-action--secondary') ||
  !agents.includes('não usam o sufixo `-feira`') ||
  !agents.includes('docs/UI_COLOR_PALETTE.md') ||
  !agents.includes('Nunca use o seletor nativo `type="date"`') ||
  !agents.includes('abreviatura `IFC`')
) {
  failures.push(
    'AGENTS.md: as regras de botões, dias comparativos e paleta precisam permanecer documentadas.',
  );
}

if (failures.length) {
  console.error('A auditoria da interface encontrou divergências:\n');
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    'Padrões da interface auditados: formulários, avatares, datas e imagens, cores, avisos, botões, navegação e rodapé.',
  );
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
