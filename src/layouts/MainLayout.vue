<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Barra superior com menu, título e ações comuns às páginas. -->
    <q-header class="app-header">
      <q-toolbar class="app-toolbar">
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="app-toolbar-button"
          :aria-label="t('navigation.menu')"
          @click="toggleLeftDrawer"
        />

        <div class="app-brand-mark" aria-hidden="true">13</div>

        <q-toolbar-title class="app-title">
          {{ toolbarTitle }}
        </q-toolbar-title>

        <nav class="app-toolbar-navigation" :aria-label="t('productNavigation.ariaLabel')">
          <q-btn
            v-for="item in productNavigationItems"
            :key="item.routeName"
            flat
            dense
            no-caps
            class="app-toolbar-button app-toolbar-button--section"
            :class="{ 'app-toolbar-button--active': item.active }"
            :to="{ name: item.routeName }"
            :aria-label="item.label"
            :aria-current="item.active ? 'page' : undefined"
          >
            <q-icon :name="item.icon" aria-hidden="true" />
            <span class="app-toolbar-label">{{ item.label }}</span>
            <q-tooltip>{{ item.label }}</q-tooltip>
          </q-btn>
        </nav>

        <q-btn
          flat
          dense
          round
          icon="apps"
          class="app-toolbar-button app-toolbar-navigation-trigger"
          :aria-label="t('productNavigation.open')"
          @click="rightDrawerOpen = true"
        >
          <q-tooltip>{{ t('productNavigation.open') }}</q-tooltip>
        </q-btn>

        <q-btn
          flat
          dense
          round
          class="app-toolbar-button"
          :aria-label="themeButtonLabel"
          @click="toggleAppTheme"
        >
          <!-- Os mesmos ícones vetoriais da página institucional. -->
          <svg
            v-if="isDarkMode"
            class="app-theme-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path
              stroke-linecap="round"
              d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
            />
          </svg>

          <svg
            v-else
            class="app-theme-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
            />
          </svg>

          <q-tooltip>
            {{ themeButtonLabel }}
          </q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Menu lateral com os idiomas e países disponíveis. -->
    <q-drawer v-model="leftDrawerOpen" overlay bordered :width="280" class="app-drawer">
      <q-list
        ref="drawerMenuList"
        padding
        class="drawer-menu-list"
        :class="{
          'drawer-menu-list--country-fits': drawerCountryListFits && drawerMenuAtEnd,
        }"
        @scroll.passive="handleDrawerMenuScroll"
      >
        <!-- Cabeçalho fixo durante a navegação dos idiomas e países. -->
        <div class="drawer-language-header">
          <q-item-label header class="text-weight-bold">
            {{ t('language.title') }}
          </q-item-label>

          <q-btn
            flat
            dense
            round
            icon="close"
            class="drawer-close-button"
            :aria-label="t('navigation.closeMenu')"
            @click="closeLeftDrawer"
          >
            <q-tooltip>
              {{ t('navigation.closeMenu') }}
            </q-tooltip>
          </q-btn>
        </div>

        <q-item
          v-for="language in orderedLanguages"
          :key="language.locale"
          clickable
          v-ripple
          :active="isCurrentLanguage(language.locale)"
          :class="{ 'drawer-current-language': isCurrentLanguage(language.locale) }"
          active-class="language-active"
          @click="changeLanguage(language.locale)"
        >
          <q-item-section avatar>
            <span class="language-flag" aria-hidden="true">
              {{ language.flag }}
            </span>
          </q-item-section>

          <q-item-section>
            <q-item-label>
              {{ language.name }}
            </q-item-label>

            <q-item-label caption>
              {{ language.region }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon v-if="isCurrentLanguage(language.locale)" name="check" color="primary" />
          </q-item-section>
        </q-item>

        <!-- A seleção de feriados pertence somente ao conversor.
             A página comunitária mantém o menu enxuto da página
             institucional, limitado à escolha do idioma. -->
        <template v-if="!usesLanguageOnlyDrawer">
          <!-- Respiro final da lista de idiomas. Ele só alcança a
               área fixa depois que o último idioma passa por ela. -->
          <div class="drawer-language-spacer" aria-hidden="true"></div>

          <!-- Seleção permanente do país dos feriados. -->
          <q-separator spaced />

          <q-item-label header class="text-weight-bold drawer-country-header">
            {{ t('holidaySettings.countryTitle') }}
          </q-item-label>

          <HolidayCountrySelector
            drawer-mode
            class="drawer-country-selector"
            @select="closeLeftDrawer"
            @fit-change="setDrawerCountryListFits"
          />
        </template>
      </q-list>
    </q-drawer>

    <!-- Em telas estreitas, os mesmos destinos da barra ficam
         reunidos numa gaveta própria à direita. -->
    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      overlay
      bordered
      :width="300"
      class="app-navigation-drawer"
    >
      <div class="app-navigation-drawer__header">
        <strong>{{ t('productNavigation.ariaLabel') }}</strong>
        <q-btn
          flat
          dense
          round
          icon="close"
          class="app-toolbar-button"
          :aria-label="t('productNavigation.close')"
          @click="closeRightDrawer"
        />
      </div>

      <q-list padding>
        <q-item
          v-for="item in productNavigationItems"
          :key="item.routeName"
          clickable
          :active="item.active"
          active-class="app-navigation-drawer__active"
          :to="{ name: item.routeName }"
          @click="closeRightDrawer"
        >
          <q-item-section avatar><q-icon :name="item.icon" /></q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Confirmação do país após uma troca de idioma. -->
    <q-dialog v-model="holidayCountryDialogOpen">
      <q-card class="holiday-country-dialog">
        <q-card-section>
          <div class="text-h6">
            {{ t('holidaySettings.chooseCountry') }}
          </div>

          <div class="text-body2 q-mt-sm" :class="isDarkMode ? 'text-grey-4' : 'text-grey-7'">
            {{ t('holidaySettings.countryHint') }}
          </div>
        </q-card-section>

        <q-separator />

        <HolidayCountrySelector @select="closeHolidayCountryDialog" />

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            unelevated
            no-caps
            class="app-action app-action--secondary"
            :label="t('holidaySettings.cancel')"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Conteúdo da rota atual. -->
    <q-page-container>
      <q-banner v-if="updateAvailable" class="app-update-banner" dense>
        <template #avatar>
          <q-icon name="system_update" color="primary" />
        </template>
        {{ t('education.tools.pwa.update') }}
        <template #action>
          <q-btn
            unelevated
            no-caps
            class="app-action app-action--primary"
            :label="t('education.tools.pwa.refresh')"
            @click="reloadPage"
          />
        </template>
      </q-banner>
      <router-view />
      <AppFooter v-if="showsPublicFooter" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta, useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { setAppLanguage } from 'src/boot/i18n';
import { setAppDarkMode } from 'src/boot/theme';
import HolidayCountrySelector from 'src/components/HolidayCountrySelector.vue';
import AppFooter from 'src/components/AppFooter.vue';
import { interfaceLanguages, type InterfaceLocale } from '../../shared/interfaceLanguages';

/* ===========================================================
   TIPOS DOS IDIOMAS DISPONÍVEIS
=========================================================== */

type AppLocale = InterfaceLocale;

/* ===========================================================
   ESTADO DO MENU E DO POPUP
=========================================================== */

const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);
const holidayCountryDialogOpen = ref(false);
const drawerMenuList = ref(null);
const drawerCountryListFits = ref(false);
const drawerMenuAtEnd = ref(false);
const updateAvailable = ref(false);

