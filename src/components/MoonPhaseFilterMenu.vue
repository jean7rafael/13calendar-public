<template>
  <q-btn
    flat
    round
    dense
    size="sm"
    icon="filter_list"
    :color="showMoonPhaseTime ? 'primary' : 'grey-8'"
    :aria-label="t('moonPhases.filters.open')"
  >
    <q-tooltip>
      {{ t('moonPhases.filters.open') }}
    </q-tooltip>

    <q-menu anchor="bottom right" self="top right">
      <q-list class="moon-phase-filter-list">
        <q-item-label header class="text-weight-bold">
          {{ t('moonPhases.filters.title') }}
        </q-item-label>

        <q-separator />

        <q-item tag="label" dense class="moon-phase-filter-option">
          <q-item-section>
            <q-item-label>
              {{ t('moonPhases.filters.showTime') }}
            </q-item-label>

            <q-item-label caption>
              {{ t('moonPhases.filters.timeCaption') }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-checkbox v-model="showMoonPhaseTime" dense color="primary" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

import { useMoonPhaseSettings } from 'src/composables/useMoonPhaseSettings';

/* ===========================================================
   TRADUÇÕES E CONFIGURAÇÃO COMPARTILHADA
=========================================================== */

const { t } = useI18n({
  useScope: 'global',
});

const { showMoonPhaseTime } = useMoonPhaseSettings();
</script>

<style scoped>
.moon-phase-filter-list {
  min-width: 260px;
}

.moon-phase-filter-option {
  min-height: 48px;
}
</style>
