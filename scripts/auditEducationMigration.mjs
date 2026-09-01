import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { educationNews, educationSites } from '../src/data/educationResources.js';
import { educationMessages } from '../src/i18n/education.js';
import { localizedEditorialMessages } from '../src/i18n/educationEditorialTranslations.js';
import { educationHistoryReferenceTranslations } from '../src/i18n/educationHistoryReferenceTranslations.js';
import { educationFeedbackTranslations } from '../src/i18n/educationFeedbackTranslations.js';
import { educationReferenceCopyTranslations } from '../src/i18n/educationReferenceCopyTranslations.js';
import { educationMoonMethodologyTranslations } from '../src/i18n/educationMoonMethodologyTranslations.js';
import {
  localizedResourceLanguageLabels,
  localizedResourceSummaries,
} from '../src/i18n/educationResourceTranslations.js';
import { localizedToolMessages } from '../src/i18n/educationToolsTranslations.js';
import { educationSabbathTranslations } from '../src/i18n/educationSabbathTranslations.js';
import { educationPlanningTranslations } from '../src/i18n/educationPlanningTranslations.js';
import { educationYearMapTranslations } from '../src/i18n/educationYearMapTranslations.js';
import { educationHolidayTranslations } from '../src/i18n/educationHolidayTranslations.js';
import { productNavigationMessages } from '../src/i18n/productNavigation.js';
import { plannerExtensionMessages } from '../src/i18n/plannerTranslations.js';

/* ===========================================================
   AUDITORIA DA EXPERIÊNCIA EDUCACIONAL NATIVA

   A migração deixa de ser uma sequência manual: esta verificação
   protege rota, componentes, cálculo compartilhado, votação,
   curadoria, idiomas, redirecionamento e descoberta por buscadores.
=========================================================== */

const expectedLocales = [
  'pt-BR',
  'en-US',
  'fr-FR',
  'es-ES',
  'de-DE',
  'ru-RU',
  'it-IT',
  'zh-CN',
  'ja-JP',
  'ar-SA',
  'hi-IN',
  'ko-KR',
];
const expectedPositions = {
  'en-US': 'Month {month} of 13 · Week {week} of 4',
  'pt-BR': 'Mês {month} de 13 · Semana {week} de 4',
  'es-ES': 'Mes {month} de 13 · Semana {week} de 4',
  'fr-FR': 'Mois {month} sur 13 · Semaine {week} sur 4',
  'de-DE': 'Monat {month} von 13 · Woche {week} von 4',
  'it-IT': 'Mese {month} di 13 · Settimana {week} di 4',
  'ru-RU': 'Месяц {month} из 13 · Неделя {week} из 4',
  'zh-CN': '月份 {month}/13 · 周 {week}/4',
  'ja-JP': '月 {month}/13 · 週 {week}/4',
  'ar-SA': 'الشهر {month} من 13 · الأسبوع {week} من 4',
  'hi-IN': '13 में से महीना {month} · 4 में से सप्ताह {week}',
  'ko-KR': '월 {month}/13 · 주 {week}/4',
};
const expectedPlannerPrintPdfLabels = {
  'en-US': 'Print PDF',
  'pt-BR': 'Imprimir PDF',
  'es-ES': 'Imprimir PDF',
  'fr-FR': 'Imprimer le PDF',
  'de-DE': 'PDF drucken',
  'it-IT': 'Stampa PDF',
  'ru-RU': 'Печать PDF',
  'zh-CN': '打印 PDF',
  'ja-JP': 'PDFを印刷',
  'ar-SA': 'طباعة PDF',
  'hi-IN': 'PDF प्रिंट करें',
  'ko-KR': 'PDF 인쇄',
};

