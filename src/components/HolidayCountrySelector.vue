<template>
  <div
    class="holiday-country-selector"
    :class="{ 'holiday-country-selector--drawer': props.drawerMode }"
  >
    <!-- Filtro compacto por região geográfica. -->
    <div class="region-filter">
      <q-select
        v-model="holidayRegion"
        :options="regionOptions"
        :label="t('holidaySettings.regionFilter')"
        dense
        outlined
        emit-value
        map-options
        options-dense
        behavior="menu"
      />
    </div>

    <!-- Países da região selecionada. -->
    <div class="country-list" :class="{ 'country-list--drawer': props.drawerMode }">
      <template v-for="country in countryOptions" :key="country.code">
        <q-item-label v-if="country.startsRegion" header class="country-region-header">
          {{ t(`holidaySettings.regions.${country.holidayRegion}`) }}
        </q-item-label>

        <q-item
          clickable
          dense
          v-ripple
          class="country-row"
          :active="holidayCountry === country.code"
          active-class="holiday-country-active"
          :aria-label="country.name"
          @click="selectCountry(country.code)"
        >
          <q-item-section avatar class="country-flag-section">
            <span class="country-flag" aria-hidden="true">
              {{ country.flag }}
            </span>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">
              {{ country.name }}
            </q-item-label>
          </q-item-section>

          <q-item-section side class="country-check-section">
            <q-icon
              v-if="holidayCountry === country.code"
              name="check"
              color="primary"
              size="18px"
            />
          </q-item-section>
        </q-item>
      </template>

      <!-- Curso final para que a última região também alcance
           a posição aderente abaixo do seletor. -->
      <div v-if="props.drawerMode" class="country-list-spacer" aria-hidden="true"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import { useI18n } from 'vue-i18n';

import {
  HOLIDAY_REGIONS,
  HOLIDAY_REGION_GROUPS,
  holidayCountryCodes,
  getHolidayCountryConfig,
} from 'src/holidays/countryRegistry';

import { useHolidaySettings } from 'src/composables/useHolidaySettings';

/* ===========================================================
   EVENTO EMITIDO APÓS A SELEÇÃO
=========================================================== */

const emit = defineEmits(['select']);

const props = defineProps({
  drawerMode: {
    type: Boolean,
    default: false,
  },
});

/* ===========================================================
   IDIOMA ATUAL DA INTERFACE
=========================================================== */

const { t, locale } = useI18n({
  useScope: 'global',
});

/* ===========================================================
   CONFIGURAÇÃO GLOBAL DOS FERIADOS
=========================================================== */

const { holidayCountry, holidayRegion, setHolidayCountry } = useHolidaySettings();

/* ===========================================================
   OPÇÕES LOCALIZADAS DAS REGIÕES
=========================================================== */

const regionOptions = computed(() => [
  {
    value: HOLIDAY_REGIONS[0],
    label: t('holidaySettings.regions.all'),
  },
  ...HOLIDAY_REGION_GROUPS.flatMap(({ continent, regions }) =>
    regions.map((region) => ({
      value: region,
      label:
        continent === 'oceania' || continent === 'antarctica'
          ? t(`holidaySettings.regions.${region}`)
          : `${t(`holidaySettings.continents.${continent}`)} — ${t(
              `holidaySettings.regions.${region}`,
            )}`,
    })),
  ),
]);

const regionOrder = new Map(HOLIDAY_REGIONS.map((region, index) => [region, index]));

/* Países de maior destaque permanecem no início das regiões
   editoriais; os demais continuam em ordem alfabética. */
