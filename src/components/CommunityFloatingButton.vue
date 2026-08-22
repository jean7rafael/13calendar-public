<template>
  <router-link
    :to="{ name: 'community' }"
    class="community-page-link"
    :aria-label="$t('community.openButton')"
  >
    <span>{{ $t('community.openButton') }}</span>
    <q-icon name="arrow_forward" size="18px" />
  </router-link>
</template>

<style scoped>
/* ===========================================================
   ATALHO COMUNITÁRIO NO FLUXO DA PÁGINA

   Ele replica o retorno discreto da página comunitária, mas
   fica alinhado à direita e aponta para a próxima experiência.
=========================================================== */

.community-page-link {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-end;
  color: var(--app-text-muted);
  font-size: 14px;
  text-decoration: none;
  transition: color 180ms ease;
}

.community-page-link:hover,
.community-page-link:focus-visible {
  color: var(--app-primary-text);
}
</style>