const [
  packageSource,
  routesSource,
  routerSource,
  layoutSource,
  pageSource,
  converterSource,
  moonSource,
  moonEngineSource,
  feedbackSource,
  resourcesSource,
  sitemapSource,
  redirectsSource,
  quasarSource,
  toolsPageSource,
  shareSource,
  birthdaySource,
  plannerSource,
  astronomySource,
  favoritesSource,
  widgetConfiguratorSource,
  pwaCardSource,
  editorialSource,
  widgetPageSource,
  calendarToolsSource,
  pwaBootSource,
  serviceWorkerSource,
  manifestSource,
  headersSource,
  analyticsSource,
  indexSource,
  newsPageSource,
  productNavigationSource,
  historySectionSource,
  sabbathSectionSource,
  fiscalAcademicSectionSource,
  yearBoundarySectionSource,
  holidayRhythmSectionSource,
  contentCardSource,
  closingNoticeSource,
  implementationSectionSource,
  feedbackStoreSource,
  moonPageSource,
  contextSectionSource,
  plannerPdfSource,
] = await Promise.all([
  read('../package.json'),
  read('../src/router/routes.ts'),
  read('../src/router/index.ts'),
  read('../src/layouts/MainLayout.vue'),
  read('../src/pages/EducationPage.vue'),
  read('../src/components/EducationDateConverter.vue'),
  read('../src/components/EducationMoonSection.vue'),
  read('../src/utils/fasesLua.js'),
  read('../src/components/EducationFeedback.vue'),
  read('../src/data/educationResources.js'),
  read('../public/sitemap.xml'),
  read('../public/_redirects'),
  read('../quasar.config.ts'),
  read('../src/pages/ToolsPage.vue'),
  read('../src/components/ToolsShareCard.vue'),
  read('../src/components/ToolsBirthdayCard.vue'),
  read('../src/components/ToolsAnnualPlanner.vue'),
  read('../src/components/ToolsAstronomyLayers.vue'),
  read('../src/components/ToolsLocalFavorites.vue'),
  read('../src/components/ToolsWidgetConfigurator.vue'),
  read('../src/components/ToolsPwaCard.vue'),
  read('../src/components/ToolsEditorialCards.vue'),
  read('../src/pages/WidgetPage.vue'),
  read('../src/utils/calendarTools.js'),
  read('../src/boot/pwa.js'),
  read('../public/sw.js'),
  read('../public/manifest.webmanifest'),
  read('../public/_headers'),
  read('../src/boot/cloudflareAnalytics.js'),
  read('../index.html'),
  read('../src/pages/NewsPage.vue'),
  read('../src/i18n/productNavigation.js'),
  read('../src/components/EducationHistorySection.vue'),
  read('../src/components/EducationSabbathSection.vue'),
  read('../src/components/EducationFiscalAcademicSection.vue'),
  read('../src/components/EducationYearBoundarySection.vue'),
  read('../src/components/EducationHolidayRhythmSection.vue'),
  read('../src/components/EducationContentCard.vue'),
  read('../src/components/EducationClosingNotice.vue'),
  read('../src/components/EducationImplementationSection.vue'),
  read('../src/composables/useEducationFeedbackStore.js'),
  read('../src/pages/MoonPage.vue'),
  read('../src/components/CalendarContextSection.vue'),
  read('../src/utils/plannerPdf.js'),
]);

const packageJson = JSON.parse(packageSource);

assert.ok(packageJson.dependencies.html2canvas);
assert.equal(packageJson.dependencies.jspdf, undefined);

assert.match(
  routesSource,
  /path: ''[\s\S]{0,120}name: 'home'[\s\S]{0,160}pages\/IndexPage\.vue/,
  'A raiz do site deve abrir a página dos calendários sem alterar a ordem da navegação.',
);
assert.match(routesSource, /path: 'learn'[\s\S]*name: 'education'/);
assert.match(quasarSource, /buttonLayout/);
assert.match(routesSource, /path: 'moon'[\s\S]*name: 'moon'/);
assert.match(pageSource, /<EducationDateConverter\s*\/>/);
assert.doesNotMatch(pageSource, /<EducationMoonSection\s*\/>/);
assert.match(pageSource, /<EducationFiscalAcademicSection\s*\/>/);
assert.match(pageSource, /<EducationYearBoundarySection\s*\/>/);
assert.match(pageSource, /<EducationHolidayRhythmSection\s*\/>/);
assert.ok(
  pageSource.indexOf('<EducationSabbathSection') <
    pageSource.indexOf('<EducationFiscalAcademicSection') &&
    pageSource.indexOf('<EducationFiscalAcademicSection') <
      pageSource.indexOf('<EducationYearBoundarySection') &&
    pageSource.indexOf('<EducationYearBoundarySection') <
      pageSource.indexOf('<EducationHolidayRhythmSection') &&
    pageSource.indexOf('<EducationHolidayRhythmSection') <
      pageSource.indexOf('<EducationImplementationSection'),
  'As soluções fiscal, acadêmica, anual e de feriados devem ficar entre o Sabá e a contribuição pública.',
);
assert.match(pageSource, /<EducationFeedback\s*\/>/);
assert.match(pageSource, /<EducationHistorySection\s*\/>/);
assert.match(pageSource, /<EducationSabbathSection\s*\/>/);
assert.match(pageSource, /<EducationImplementationSection\s*\/>/);
assert.doesNotMatch(pageSource, /<EducationResourcesSection\s*\/>/);
assert.match(pageSource, /canonicalUrl = 'https:\/\/13calendar\.pages\.dev\/learn'/);
assert.match(pageSource, /application\/ld\+json/);
assert.match(pageSource, /education\.hero\.yourCalendar/);
assert.match(pageSource, /education\.hero\.daysThisMonth/);
assert.match(pageSource, /education\.hero\.daysEveryMonth/);
assert.match(pageSource, /education-month-grid__day--sunday/);
assert.match(pageSource, /education-year__calculation/);
assert.match(pageSource, /education\.idea\.monthFootnote/);
assert.match(pageSource, /app-action app-action--tertiary/);
assert.match(pageSource, /education-today__summary-middle/);
assert.match(pageSource, /education-today__summary-last/);
assert.match(pageSource, /calc\(\(100vw - 1740px\) \/ 2\)/);
assert.match(pageSource, /@media \(max-width: 1579px\)/);
assert.match(pageSource, /@media \(max-width: 860px\)/);
assert.match(pageSource, /@media \(max-width: 1239px\)/);

