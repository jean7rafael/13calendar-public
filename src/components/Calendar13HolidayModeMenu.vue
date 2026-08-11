<template>
  <q-btn
    flat
    round
    dense
    size="11px"
    :icon="currentOption.icon"
    :aria-label="currentOption.label"
    class="calendar13-mode-button"
  >
    <q-tooltip>
      {{ currentOption.label }}
    </q-tooltip>

    <q-menu anchor="top right" self="top left">
      <q-list class="calendar13-mode-list">
        <q-item-label header>
          {{ t('holidaySettings.calendar13Mode.title') }}
        </q-item-label>

        <q-item
          v-for="option in modeOptions"
          :key="option.value"
          v-close-popup
          clickable
          :active="calendar13HolidayMode === option.value"
          active-class="text-primary"
          @click="setCalendar13HolidayMode(option.value)"
        >
          <q-item-section avatar>
            <q-icon :name="option.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>
              {{ option.label }}
            </q-item-label>

            <q-item-label caption lines="2">
              {{ option.caption }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon
              v-if="calendar13HolidayMode === option.value"
              name="check"
              color="primary"
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

import { useHolidaySettings } from 'src/composables/useHolidaySettings';

import { CALENDAR_13_HOLIDAY_MODES } from 'src/holidays/calendar13HolidayRules';

/* ===========================================================
   IDIOMA E CONFIGURAÇÃO COMPARTILHADA
=========================================================== */

const { t } = useI18n({
  useScope: 'global',
});

const { calendar13HolidayMode, setCalendar13HolidayMode } = useHolidaySettings();

/* ===========================================================
   OPÇÕES DO MECANISMO DE DATAS
=========================================================== */

const modeOptions = computed(() => [
  {
    value: CALENDAR_13_HOLIDAY_MODES.NATIVE,
    icon: 'event_repeat',
    label: t('holidaySettings.calendar13Mode.native'),
    caption: t('holidaySettings.calendar13Mode.nativeCaption'),
  },
  {
    value: CALENDAR_13_HOLIDAY_MODES.CORRESPONDING,
    icon: 'sync_alt',
    label: t('holidaySettings.calendar13Mode.corresponding'),
    caption: t('holidaySettings.calendar13Mode.correspondingCaption'),
  },
]);

const currentOption = computed(
  () =>
    modeOptions.value.find(({ value }) => value === calendar13HolidayMode.value) ||
    modeOptions.value[0],
);
</script>

<style scoped>
/* ===========================================================
   BOTÃO COMPACTO E MENU EXPLICATIVO
=========================================================== */

.calendar13-mode-button {
  color: rgba(0, 0, 0, 0.6);
}

.body--dark .calendar13-mode-button {
  color: rgba(255, 255, 255, 0.7);
}

.calendar13-mode-list {
  min-width: 310px;
  max-width: 360px;
}
</style>