/* ===========================================================
   IDIOMAS EXIBIDOS NO MENU
=========================================================== */

const languages = interfaceLanguages;

/* ===========================================================
   IDIOMA ATIVO NO INÍCIO DA LISTA

   O item atual permanece como o primeiro e também recebe
   posição fixa durante a rolagem. Assim, os demais idiomas
   desaparecem sob ele sem ocultar a escolha em uso.
=========================================================== */

const orderedLanguages = computed(() => [
  ...languages.filter((language) => isCurrentLanguage(language.locale)),
  ...languages.filter((language) => !isCurrentLanguage(language.locale)),
]);

/* ===========================================================
   SERVIÇOS COMPARTILHADOS DA INTERFACE
=========================================================== */

const quasar = useQuasar();
const route = useRoute();

const { t, locale } = useI18n({
  useScope: 'global',
});

const isCommunityPage = computed(() => route.name === 'community');
const isCommunityAdminPage = computed(() => route.name === 'community-admin');
const isCommunityRemovalPage = computed(() => route.name === 'community-remove');
const isPrivacyPage = computed(() => route.name === 'privacy');
const isEducationPage = computed(() => route.name === 'education');
const isToolsPage = computed(() => route.name === 'tools');
const isMoonPage = computed(() => route.name === 'moon');
const isNewsPage = computed(() => route.name === 'news');
const publicFooterRoutes = new Set([
  'home',
  'community',
  'privacy',
  'education',
  'tools',
  'moon',
  'news',
]);
const showsPublicFooter = computed(() => publicFooterRoutes.has(String(route.name)));
const productNavigationItems = computed(() => {
  const activeSection = ['community', 'community-admin', 'community-remove'].includes(
    String(route.name),
  )
    ? 'community'
    : String(route.name);

  return [
    {
      routeName: 'education',
      icon: 'auto_stories',
      label: t('productNavigation.learn'),
      active: activeSection === 'education',
    },
    {
      routeName: 'tools',
      icon: 'construction',
      label: t('productNavigation.tools'),
      active: activeSection === 'tools',
    },
    {
      routeName: 'home',
      icon: 'calendar_month',
      label: t('productNavigation.calendars'),
      active: activeSection === 'home',
    },
    {
      routeName: 'moon',
      icon: 'brightness_3',
      label: t('productNavigation.moon'),
      active: activeSection === 'moon',
    },
    {
      routeName: 'news',
      icon: 'newspaper',
      label: t('productNavigation.news'),
      active: activeSection === 'news',
    },
    {
      routeName: 'community',
      icon: 'groups',
      label: t('productNavigation.community'),
      active: activeSection === 'community',
    },
  ];
});

