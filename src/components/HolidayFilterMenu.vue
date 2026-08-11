<template>
  <q-btn
    flat
    round
    dense
    size="sm"
    icon="filter_list"
    :color="hasDisabledFilters ? 'primary' : 'grey-8'"
    :aria-label="t('holidaySettings.filters.open')"
  >
    <q-tooltip>
      {{ t('holidaySettings.filters.open') }}
    </q-tooltip>

    <q-menu anchor="bottom right" self="top right">
      <q-list class="holiday-filter-list">
        <q-item-label header class="text-weight-bold">
          {{ t('holidaySettings.filters.title') }}
        </q-item-label>

        <q-separator />

        <q-item
          v-for="filter in filterOptions"
          :key="filter.type"
          tag="label"
          dense
          class="holiday-filter-option"
        >
          <q-item-section>
            <q-item-label>
              {{ t(filter.labelKey) }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-checkbox v-model="holidayFilters[filter.type]" dense color="primary" />
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item>
          <q-item-section>
            <q-btn
              flat
              dense
              no-caps
              color="primary"
              icon="restart_alt"
              :label="t('holidaySettings.filters.enableAll')"
              :disable="!hasDisabledFilters"
              @click="resetHolidayFilters"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup>
import { computed } from 'vue';

import { useI18n } from 'vue-i18n';

import { HOLIDAY_TYPES } from 'src/holidays/holidayEngine';

import { useHolidaySettings } from 'src/composables/useHolidaySettings';

/* ===========================================================
   TRADUÇÕES DA INTERFACE
=========================================================== */

const { t } = useI18n({
  useScope: 'global',
});

/* ===========================================================
   ESTADO GLOBAL DOS FILTROS
=========================================================== */

const { holidayFilters, resetHolidayFilters } = useHolidaySettings();

/* ===========================================================
   OPÇÕES EXIBIDAS NO POPUP
=========================================================== */

const filterOptions = HOLIDAY_TYPES.map((type) => ({
  type,

  labelKey: `holidaySettings.filters.${type}`,
}));

/* ===========================================================
   INDICAÇÃO VISUAL DE FILTRO ATIVO

   O botão fica azul quando pelo menos um tipo de data
   estiver desativado.
=========================================================== */

const hasDisabledFilters = computed(() =>
  HOLIDAY_TYPES.some((type) => holidayFilters[type] === false),
);
</script>

<style scoped>
.holiday-filter-list {
  min-width: 260px;
}

.holiday-filter-option {
  min-height: 38px;
}
</style>
