<template>
  <section class="moon-phase-legend" :aria-label="$t('panels.moonPhases')">
    <span v-for="phase in phases" :key="phase.name" class="moon-phase-legend__item">
      <span class="moon-phase-legend__emoji" aria-hidden="true">
        {{ getMoonPhaseEmoji(phase.name) }}
      </span>

      <span>{{ translateMoonPhase(phase.name) }}</span>
    </span>
  </section>
</template>

<script setup>
import { useCalendarTranslations } from 'src/composables/useCalendarTranslations';
import { getMoonPhaseEmoji } from 'src/utils/moonPhaseMarkers';

/* ===========================================================
   FASES EXIBIDAS NA LEGENDA
=========================================================== */

const phases = [
  { name: 'Nova' },
  { name: 'Crescente' },
  { name: 'Cheia' },
  { name: 'Minguante' },
];

const { translateMoonPhase } = useCalendarTranslations();
</script>

<style scoped>
.moon-phase-legend {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.moon-phase-legend__item {
  min-height: 30px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--app-text-muted);
  background: var(--app-surface-raised);
  border: 1px solid var(--app-border);
  border-radius: 999px;
  font-size: 12px;
  line-height: 1;
}

.moon-phase-legend__emoji {
  font-size: 12px;
  line-height: 1;
  filter: var(--moon-emoji-outline);
}
</style>