const countryPrioritiesByRegion = Object.freeze({
  americasNorth: new Map([
    ['CA', 0],
    ['US', 1],
    ['MX', 2],
  ]),
  europeWest: new Map([
    ['GB', 0],
    ['DE', 1],
    ['FR', 2],
    ['IT', 3],
    ['ES', 4],
    ['PT', 5],
    ['NL', 6],
    ['CH', 7],
    ['BE', 8],
    ['AT', 9],
    ['IE', 10],
    ['LU', 11],
    ['MC', 12],
    ['LI', 13],
    ['MT', 14],
    ['VA', 15],
    ['SM', 16],
    ['IM', 17],
    ['JE', 18],
    ['GG', 19],
  ]),
  europeEast: new Map([
    ['RU', 0],
    ['UA', 1],
    ['PL', 2],
    ['RO', 3],
    ['CZ', 4],
    ['HU', 5],
    ['BY', 6],
    ['BG', 7],
    ['SK', 8],
    ['LT', 9],
    ['LV', 10],
    ['EE', 11],
    ['MD', 12],
    ['AX', 13],
    ['SJ', 14],
  ]),
  asiaCentral: new Map([
    ['TR', 0],
    ['AM', 1],
    ['AZ', 2],
    ['GE', 3],
    ['KZ', 4],
    ['KG', 5],
    ['TJ', 6],
    ['TM', 7],
    ['UZ', 8],
  ]),
  oceania: new Map([
    ['AU', 0],
    ['NZ', 1],
  ]),
});

/* ===========================================================
   AJUSTES EDITORIAIS DOS NOMES DOS PAÍSES

   Intl.DisplayNames pode variar entre navegadores. Estas
   exceções mantêm os rótulos desejados sem alterar os códigos,
   as regiões nem as regras de feriados.
=========================================================== */

const countryNameOverridesByLocale = Object.freeze({
  'pt-BR': Object.freeze({
    PS: 'Territórios Palestinos',
    CN: 'China',
    CI: 'Costa do Marfim',
  }),
  'en-US': Object.freeze({
    PS: 'Palestinian Territories',
    CN: 'China',
    CI: 'Ivory Coast',
  }),
  'es-ES': Object.freeze({
    PS: 'Territorios Palestinos',
    CN: 'China',
    CI: 'Costa de Marfil',
  }),
  'fr-FR': Object.freeze({
    PS: 'Territoires Palestiniens',
    CN: 'Chine',
    CI: "Côte d'Ivoire",
  }),
  'de-DE': Object.freeze({
    PS: 'Palästinensische Gebiete',
    CN: 'China',
    CI: 'Elfenbeinküste',
  }),
  'it-IT': Object.freeze({
    PS: 'Territori Palestinesi',
    CN: 'Cina',
    CI: "Costa d'Avorio",
  }),
  'ru-RU': Object.freeze({
    PS: 'Палестинские Территории',
    CN: 'Китай',
    CI: "Кот-д'Ивуар",
  }),
  'ar-SA': Object.freeze({
    PS: 'الأراضي الفلسطينية',
    CN: 'الصين',
    CI: 'ساحل العاج',
  }),
  'hi-IN': Object.freeze({
    PS: 'फ़िलिस्तीनी क्षेत्र',
    CN: 'चीन',
    CI: 'आइवरी कोस्ट',
  }),
  'zh-CN': Object.freeze({
    PS: '巴勒斯坦领土',
    CN: '中国',
    CI: '科特迪瓦',
  }),
  'ja-JP': Object.freeze({
    PS: 'パレスチナ自治区',
    CN: '中国',
    CI: 'コートジボワール',
  }),
  'ko-KR': Object.freeze({
    PS: '팔레스타인 영토',
    CN: '중국',
    CI: '코트디부아르',
  }),
});

/* ===========================================================
   NOMES LOCALIZADOS DOS PAÍSES

   Intl.DisplayNames traduz automaticamente os nomes
   conforme o idioma atual da interface.
=========================================================== */

