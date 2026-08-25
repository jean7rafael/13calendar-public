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

        <!-- A página dos calendários aponta para a comunidade; a
             página comunitária oferece o caminho inverso. -->
        <CommunityFloatingButton v-if="!isCommunityPage" />

        <q-btn
          v-else
          flat
          dense
          round
          icon="today"
          class="app-toolbar-button"
          :to="{ name: 'home' }"
          :aria-label="t('community.backToCalendars')"
        >
          <q-tooltip>
            {{ t('community.backToCalendars') }}
          </q-tooltip>
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

        <q-btn
          flat
          dense
          round
          icon="close"
          class="app-toolbar-button"
          :href="referenceSiteUrl"
          :aria-label="t('navigation.backToHome')"
        >
          <q-tooltip>
            {{ t('navigation.backToHome') }}
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
          <q-btn flat no-caps color="primary" :label="t('holidaySettings.cancel')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Conteúdo da rota atual. -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta, useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { setAppLanguage } from 'src/boot/i18n';
import { setAppDarkMode } from 'src/boot/theme';
import CommunityFloatingButton from 'src/components/CommunityFloatingButton.vue';
import HolidayCountrySelector from 'src/components/HolidayCountrySelector.vue';
import { interfaceLanguages, type InterfaceLocale } from '../../shared/interfaceLanguages';

/* ===========================================================
   TIPOS DOS IDIOMAS DISPONÍVEIS
=========================================================== */

type AppLocale = InterfaceLocale;

/* ===========================================================
   ESTADO DO MENU E DO POPUP
=========================================================== */

const leftDrawerOpen = ref(false);
const holidayCountryDialogOpen = ref(false);
const drawerMenuList = ref(null);
const drawerCountryListFits = ref(false);
const drawerMenuAtEnd = ref(false);

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

/* Páginas sem calendário compartilham a gaveta enxuta.
   Somente o conversor oferece a escolha de feriados. */
const usesLanguageOnlyDrawer = computed(
  () =>
    isCommunityPage.value ||
    isCommunityAdminPage.value ||
    isCommunityRemovalPage.value ||
    isPrivacyPage.value,
);

const toolbarTitle = computed(() => {
  if (isCommunityAdminPage.value) return t('community.adminTitle');
  if (isCommunityRemovalPage.value) return t('community.removalTitle');
  if (isCommunityPage.value) return t('community.headerTitle');
  if (isPrivacyPage.value) return t('privacy.title');
  return t('app.title');
});

/* ===========================================================
   TÍTULO LOCALIZADO DA ABA DO NAVEGADOR

   O nome da marca permanece estável, enquanto a descrição
   acompanha imediatamente o idioma escolhido na interface.
=========================================================== */

useMeta(() => ({
  title: t('app.browserTitle'),
}));

/* ===========================================================
   ROTA DA PÁGINA INICIAL DE REFERÊNCIA
=========================================================== */

const configuredReferenceSiteUrl = String(import.meta.env.VITE_REFERENCE_SITE_URL || '').trim();
const referenceSiteUrl = configuredReferenceSiteUrl
  ? configuredReferenceSiteUrl
  : new URL(`${import.meta.env.BASE_URL}reference-site/index.html`, window.location.origin).href;

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

watch(leftDrawerOpen, async (isOpen) => {
  setPageScrollLocked(isOpen);

  if (isOpen) {
    await nextTick();
    updateDrawerMenuEndState();
  }
});

onBeforeUnmount(() => {
  setPageScrollLocked(false);
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
</style>
