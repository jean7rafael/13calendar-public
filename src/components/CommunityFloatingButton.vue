<template>
  <q-btn
    flat
    dense
    round
    :to="{ name: 'community' }"
    class="community-toolbar-button"
    :aria-label="$t('community.openButton')"
  >
    <!-- O desenho é idêntico ao usado pela página incorporada. -->
    <svg
      class="community-toolbar-icon"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="7" r="2.7" />
      <circle cx="5.5" cy="9" r="2" />
      <circle cx="18.5" cy="9" r="2" />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M7.5 19v-1.4a4.5 4.5 0 0 1 9 0V19M2.5 18v-.8a3.2 3.2 0 0 1 4.2-3M21.5 18v-.8a3.2 3.2 0 0 0-4.2-3"
      />
    </svg>

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

.community-toolbar-icon {
  width: 20px;
  height: 20px;
}
</style>
