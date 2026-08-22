<template>
  <q-btn
    flat
    dense
    round
    icon="groups"
    :to="{ name: 'community' }"
    class="community-toolbar-button"
    :aria-label="$t('community.openButton')"
  >
    <q-tooltip>
      {{ $t('community.openButton') }}
    </q-tooltip>
  </q-btn>
</template>

<style scoped>
/* ===========================================================
   ATALHO COMUNITÁRIO DA BARRA SUPERIOR
=========================================================== */

.community-toolbar-button {
  color: var(--app-text-muted);
}
</style>