const sabbathPosition = pageSource.indexOf('<EducationSabbathSection />');
const implementationPosition = pageSource.indexOf('<EducationImplementationSection />');
const feedbackPosition = pageSource.indexOf('<EducationFeedback />');
assert.ok(
  sabbathPosition < implementationPosition && implementationPosition < feedbackPosition,
  'A resolução de implantação deve permanecer logo depois do Sabá e antes da votação.',
);

assert.match(historySectionSource, /education\.history\.faqs/);
assert.match(historySectionSource, /education-history-reference__timeline/);
assert.match(historySectionSource, /id="kodak-fact"/);
assert.match(sabbathSectionSource, /educationSabbathTranslations/);
assert.match(sabbathSectionSource, /id="education-sabbath"/);
assert.match(sabbathSectionSource, /jta\.org/);
assert.match(sabbathSectionSource, /un\.org/);
assert.equal(
  (sabbathSectionSource.match(/number: 1/g) || []).length,
  2,
  'Os dois cards da coluna esquerda do Sabá devem pertencer à opção 1.',
);
assert.equal(
  (sabbathSectionSource.match(/number: 2/g) || []).length,
  2,
  'Os dois cards da coluna direita do Sabá devem pertencer à opção 2.',
);
for (const sectionSource of [
  sabbathSectionSource,
  fiscalAcademicSectionSource,
  yearBoundarySectionSource,
  holidayRhythmSectionSource,
]) {
  assert.match(
    sectionSource,
    /<EducationClosingNotice/,
    'As quatro seções de solução devem terminar com o mesmo aviso editorial compacto.',
  );
}
for (const sectionSource of [
  implementationSectionSource,
  fiscalAcademicSectionSource,
  yearBoundarySectionSource,
]) {
  assert.match(
    sectionSource,
    /<EducationContentCard/,
    'As seções com cards coloridos devem reutilizar o componente de conteúdo responsivo.',
  );
  assert.match(sectionSource, /education-content-card-grid/);
}
assert.match(contentCardSource, /container: education-content-card \/ inline-size/);
assert.match(contentCardSource, /min-height: var\(--content-card-min-height, 0px\)/);
assert.match(contentCardSource, /height: auto !important/);
assert.match(contentCardSource, /@container education-content-card \(max-width: 330px\)/);
assert.doesNotMatch(closingNoticeSource, /EducationContentCard|education-content-card-grid/);
assert.match(closingNoticeSource, /font-size: 12px/);
assert.match(closingNoticeSource, /\['purple', 'green', 'pink', 'amber'\]/);
assert.match(fiscalAcademicSectionSource, /v-model="planningMode"/);
assert.match(fiscalAcademicSectionSource, /v-model="academicPeriod"/);
assert.match(fiscalAcademicSectionSource, /v-model="hemisphere"/);
assert.match(fiscalAcademicSectionSource, /months13Long, months13Short/);
assert.match(fiscalAcademicSectionSource, /seasonEvents/);
assert.match(fiscalAcademicSectionSource, /penultimateQuarterWeeks = \[12, 25, 38, 51\]/);
assert.match(
  fiscalAcademicSectionSource,
  /if \(planningMode\.value === 'fiscal'\) return activeSeasonLegend\.value\[period - 1\]\?\.tone/,
  'O trimestre fiscal completo deve herdar a cor da estação ligada ao seu marco.',
);
assert.match(
  fiscalAcademicSectionSource,
  /\? \['autumn', 'winter', 'spring', 'summer'\][\s\S]{0,90}: \['spring', 'summer', 'autumn', 'winter'\]/,
  'Bimestres e trimestres escolares devem seguir a sequência cromática de cada hemisfério.',
);
assert.match(fiscalAcademicSectionSource, /semester: \[sequence\[0\], sequence\[2\]\]/);
assert.doesNotMatch(
  fiscalAcademicSectionSource,
  /education-year-map__(?:__week--season|__legend-color)--blue/,
  'A camada escolar deve reutilizar o roxo oficial, não o azul do calendário.',
);
assert.match(fiscalAcademicSectionSource, /education-year-map__week--season-autumn/);
assert.match(fiscalAcademicSectionSource, /education-year-map__week--season-winter/);
assert.match(fiscalAcademicSectionSource, /education-year-map__week--season-spring/);
assert.match(fiscalAcademicSectionSource, /education-year-map__week--season-summer/);
assert.doesNotMatch(
  fiscalAcademicSectionSource,
  /education-year-map__season-marker\s*\{[^}]*\bborder\s*:/,
  'O emoji sazonal deve permanecer pequeno e sem cápsula ou contorno.',
);
assert.match(fiscalAcademicSectionSource, /teachingWeek <= 13/);
assert.match(fiscalAcademicSectionSource, /teachingWeek <= 27/);
assert.match(
  fiscalAcademicSectionSource,
  /monthNumber === 1 \|\| monthNumber === 7 \|\| monthNumber === 13/,
);
assert.match(holidayRhythmSectionSource, /day === 2/);
assert.match(holidayRhythmSectionSource, /day === 27/);
assert.match(implementationSectionSource, /id="education-implementation"/);
assert.match(implementationSectionSource, /EducationAttributionDialog/);
assert.match(implementationSectionSource, /kind: 'response'/);
assert.match(moonPageSource, /<AppPageHero/);
assert.match(moonPageSource, /<EducationMoonSection\s+:show-heading="false"\s*\/>/);
assert.match(moonPageSource, /<CalendarContextSection/);
assert.match(moonPageSource, /education\.sources\.productRoadmap/);
assert.match(moonPageSource, /education\.sources\.nasaMethodText/);
assert.match(moonPageSource, /education\.sources\.calendarMethodText/);
assert.match(moonPageSource, /education\.sources\.productMethodText/);
assert.match(contextSectionSource, /resolvedTopics/);

