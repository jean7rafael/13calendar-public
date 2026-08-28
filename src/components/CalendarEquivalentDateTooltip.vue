<template>
  <q-tooltip v-if="formattedDate">
    {{ formattedDate }} ({{ calendarLabel }})
  </q-tooltip>
</template>

<script setup>
import { computed } from 'vue';

/* ===========================================================
   TOOLTIP COMPARTILHADO DA DATA EQUIVALENTE

   Os quatro encartes usam a mesma apresentação para que a
   equivalência funcione nos dois sentidos sem texto local.
=========================================================== */

const props = defineProps({
  date: {
    type: String,
    default: '',
  },
  calendarLabel: {
    type: String,
    required: true,
  },
});

const formattedDate = computed(() => props.date?.replace(/-/g, '/') || '');
</script>
