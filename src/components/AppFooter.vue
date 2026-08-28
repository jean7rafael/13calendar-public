<template>
  <footer class="app-footer" role="contentinfo" :aria-label="$t('footer.ariaLabel')">
    <!-- O mesmo separador e a mesma altura identificam o rodapé global. -->
    <div class="app-footer__divider app-footer__divider--top" aria-hidden="true"></div>

    <div class="app-footer__content">
      <p class="app-footer__disclaimer">{{ $t('footer.disclaimer') }}</p>

      <nav class="app-footer__links" :aria-label="$t('footer.linksLabel')">
        <a
          href="https://github.com/jean7rafael/13calendar-public/blob/main/docs/releases/README_2.0.md#fontes-de-dados-e-refer%C3%AAncias"
          target="_blank"
          rel="noopener noreferrer"
        >
          <q-icon name="database" aria-hidden="true" />
          <span>{{ $t('footer.dataSourcesLink') }}</span>
        </a>
        <a
          href="https://en.wikipedia.org/wiki/International_Fixed_Calendar"
          target="_blank"
          rel="noopener noreferrer"
        >
          <q-icon name="menu_book" aria-hidden="true" />
          <span>{{ $t('footer.wikipediaLink') }}</span>
        </a>
        <a
          href="https://github.com/jean7rafael/13calendar-public"
          target="_blank"
          rel="noopener noreferrer"
        >
          <q-icon name="code" aria-hidden="true" />
          <span>{{ $t('footer.sourceCodeLink') }}</span>
        </a>
        <router-link :to="{ name: 'privacy' }">
          <q-icon name="shield" aria-hidden="true" />
          <span>{{ $t('privacy.footerLink') }}</span>
        </router-link>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
/* ===========================================================
   RODAPÉ GLOBAL

   Todas as páginas públicas terminam com a mesma faixa,
   a mesma altura e os mesmos quatro apontamentos.
=========================================================== */

.app-footer {
  width: 100%;
  margin-top: 28px;
  color: var(--app-text);
}

.app-footer__content {
  width: min(calc(100% - 36px), 1240px);
  min-height: 104px;
  margin-inline: auto;
  padding: 20px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  box-sizing: border-box;
}

.app-footer__divider {
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, var(--app-border-strong) 35%, transparent) 22%,
    var(--app-border-strong) 50%,
    color-mix(in srgb, var(--app-border-strong) 35%, transparent) 78%,
    transparent 100%
  );
}

.app-footer__disclaimer {
  max-width: 500px;
  margin: 0;
  color: var(--app-text-faint);
  font-size: 11px;
  line-height: 1.5;
}

.app-footer__links {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px 16px;
  flex-wrap: wrap;
  white-space: nowrap;
}

.app-footer__links a {
  min-height: 32px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding-inline: 4px;
  color: var(--app-text-muted);
  text-decoration: none;
  transition: color 160ms ease;
}

.app-footer__links :deep(.q-icon) {
  flex: 0 0 auto;
  font-size: 17px;
}

.app-footer__links a:hover,
.app-footer__links a:focus-visible {
  color: var(--app-text);
}

@media (max-width: 760px) {
  .app-footer__content {
    min-height: 220px;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .app-footer__links {
    width: min(100%, 420px);
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .app-footer__links a {
    justify-content: center;
  }
}
</style>
