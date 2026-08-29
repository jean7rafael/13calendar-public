<template>
  <strong class="app-comparison-date-title" :aria-label="title">
    <template v-if="parts">
      <span :class="fitClass(parts.weekday)">
        {{ parts.weekday }}<template v-if="separator">&nbsp;{{ separator }}</template>
      </span>
      <span :class="fitClass(parts.date)">{{ parts.date }}</span>
    </template>
    <span v-else>{{ title }}</span>
  </strong>
</template>

<script setup>
import { computed } from 'vue';
import { splitComparisonTitle } from 'src/utils/calendarTools';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  separator: {
    type: String,
    default: '·',
  },
});

const parts = computed(() => splitComparisonTitle(props.title));

function fitClass(value) {
  const characterCount = Array.from(String(value || '').replace(/\s/gu, '')).length;

  if (characterCount >= 11) return 'app-comparison-date-title__part--dense';
  if (characterCount >= 8) return 'app-comparison-date-title__part--compact';

  return '';
}
</script>

<style scoped>
.app-comparison-date-title {
  width: 100%;
  min-width: 0;
  display: grid;
  grid-template-rows: repeat(2, max-content);
  grid-auto-flow: row;
  justify-items: center;
  align-content: center;
  row-gap: var(--app-comparison-date-row-gap, 6px);
  box-sizing: border-box;
  white-space: normal;
}

.app-comparison-date-title > span {
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  overflow-wrap: normal;
  padding-block: 0.04em 0.08em;
  line-height: 1.2;
  text-align: center;
  word-break: normal;
  white-space: nowrap;
  overflow: visible;
}
</style>