assert.match(converterSource, /internationalFixedCalendar/);
assert.match(moonSource, /buildDateComparisonPresentation/);
assert.match(moonSource, /obterFasesLuaDoAno/);
assert.match(moonEngineSource, /astronomy-engine/);
assert.match(feedbackStoreSource, /getCommunityApiUrl\('feedback\/votes'\)/);
assert.match(feedbackStoreSource, /13calendar-reference-feedback-voter/);
assert.match(feedbackSource, /education\.feedback\.(?:loadError|saveError)/);
assert.match(feedbackSource, /shareResults/);
assert.match(feedbackSource, /createAbsoluteRouteUrl\('\/learn'\)/);

assert.match(layoutSource, /routeName: 'education'/);
assert.match(layoutSource, /routeName: 'moon'/);
assert.match(layoutSource, /routeName: 'news'/);
assert.match(layoutSource, /usesLanguageOnlyDrawer/);
assert.match(layoutSource, /const publicMetadata = computed/);
assert.match(layoutSource, /ogDescription/);
assert.match(layoutSource, /canonical: \{ rel: 'canonical'/);
assert.doesNotMatch(layoutSource, /reference-site|referenceSiteUrl/);
assert.match(indexSource, /<meta property="og:site_name" content="13 Calendar" \/>/);
assert.match(indexSource, /"@type": "WebSite"/);
assert.match(indexSource, /"alternateName": \["13Calendar", "13calendar\.pages\.dev"\]/);
assert.match(quasarSource, /vueRouterMode: 'history'/);
assert.match(routerSource, /window\.location\.hash\.startsWith\('#\/'\)/);
assert.match(routesSource, /path: 'tools'[\s\S]*name: 'tools'/);
assert.match(routesSource, /path: 'news'[\s\S]*name: 'news'/);
assert.match(routesSource, /path: '\/widget'[\s\S]*name: 'widget'/);
assert.match(newsPageSource, /<EducationResourcesSection\b[^>]*\/>/);
assert.match(layoutSource, /<AppFooter v-if="showsPublicFooter"\s*\/>/);
assert.match(newsPageSource, /'@type': 'CollectionPage'/);
assert.match(layoutSource, /productNavigationItems/);
assert.match(layoutSource, /app-toolbar-button--active/);
assert.match(layoutSource, /side="right"/);
assert.match(productNavigationSource, /news:/);
assert.match(productNavigationSource, /moon:/);

assert.equal(
  packageJson.scripts.prebuild,
  'npm run holidays:runtime',
  'A página incorporada não deve voltar ao build principal.',
);
assert.doesNotMatch(sitemapSource, /reference-site/);
assert.match(sitemapSource, /<loc>https:\/\/13calendar\.pages\.dev\/learn<\/loc>/);
assert.match(sitemapSource, /<loc>https:\/\/13calendar\.pages\.dev\/tools<\/loc>/);
assert.match(sitemapSource, /<loc>https:\/\/13calendar\.pages\.dev\/moon<\/loc>/);
assert.match(sitemapSource, /<loc>https:\/\/13calendar\.pages\.dev\/news<\/loc>/);
assert.doesNotMatch(sitemapSource, /\/widget<\/loc>/);
assert.match(redirectsSource, /^\/reference-site\/\* \/learn 302$/m);

/* O arquivo histórico de proveniência não pode voltar a ser publicado nem
   participar do produto independente. */
await assert.rejects(
  access(new URL('../public/reference-site/index.html', import.meta.url)),
  undefined,
  'A cópia compilada antiga não deve existir em public/reference-site.',
);

/* ===========================================================
   FERRAMENTAS NATIVAS E UMA ÚNICA FONTE DE CÁLCULO
=========================================================== */

for (const componentName of [
  'ToolsShareCard',
  'ToolsBirthdayCard',
  'ToolsEditorialCards',
  'ToolsAnnualPlanner',
  'ToolsAstronomyLayers',
  'ToolsLocalFavorites',
  'ToolsWidgetConfigurator',
  'ToolsPwaCard',
]) {
  assert.match(toolsPageSource, new RegExp(`<${componentName}\\s*\\/>`));
}

assert.match(toolsPageSource, /canonicalUrl = 'https:\/\/13calendar\.pages\.dev\/tools'/);
assert.match(toolsPageSource, /'@type': 'WebApplication'/);
assert.match(calendarToolsSource, /shared\/internationalFixedCalendar\.js/);
assert.match(calendarToolsSource, /gregorianPartsToInternationalFixed/);
assert.match(calendarToolsSource, /internationalFixedPartsToGregorian/);

assert.match(shareSource, /canvasToBlob/);
assert.match(shareSource, /navigator\.share/);
assert.match(shareSource, /https:\/\/wa\.me/);
assert.match(shareSource, /facebook\.com\/sharer/);
assert.match(shareSource, /twitter\.com\/intent\/tweet/);
assert.match(shareSource, /t\.me\/share\/url/);
assert.match(shareSource, /fabWhatsapp/);
assert.match(shareSource, /fabFacebook/);
assert.match(shareSource, /fabXTwitter/);
assert.match(shareSource, /fabTelegram/);
/* O grupo social não pode voltar a depender do encaixe flexível: ele mantém
   duas colunas até chegar à faixa móvel realmente estreita. */
assert.match(shareSource, /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
assert.match(shareSource, /@media \(max-width:\s*340px\)/);
assert.match(shareSource, /margin-top:\s*auto/);
assert.match(shareSource, /route\.query\.date/);
assert.match(birthdaySource, /route\.query\.birth/);
assert.match(birthdaySource, /route\.query\.year/);
assert.match(birthdaySource, /canvasToBlob/);
assert.match(plannerSource, /createAnnualPlannerIcs/);
assert.match(plannerSource, /createAnnualPlannerPdf/);
assert.match(plannerSource, /pdfDialogOpen/);
assert.match(plannerSource, /education\.tools\.planner\.openAgenda/);
assert.match(plannerSource, /education\.tools\.planner\.agendaSoon/);
assert.match(plannerSource, /aria-disabled="true"/);
assert.match(plannerSource, /showAgendaAvailability/);
assert.doesNotMatch(
  plannerSource.match(/<q-btn[\s\S]*?education\.tools\.planner\.openAgenda[\s\S]*?<\/q-btn>/)?.[0] || '',
  /\b(?:href|to)=/,
  'A Agenda futura deve continuar sem rota ou endereço até o produto independente existir.',
);
assert.doesNotMatch(plannerSource, /window\.print\(\)|printing-annual-planner/);
assert.match(plannerPdfSource, /ANNUAL_PLANNER_PAGE_COUNT = 40/);
assert.match(plannerPdfSource, /pageElements\.length !== ANNUAL_PLANNER_PAGE_COUNT/);
assert.match(plannerPdfSource, /\/MediaBox \[0 0 595\.28 841\.89\]/);
assert.match(plannerPdfSource, /\/Filter \/DCTDecode/);
assert.match(astronomySource, /from 'astronomy-engine'/);
assert.match(astronomySource, /navigator\.geolocation\.getCurrentPosition/);
assert.match(astronomySource, /education\.tools\.astronomy\.locationText/);
assert.match(favoritesSource, /localStorage\.getItem/);
assert.match(favoritesSource, /localStorage\.setItem/);
assert.doesNotMatch(favoritesSource, /\bfetch\s*\(/);
assert.match(editorialSource, /canvasToBlob/);

for (const source of [shareSource, birthdaySource, plannerSource, astronomySource]) {
  assert.doesNotMatch(
    source,
    /(?:dayOfYear|Math\.floor\([^\n]*\/\s*28|364\s*[-+])/,
    'As ferramentas devem reutilizar o motor compartilhado, não recriar a fórmula IFC.',
  );
}

/* ===========================================================
   WIDGET, PRIVACIDADE E ACESSO OFFLINE
=========================================================== */

assert.match(widgetConfiguratorSource, /<iframe/);
assert.match(widgetConfiguratorSource, /createAbsoluteRouteUrl\('\/widget'/);
assert.match(widgetPageSource, /name: 'robots', content: 'noindex, follow'/);
assert.match(widgetPageSource, /buildDateComparisonPresentation/);
assert.match(headersSource, /^\/widget\*/m);
assert.match(headersSource, /! X-Frame-Options/);
assert.match(headersSource, /Content-Security-Policy: frame-ancestors \*/);
assert.match(headersSource, /X-Robots-Tag: noindex/);
assert.match(analyticsSource, /currentPath\.endsWith\('\/widget'\)/);

assert.match(quasarSource, /['"]pwa['"]/);
assert.match(quasarSource, /APP_RELEASE_ID/);
assert.match(pwaBootSource, /navigator\.serviceWorker\.register/);
assert.match(pwaBootSource, /process\.env\.PROD/);
assert.match(pwaBootSource, /searchParams\.set\('release'/);
assert.match(pwaBootSource, /updateViaCache: 'none'/);
assert.match(pwaBootSource, /registration\.update\(\)/);
assert.match(pwaBootSource, /beforeinstallprompt/);
assert.match(pwaCardSource, /calendar-install-available/);
assert.doesNotMatch(
  pwaCardSource,
  /:disable="!installAvailable"/,
  'O acesso às instruções de instalação deve continuar disponível sem o prompt nativo.',
);
assert.match(pwaCardSource, /showsInstallHelp/);
assert.match(pwaCardSource, /navigator\.share/);
assert.match(pwaCardSource, /navigator\.standalone/);
assert.match(pwaCardSource, /iosSafari/);
assert.match(pageSource, /grid-template-rows: repeat\(4, minmax\(18px, 1fr\)\)/);
assert.match(serviceWorkerSource, /CACHE_NAME/);
assert.match(serviceWorkerSource, /request\.mode === 'navigate'/);
assert.match(serviceWorkerSource, /networkFirst/);
assert.match(serviceWorkerSource, /\['script', 'style', 'worker'\]/);
assert.match(headersSource, /^\/sw\.js$/m);
assert.match(headersSource, /no-store, no-cache, must-revalidate/);
assert.match(indexSource, /rel="manifest" href="manifest\.webmanifest"/);
assert.doesNotMatch(indexSource, /<link rel="canonical"/);
assert.doesNotMatch(indexSource, /<meta name="description"/);
const manifest = JSON.parse(manifestSource);
assert.equal(manifest.display, 'standalone');
assert.ok(['./', '/'].includes(manifest.start_url));

for (const domain of [
  '13months.net',
  '13cal.net',
  'fixedcalendar.org',
  'cal.com',
  'reddit.com',
  'aventurasnahistoria.com.br',
  'scribd.com',
  'yearzerochange.org',
]) {
  assert.match(resourcesSource, new RegExp(domain.replace('.', '\\.')));
}

const curatedResources = [...educationNews, ...educationSites];
const resourceIds = curatedResources.map(({ id }) => id);
const editorialLocales = expectedLocales.filter((locale) => !['en-US', 'pt-BR'].includes(locale));
assert.equal(new Set(resourceIds).size, resourceIds.length, 'Cada referência precisa de ID único.');
assert.deepEqual(Object.keys(localizedResourceSummaries).sort(), editorialLocales.sort());
assert.deepEqual(Object.keys(localizedResourceLanguageLabels).sort(), expectedLocales.sort());

for (const locale of editorialLocales) {
  assert.deepEqual(Object.keys(localizedResourceSummaries[locale]).sort(), resourceIds.sort());

  for (const item of curatedResources) {
    assert.notEqual(
      localizedResourceSummaries[locale][item.id],
      item.summary.en,
      `${locale}: o resumo editorial de ${item.id} não pode voltar ao inglês.`,
    );
  }
}

for (const item of curatedResources) {
  assert.notEqual(
    item.summary.pt,
    item.summary.en,
    `pt-BR: o resumo editorial de ${item.id} não pode voltar ao inglês.`,
  );
  assert.ok(item.languageKey, `${item.id}: o idioma original precisa de um rótulo localizado.`);
}

for (const locale of expectedLocales) {
  assert.deepEqual(
    Object.keys(localizedResourceLanguageLabels[locale]).sort(),
    ['english', 'englishAndTranslations', 'multiple', 'portuguese'].sort(),
  );
}

assert.deepEqual(Object.keys(educationMessages).sort(), expectedLocales.sort());
assert.deepEqual(Object.keys(productNavigationMessages).sort(), expectedLocales.sort());
assert.deepEqual(Object.keys(educationReferenceCopyTranslations).sort(), expectedLocales.sort());
assert.deepEqual(Object.keys(educationHistoryReferenceTranslations).sort(), expectedLocales.sort());
assert.deepEqual(Object.keys(educationSabbathTranslations).sort(), expectedLocales.sort());
assert.deepEqual(Object.keys(educationPlanningTranslations).sort(), expectedLocales.sort());
assert.deepEqual(Object.keys(educationYearMapTranslations).sort(), expectedLocales.sort());
assert.deepEqual(Object.keys(educationHolidayTranslations).sort(), expectedLocales.sort());
assert.deepEqual(Object.keys(educationFeedbackTranslations).sort(), expectedLocales.sort());
assert.deepEqual(Object.keys(educationMoonMethodologyTranslations).sort(), expectedLocales.sort());
assert.deepEqual(Object.keys(plannerExtensionMessages).sort(), expectedLocales.sort());

for (const locale of expectedLocales) {
  assertSameShape(educationMessages['en-US'], educationMessages[locale], locale);
  assert.equal(educationMessages[locale].feedback.options.length, 4);
  assert.equal(educationMessages[locale].idea.facts.length, 5);
  assert.equal(educationMessages[locale].history.events.length, 6);
  assert.equal(educationMessages[locale].history.faqs.length, 6);
  assert.equal(
    educationMessages[locale].converter.position,
    expectedPositions[locale],
    `${locale}: a posição precisa usar números cardinais em uma única frase.`,
  );
  assert.equal(
    educationMessages[locale].tools.planner.printPdf,
    expectedPlannerPrintPdfLabels[locale],
    `${locale}: a ação do planejador deve manter o rótulo curto de impressão em PDF.`,
  );
  assert.ok(productNavigationMessages[locale].news);
  assert.ok(productNavigationMessages[locale].moon);
  assert.ok(educationSabbathTranslations[locale].solutionTitle);
  assert.ok(educationSabbathTranslations[locale].solutionHighlight);
  assert.ok(educationSabbathTranslations[locale].civilHighlight);
  assert.ok(educationSabbathTranslations[locale].continuousHighlight);
  assert.ok(educationSabbathTranslations[locale].limitationText);
  assertSameShape(
    educationPlanningTranslations['en-US'],
    educationPlanningTranslations[locale],
    locale,
    'education.planning',
  );
  assertSameShape(
    educationYearMapTranslations['en-US'],
    educationYearMapTranslations[locale],
    locale,
    'education.yearMap',
  );
  assertSameShape(
    educationHolidayTranslations['en-US'],
    educationHolidayTranslations[locale],
    locale,
    'education.holidays',
  );
  assert.equal(educationFeedbackTranslations[locale].barriers.length, 4);
  assert.ok(educationFeedbackTranslations[locale].communityCodeInvalid);
  assert.deepEqual(
    Object.keys(educationMoonMethodologyTranslations[locale]).sort(),
    ['calendarMethodText', 'nasaMethodText', 'productMethodText'].sort(),
  );
  assertSameShape(
    plannerExtensionMessages['en-US'],
    plannerExtensionMessages[locale],
    locale,
    'education.tools.planner',
  );
}

const toolLocales = expectedLocales.filter((locale) => !['en-US', 'pt-BR'].includes(locale));
assert.deepEqual(Object.keys(localizedEditorialMessages).sort(), toolLocales.sort());
assert.deepEqual(Object.keys(localizedToolMessages).sort(), toolLocales.sort());
for (const locale of toolLocales) {
  assertSameShape(educationMessages['en-US'].tools, localizedToolMessages[locale], locale, 'tools');
  assert.notEqual(
    educationMessages[locale].tools.browserTitle,
    educationMessages['en-US'].tools.browserTitle,
    `${locale}: a página de ferramentas não pode usar o título em inglês.`,
  );
}
assert.notEqual(
  educationMessages['pt-BR'].tools.browserTitle,
  educationMessages['en-US'].tools.browserTitle,
);

/* Números históricos e templates sem texto podem ser idênticos. Fora dessas
   exceções, uma igualdade literal com o inglês denuncia fallback visual. */
const allowedExactEnglishPaths = new Set([
  'moon.phasePosition',
  'moon.specialPosition',
  'idea.total',
  'history.events.0.year',
  'history.events.1.year',
  'history.events.2.year',
  'history.events.3.year',
  'history.events.4.year',
]);
const englishEditorial = withoutTools(educationMessages['en-US']);
const englishEditorialStrings = collectStrings(englishEditorial);

for (const locale of expectedLocales.filter((item) => item !== 'en-US')) {
  const localizedEditorial = withoutTools(educationMessages[locale]);
  const localizedStrings = collectStrings(localizedEditorial);

  for (const [path, englishText] of englishEditorialStrings) {
    if (!allowedExactEnglishPaths.has(path) && localizedStrings.get(path) === englishText) {
      assert.fail(`${locale}: fallback editorial em inglês detectado em education.${path}.`);
    }
  }
}

console.log(
  'Migração auditada: educação, ferramentas, motores compartilhados, 12 idiomas, SEO, widget privado e offline.',
);

function read(relativePath) {
  return readFile(new URL(relativePath, import.meta.url), 'utf8');
}

function assertSameShape(reference, candidate, locale, trail = 'education') {
  for (const key of Object.keys(reference)) {
    const nextTrail = `${trail}.${key}`;

    assert.ok(
      Object.hasOwn(candidate, key),
      `${locale}: tradução estrutural ausente em ${nextTrail}.`,
    );

    if (Array.isArray(reference[key])) {
      assert.ok(Array.isArray(candidate[key]), `${locale}: ${nextTrail} deve ser uma lista.`);
      assert.equal(
        candidate[key].length,
        reference[key].length,
        `${locale}: ${nextTrail} incompleto.`,
      );
    } else if (reference[key] && typeof reference[key] === 'object') {
      assertSameShape(reference[key], candidate[key], locale, nextTrail);
    }
  }
}

function collectStrings(value, trail = '', output = new Map()) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, `${trail}.${index}`, output));
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      collectStrings(item, trail ? `${trail}.${key}` : key, output);
    }
  } else if (typeof value === 'string') {
    output.set(trail, value);
  }

  return output;
}

function withoutTools(messages) {
  return Object.fromEntries(Object.entries(messages).filter(([key]) => key !== 'tools'));
}
