<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Barra superior com menu, título e retorno à data de hoje. -->
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
          {{ t('app.title') }}
        </q-toolbar-title>

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
          no-caps
          icon="today"
          :label="t('calendar.today')"
          class="app-today-button"
          :aria-label="t('calendar.goToToday')"
          @click="requestToday"
        >
          <q-tooltip>
            {{ t('calendar.goToToday') }}
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
      <q-list padding class="drawer-menu-list">
        <!-- Seleção do idioma da interface. -->
        <q-item-label header class="text-weight-bold">
          {{ t('language.title') }}
        </q-item-label>

        <q-item
          v-for="language in languages"
          :key="language.locale"
          clickable
          v-ripple
          :active="isCurrentLanguage(language.locale)"
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

        <!-- Seleção permanente do país dos feriados. -->
        <q-separator spaced />

        <q-item-label header class="text-weight-bold">
          {{ t('holidaySettings.countryTitle') }}
        </q-item-label>

        <HolidayCountrySelector class="drawer-country-selector" @select="closeLeftDrawer" />
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
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { setAppLanguage } from 'src/boot/i18n';
import { setAppDarkMode } from 'src/boot/theme';
import { useTodayNavigation } from 'src/composables/useTodayNavigation';
import HolidayCountrySelector from 'src/components/HolidayCountrySelector.vue';

/* ===========================================================
   TIPOS DOS IDIOMAS DISPONÍVEIS
=========================================================== */

type AppLocale =
  | 'en-US'
  | 'pt-BR'
  | 'de-DE'
  | 'fr-FR'
  | 'it-IT'
  | 'es-ES'
  | 'ru-RU'
  | 'ar-SA'
  | 'hi-IN'
  | 'zh-CN'
  | 'ja-JP'
  | 'ko-KR';

interface LanguageOption {
  locale: AppLocale;
  flag: string;
  name: string;
  region: string;
}

/* ===========================================================
   ESTADO DO MENU E DO POPUP
=========================================================== */

const leftDrawerOpen = ref(false);
const holidayCountryDialogOpen = ref(false);

/* ===========================================================
   IDIOMAS EXIBIDOS NO MENU
=========================================================== */

const languages: LanguageOption[] = [
  // América do Norte
  {
    locale: 'en-US',
    flag: '🇺🇸',
    name: 'English',
    region: 'United States',
  },

  // América do Sul
  {
    locale: 'pt-BR',
    flag: '🇧🇷',
    name: 'Português',
    region: 'Brasil',
  },

  // Europa Ocidental
  {
    locale: 'de-DE',
    flag: '🇩🇪',
    name: 'Deutsch',
    region: 'Deutschland',
  },
  {
    locale: 'fr-FR',
    flag: '🇫🇷',
    name: 'Français',
    region: 'France',
  },

  {
    locale: 'it-IT',
    flag: '🇮🇹',
    name: 'Italiano',
    region: 'Italia',
  },

  {
    locale: 'es-ES',
    flag: '🇪🇸',
    name: 'Español',
    region: 'España',
  },

  // Europa Oriental
  {
    locale: 'ru-RU',
    flag: '🇷🇺',
    name: 'Русский',
    region: 'Россия',
  },

  // Ásia Ocidental / Oriente Médio
  {
    locale: 'ar-SA',
    flag: '🇸🇦',
    name: 'العربية',
    region: 'المملكة العربية السعودية',
  },

  // Ásia Meridional
  {
    locale: 'hi-IN',
    flag: '🇮🇳',
    name: 'हिन्दी',
    region: 'भारत',
  },

  // Ásia Oriental
  {
    locale: 'zh-CN',
    flag: '🇨🇳',
    name: '简体中文',
    region: '中国',
  },
  {
    locale: 'ja-JP',
    flag: '🇯🇵',
    name: '日本語',
    region: '日本',
  },
  {
    locale: 'ko-KR',
    flag: '🇰🇷',
    name: '한국어',
    region: '대한민국',
  },
];

/* ===========================================================
   SERVIÇOS COMPARTILHADOS DA INTERFACE
=========================================================== */

const { requestToday } = useTodayNavigation();

const quasar = useQuasar();

const { t, locale } = useI18n({
  useScope: 'global',
});

/* ===========================================================
   ROTA DA PÁGINA INICIAL DE REFERÊNCIA
=========================================================== */

const configuredReferenceSiteUrl = String(
  import.meta.env.VITE_REFERENCE_SITE_URL || '',
).trim();
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
   TROCA DO IDIOMA DA INTERFACE
=========================================================== */

function isCurrentLanguage(language: AppLocale) {
  return locale.value === language;
}

function changeLanguage(language: AppLocale) {
  setAppLanguage(language);
  leftDrawerOpen.value = false;
  holidayCountryDialogOpen.value = true;
}

/* ===========================================================
   FECHAMENTO DO POPUP DE PAÍSES
=========================================================== */

function closeHolidayCountryDialog() {
  holidayCountryDialogOpen.value = false;
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

.app-today-button {
  min-height: 34px;
  padding: 0 12px;
  color: var(--app-primary-text);
  border-radius: 10px;
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
  overflow-y: auto;
}

.drawer-menu-list :deep(.q-item) {
  margin: 2px 8px;
  border-radius: 10px;
}

.drawer-menu-list :deep(.q-item__label--header) {
  color: var(--app-text-muted);
  letter-spacing: 0.02em;
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

  .app-today-button {
    min-width: 34px;
    padding: 0;
  }

  .app-today-button :deep(.q-btn__content > span) {
    display: none;
  }
}
</style>