const countryOptions = computed(() => {
  let regionNames = null;

  try {
    regionNames = new Intl.DisplayNames([locale.value], {
      type: 'region',
    });
  } catch {
    // Se o navegador não oferecer Intl.DisplayNames,
    // o código internacional será utilizado.
  }

  const collator = new Intl.Collator(locale.value, {
    sensitivity: 'base',
  });

  const countryNameOverrides = countryNameOverridesByLocale[locale.value] || {};

  return holidayCountryCodes
    .map((countryCode) => {
      const countryConfig = getHolidayCountryConfig(countryCode);

      return {
        code: countryConfig.code,
        flag: countryConfig.flag,
        holidayRegion: countryConfig.holidayRegion,
        name: countryNameOverrides[countryCode] || regionNames?.of(countryCode) || countryCode,
      };
    })
    .filter(
      (country) => holidayRegion.value === 'all' || country.holidayRegion === holidayRegion.value,
    )
    .sort((first, second) => {
      const regionDifference =
        regionOrder.get(first.holidayRegion) - regionOrder.get(second.holidayRegion);

      if (regionDifference !== 0) {
        return regionDifference;
      }

      const countryPriority = countryPrioritiesByRegion[first.holidayRegion];

      if (countryPriority) {
        const firstPriority = countryPriority.get(first.code) ?? Number.MAX_SAFE_INTEGER;
        const secondPriority = countryPriority.get(second.code) ?? Number.MAX_SAFE_INTEGER;

        if (firstPriority !== secondPriority) {
          return firstPriority - secondPriority;
        }
      }

      return collator.compare(first.name, second.name);
    })
    .map((country, index, countries) => ({
      ...country,
      startsRegion: index === 0 || country.holidayRegion !== countries[index - 1].holidayRegion,
    }));
});

/* ===========================================================
   SELEÇÃO DO PAÍS
=========================================================== */

function selectCountry(countryCode) {
  const countryWasSelected = setHolidayCountry(countryCode);

  if (countryWasSelected) {
    emit('select', countryCode);
  }
}
</script>

<style scoped>
.holiday-country-selector {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.region-filter {
  padding: 4px 8px 8px;
}

.country-region-header {
  min-height: 28px;
  padding: 8px 12px 4px;
  color: currentColor;
  font-size: 12px;
  font-weight: 600;
  opacity: 0.7;
}

.country-list {
  max-height: min(52vh, 420px);
  overflow-y: auto;
  scrollbar-width: thin;
}

/* Na gaveta, a lista integra a única rolagem vertical. No popup
   ela continua limitada para não extrapolar o card de diálogo. */
.country-list--drawer {
  max-height: none;
  overflow: visible;
}

/* O seletor integra a faixa fixa da gaveta. Somente os títulos
   regionais e os países continuam no fluxo de rolagem. */
.holiday-country-selector--drawer .region-filter {
  position: sticky;
  top: 200px;
  z-index: 4;
  min-height: 52px;
  background: var(--app-surface);
}

/* Na gaveta, a região atual acompanha a leitura da lista.
   O próximo título a substitui ao alcançar a mesma faixa. */
.country-list--drawer .country-region-header {
  position: sticky;
  top: 252px;
  z-index: 3;
  margin: 0;
  color: var(--app-text-muted);
  background: var(--app-surface);
  opacity: 1;
  box-shadow: 0 7px 10px -10px rgb(15 23 42 / 28%);
}

/* A última região não possui outra seção para empurrá-la.
   Esta reserva permite que Antártida alcance a mesma trava. */
.country-list-spacer {
  min-height: max(320px, calc(100dvh - 280px));
  background: var(--app-surface);
}

.country-list::-webkit-scrollbar {
  width: 5px;
}

.country-list::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgb(128 128 128 / 65%);
}

.country-list::-webkit-scrollbar-track {
  background: transparent;
}

.country-row {
  min-height: 34px;
  padding-top: 0;
  padding-bottom: 0;
}

.country-flag-section {
  min-width: 36px;
  padding-right: 8px;
}

.country-flag {
  font-size: 20px;
  line-height: 1;
}

.country-check-section {
  padding-left: 4px;
}

.holiday-country-active {
  color: #1976d2;
  background: #e3f2fd;
}
</style>