/* Páginas sem calendário compartilham a gaveta enxuta.
   Somente o conversor oferece a escolha de feriados. */
const usesLanguageOnlyDrawer = computed(
  () =>
    isCommunityPage.value ||
    isCommunityAdminPage.value ||
    isCommunityRemovalPage.value ||
    isPrivacyPage.value ||
    isEducationPage.value ||
    isToolsPage.value ||
    isMoonPage.value ||
    isNewsPage.value,
);

const toolbarTitle = computed(() => {
  if (isCommunityAdminPage.value) return t('community.adminTitle');
  if (isCommunityRemovalPage.value) return t('community.removalTitle');
  if (isCommunityPage.value) return t('community.headerTitle');
  if (isPrivacyPage.value) return t('privacy.title');
  if (isEducationPage.value) return t('education.toolbarTitle');
  if (isToolsPage.value) return t('education.tools.toolbarTitle');
  if (isMoonPage.value) return t('productNavigation.moon');
  if (isNewsPage.value) return t('education.resources.title');
  return t('app.title');
});

function markUpdateAvailable() {
  updateAvailable.value = true;
}

function reloadPage() {
  window.location.reload();
}

onMounted(() => window.addEventListener('calendar-update-available', markUpdateAvailable));

/* ===========================================================
   METADADOS ÚNICOS POR ROTA

   O HTML-base não mantém canonical nem descrições concorrentes.
   Assim cada página pública expõe exatamente uma versão localizada
   dessas informações e as páginas internas recebem noindex.
=========================================================== */

