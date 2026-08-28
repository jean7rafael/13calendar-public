<template>
  <q-btn
    flat
    dense
    no-caps
    icon="today"
    :label="$t('calendar.today')"
    class="calendar-today-button"
    :aria-label="$t('calendar.goToToday')"
    @click.stop="requestToday"
  >
    <q-tooltip>
      {{ $t('calendar.goToToday') }}
    </q-tooltip>
  </q-btn>
</template>

<script setup>
import { useTodayNavigation } from 'src/composables/useTodayNavigation';

/* Uma única ação compartilhada impede que os dois calendários
   voltem a receber botões Hoje visual ou funcionalmente distintos. */
const { requestToday } = useTodayNavigation();
</script>

<style scoped>
.calendar-today-button {
  position: absolute;
  inset-inline-end: 14px;
  bottom: 12px;
  z-index: 3;
  min-height: 34px;
  padding: 0 11px;
  color: var(--app-primary-text);
  border-radius: 10px;
}
</style>
