<template>
  <header class="planner-print__header">
    <strong>13 Calendar</strong>
    <span>{{ year }}</span>
  </header>
</template>

<script setup>
/* Cabeçalho mínimo repetido em cada folha; o ano vem do seletor do diálogo. */
defineProps({
  year: { type: Number, required: true },
});
</script>