const publicMetadata = computed(() => {
  const entries: Record<
    string,
    { title: string; description: string; path?: string; noindex?: boolean }
  > = {
    home: {
      title: t('app.browserTitle'),
      description: t('introduction.description'),
      path: '/',
    },
    community: {
      title: t('community.browserTitle'),
      description: t('community.description'),
      path: '/community',
    },
    privacy: {
      title: t('privacy.browserTitle'),
      description: t('privacy.intro'),
      path: '/privacy',
    },
    education: {
      title: t('education.browserTitle'),
      description: t('education.hero.description'),
      path: '/learn',
    },
    tools: {
      title: t('education.tools.browserTitle'),
      description: t('education.tools.hero.description'),
      path: '/tools',
    },
    moon: {
      title: `13 Calendar — ${t('productNavigation.moon')}`,
      description: t('education.moon.intro'),
      path: '/moon',
    },
    news: {
      title: `13 Calendar — ${t('education.resources.title')}`,
      description: t('education.resources.description'),
      path: '/news',
    },
    'community-admin': {
      title: t('community.adminTitle'),
      description: t('community.adminDescription'),
      noindex: true,
    },
    'community-remove': {
      title: t('community.removalBrowserTitle'),
      description: t('community.removalDescription'),
      noindex: true,
    },
  };

  return entries[String(route.name)] || entries.home;
});

useMeta(() => {
  const metadata = publicMetadata.value;
  const canonical = metadata.path
    ? `https://13calendar.pages.dev${metadata.path === '/' ? '/' : metadata.path}`
    : '';
  const meta = {
    description: { name: 'description', content: metadata.description },
    ogLocale: { property: 'og:locale', content: locale.value.replace('-', '_') },
  };

  if (metadata.noindex) {
    meta.robots = { name: 'robots', content: 'noindex, nofollow' };
  } else {
    meta.ogTitle = { property: 'og:title', content: metadata.title };
    meta.ogDescription = { property: 'og:description', content: metadata.description };
    meta.ogUrl = { property: 'og:url', content: canonical };
    meta.twitterTitle = { name: 'twitter:title', content: metadata.title };
    meta.twitterDescription = { name: 'twitter:description', content: metadata.description };
  }

  return {
    title: metadata.title,
    meta,
    ...(canonical
      ? {
          link: {
            canonical: { rel: 'canonical', href: canonical },
          },
        }
      : {}),
  };
});

/* ===========================================================
   TEMA CLARO OU ESCURO
=========================================================== */

const isDarkMode = computed(() => quasar.dark.isActive);

const themeButtonLabel = computed(() => t(isDarkMode.value ? 'theme.useLight' : 'theme.useDark'));

function toggleAppTheme() {
  setAppDarkMode(!isDarkMode.value);
}

/* ===========================================================
   ABERTURA E FECHAMENTO DO MENU
=========================================================== */

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function closeLeftDrawer() {
  leftDrawerOpen.value = false;
}

function closeRightDrawer() {
  rightDrawerOpen.value = false;
}

/* ===========================================================
   BLOQUEIO DA ROLAGEM DA PÁGINA COM A GAVETA ABERTA

   A gaveta conserva sua própria barra de rolagem. O documento
   por trás dela permanece imóvel para que o gesto de navegação
   não desloque acidentalmente o conteúdo principal.
=========================================================== */

function setPageScrollLocked(locked: boolean) {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.classList.toggle('drawer-page-scroll-locked', locked);
  document.body.classList.toggle('drawer-page-scroll-locked', locked);
}

watch([leftDrawerOpen, rightDrawerOpen], async ([isLeftOpen, isRightOpen]) => {
  setPageScrollLocked(isLeftOpen || isRightOpen);

  if (isLeftOpen) {
    await nextTick();
    updateDrawerMenuEndState();
  }
});

onBeforeUnmount(() => {
  setPageScrollLocked(false);
  window.removeEventListener('calendar-update-available', markUpdateAvailable);
});

/* ===========================================================
   TROCA DO IDIOMA DA INTERFACE
=========================================================== */

function isCurrentLanguage(language: AppLocale) {
  return locale.value === language;
}

function changeLanguage(language: AppLocale) {
  setAppLanguage(language);
  leftDrawerOpen.value = false;

  if (!usesLanguageOnlyDrawer.value) {
    holidayCountryDialogOpen.value = true;
  }
}

/* ===========================================================
   FECHAMENTO DO POPUP DE PAÍSES
=========================================================== */

function closeHolidayCountryDialog() {
  holidayCountryDialogOpen.value = false;
}

/* ===========================================================
   VISIBILIDADE RESPONSIVA DA BARRA DA GAVETA

   A barra some no fim somente quando a região selecionada cabe
   inteira. Ela reaparece ao voltar para os idiomas ou quando a
   lista de países exige rolagem.
=========================================================== */

function getDrawerMenuElement() {
  return drawerMenuList.value?.$el || drawerMenuList.value;
}

function updateDrawerMenuEndState(menuElement = getDrawerMenuElement()) {
  if (!menuElement) {
    drawerMenuAtEnd.value = false;
    return;
  }

  const remainingScroll =
    menuElement.scrollHeight - menuElement.clientHeight - menuElement.scrollTop;
  drawerMenuAtEnd.value = remainingScroll <= 1;
}

function handleDrawerMenuScroll(event) {
  updateDrawerMenuEndState(event.currentTarget);
}

async function setDrawerCountryListFits(countryListFits) {
  drawerCountryListFits.value = countryListFits;
  await nextTick();
  updateDrawerMenuEndState();
}
</script>

<style scoped>
/* ===========================================================
   CABEÇALHO DA APLICAÇÃO
=========================================================== */

.app-header {
  color: var(--app-text);
  background: var(--app-header);
  border-bottom: 1px solid var(--app-border);
  box-shadow: none;
  backdrop-filter: blur(18px);
}

.app-toolbar {
  min-height: 58px;
  padding: 0 18px;
  gap: 8px;
}

.app-toolbar-button {
  color: var(--app-text-muted);
}

.app-toolbar-navigation {
  display: flex;
  align-items: center;
  gap: 4px;
}

.app-toolbar-button--section {
  min-height: 34px;
  padding-inline: 9px;
  border-radius: 10px;
  transition:
    color 160ms ease,
    background-color 160ms ease;
}

.app-toolbar-button--section:hover,
.app-toolbar-button--section:focus-visible,
.app-toolbar-button--active {
  color: var(--app-primary-text) !important;
  background: var(--app-primary-soft) !important;
}

.app-toolbar-button--section :deep(.q-icon) {
  font-size: 19px;
}

.app-toolbar-label {
  margin-inline-start: 6px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.app-toolbar-navigation-trigger {
  display: none;
}

.app-theme-icon {
  width: 20px;
  height: 20px;
}

.app-brand-mark {
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  color: white;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-radius: 9px;
  box-shadow: 0 7px 17px rgb(79 70 229 / 22%);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.app-title {
  overflow: hidden;
  color: var(--app-text);
  font-size: 17px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Bandeiras exibidas ao lado das opções de idioma. */
.language-flag {
  font-size: 25px;
  line-height: 1;
}

/* Destaque do idioma atualmente selecionado. */
.language-active {
  color: var(--app-primary-text);
  background: var(--app-primary-soft);
}

/* Cabeçalho e idioma escolhido acompanham a rolagem da gaveta.
   A lista de países passa sob estas duas faixas, mantendo a
   escolha da interface sempre identificável. */
.drawer-language-header {
  position: sticky;
  top: 0;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  padding: 0 6px 0 4px;
  background: var(--app-surface);
}

.drawer-language-header :deep(.q-item__label--header) {
  min-height: auto;
  padding: 0 8px;
}

.drawer-close-button {
  color: var(--app-text-muted);
}

.app-navigation-drawer__header {
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 14px 0 20px;
  border-bottom: 1px solid var(--app-border);
}

.app-navigation-drawer :deep(.q-item) {
  min-height: 48px;
  margin: 4px 8px;
  color: var(--app-text-muted);
  border-radius: 12px;
}

.app-navigation-drawer__active {
  color: var(--app-primary-text) !important;
  background: var(--app-primary-soft) !important;
}

.app-update-banner {
  color: var(--app-text);
  background: var(--app-primary-soft);
  border-bottom: 1px solid var(--app-border);
}

.drawer-current-language {
  position: sticky;
  top: 48px;
  z-index: 5;
  isolation: isolate;
  background: var(--app-primary-soft-solid) !important;
  box-shadow: 0 7px 10px -10px rgb(15 23 42 / 55%);
}

/* O item mantém suas margens arredondadas, mas uma superfície
   opaca preenche todo o entorno. Nenhum país selecionado ou
   ripple pode aparecer pelas frestas enquanto passa por trás. */
.drawer-current-language::before {
  position: absolute;
  z-index: -1;
  inset: -2px -8px;
  content: '';
  background: var(--app-surface);
}

/* O respiro pertence ao fim da lista de idiomas. Ao chegar à
   seleção ativa, ele permanece preso e não passa por trás dela. */
.drawer-language-spacer {
  position: sticky;
  top: 100px;
  z-index: 5;
  height: 52px;
  background: var(--app-surface);
}

/* Quando os idiomas terminam de passar por trás da seleção,
   o cabeçalho dos países preserva o respiro de uma linha. */
.drawer-country-header {
  position: sticky;
  top: 152px;
  z-index: 4;
  display: flex;
  align-items: center;
  min-height: 48px;
  padding-block: 0;
  margin: 0;
  background: var(--app-surface);
  box-shadow: 0 7px 10px -10px rgb(15 23 42 / 35%);
}

/* Limites do popup de seleção do país. */
.holiday-country-dialog {
  width: 360px;
  max-width: 90vw;
  border: 1px solid var(--app-border);
  border-radius: 18px;
  box-shadow: var(--app-card-shadow);
}

/* Em janelas baixas, o menu pode rolar até a seção de países.
   A lista de países mantém sua própria rolagem compacta. */
.drawer-menu-list {
  height: 100%;
  padding-block: 0 !important;
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* No fim de uma região curta não existe conteúdo a revelar.
   A rolagem para voltar aos idiomas continua disponível, mas
   o indicador deixa de sugerir uma continuação inexistente. */
.drawer-menu-list--country-fits {
  scrollbar-width: none;
}

.drawer-menu-list--country-fits::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.drawer-menu-list :deep(.q-item) {
  margin: 2px 8px;
  border-radius: 10px;
}

.drawer-menu-list :deep(.q-item__label--header) {
  color: var(--app-text-muted);
  letter-spacing: 0.02em;
}

.app-drawer :deep(.q-drawer__content) {
  overscroll-behavior: contain;
}

:global(html.drawer-page-scroll-locked),
:global(body.drawer-page-scroll-locked) {
  overflow: hidden;
  overscroll-behavior: none;
}

@media (max-width: 1120px) {
  .app-toolbar-label {
    display: none;
  }

  .app-toolbar-button--section {
    width: 34px;
    min-width: 34px;
    padding-inline: 0;
  }
}

@media (max-width: 720px) {
  .app-toolbar-navigation {
    display: none;
  }

  .app-toolbar-navigation-trigger {
    display: inline-flex;
  }
}

@media (max-width: 600px) {
  .app-toolbar {
    padding: 0 10px;
  }

  .app-brand-mark {
    display: none;
  }

  .app-title {
    font-size: 15px;
  }
}

@media (max-width: 430px) {
  .app-toolbar {
    gap: 2px;
    padding-inline: 4px;
  }

  .app-toolbar-button {
    width: 34px;
    min-width: 34px;
    height: 34px;
    min-height: 34px;
  }

  .app-title {
    padding-inline: 4px;
    font-size: 13px;
  }
}
</style>
