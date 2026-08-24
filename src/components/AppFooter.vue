<template>
  <footer
    class="app-footer"
    :class="{ 'app-footer--compact': !showContext }"
    role="contentinfo"
    :aria-label="$t('footer.ariaLabel')"
  >
    <!-- O mesmo separador em degradê abre o rodapé nas duas páginas. -->
    <div class="app-footer__divider app-footer__divider--top" aria-hidden="true"></div>

    <div class="app-footer__content">
      <!-- Contexto completo permanece na página principal dos calendários. -->
      <template v-if="showContext">
        <div class="app-footer__heading">
          <p class="app-footer__eyebrow">13 Calendar</p>
          <h2>{{ $t('footer.title') }}</h2>
          <p>{{ $t('footer.description') }}</p>
        </div>

        <div class="app-footer__topics">
          <article class="app-footer__topic">
            <span class="app-footer__topic-marker app-footer__topic-marker--source" aria-hidden="true"></span>
            <h3>{{ $t('footer.sourcesTitle') }}</h3>
            <p>{{ $t('footer.sourcesText') }}</p>
          </article>

          <article class="app-footer__topic">
            <span class="app-footer__topic-marker app-footer__topic-marker--privacy" aria-hidden="true"></span>
            <h3>{{ $t('footer.privacyTitle') }}</h3>
            <p>{{ $t('footer.privacyText') }}</p>
          </article>

          <article class="app-footer__topic">
            <span class="app-footer__topic-marker app-footer__topic-marker--limits" aria-hidden="true"></span>
            <h3>{{ $t('footer.limitationsTitle') }}</h3>
            <p>{{ $t('footer.limitationsText') }}</p>
          </article>
        </div>

        <div class="app-footer__divider" aria-hidden="true"></div>
      </template>

      <div class="app-footer__bottom">
        <p>{{ $t('footer.disclaimer') }}</p>

        <nav class="app-footer__links" :aria-label="$t('footer.linksLabel')">
          <a
            href="https://github.com/jean7rafael/13calendar-public#data-sources"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ $t('footer.dataSourcesLink') }}
          </a>
          <a
            href="https://github.com/jean7rafael/13calendar-public"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ $t('footer.sourceCodeLink') }}
          </a>
          <router-link :to="{ name: 'privacy' }">
            {{ $t('privacy.footerLink') }}
          </router-link>
          <a href="https://www.13months.net/" target="_blank" rel="noopener noreferrer">
            13months.net
          </a>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup>
/* ===========================================================
   VARIAÇÃO DO RODAPÉ COMPARTILHADO

   A página de calendários exibe o contexto completo. A página
   comunitária reutiliza apenas a faixa institucional inferior.
=========================================================== */

defineProps({
  showContext: {
    type: Boolean,
    default: true,
  },
});
</script>

<style scoped>
/* ===========================================================
   RODAPÉ DE TRANSPARÊNCIA

   Fontes, privacidade e limitações ficam visíveis no fim
   da experiência, seguindo a composição do site parceiro.
=========================================================== */

.app-footer {
  width: 100%;
  margin-top: 28px;
  color: var(--app-text);
}

.app-footer__content {
  padding: 48px 8px 12px;
}

.app-footer--compact .app-footer__content {
  padding-top: 20px;
}

.app-footer__heading {
  max-width: 680px;
  margin: 0 auto 32px;
  text-align: center;
}

.app-footer__eyebrow {
  margin: 0 0 8px;
  color: #8b5cf6;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.app-footer__heading h2 {
  margin: 0;
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.app-footer__heading > p:last-child {
  margin: 12px auto 0;
  color: var(--app-text-muted);
  font-size: 14px;
  line-height: 1.6;
}

.app-footer__topics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.app-footer__topic {
  min-width: 0;
  padding: 18px;
  background: color-mix(in srgb, var(--app-surface) 84%, transparent);
  border: 1px solid var(--app-border);
  border-radius: 16px;
}

.app-footer__topic-marker {
  width: 24px;
  height: 4px;
  display: block;
  margin-bottom: 14px;
  border-radius: 999px;
}

.app-footer__topic-marker--source {
  background: #8b5cf6;
}

.app-footer__topic-marker--privacy {
  background: #10b981;
}

.app-footer__topic-marker--limits {
  background: #f59e0b;
}

.app-footer__topic h3 {
  margin: 0 0 7px;
  font-size: 14px;
  font-weight: 700;
}

.app-footer__topic p {
  margin: 0;
  color: var(--app-text-muted);
  font-size: 12px;
  line-height: 1.55;
}

.app-footer__divider {
  height: 2px;
  margin: 32px 0 20px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, var(--app-border-strong) 35%, transparent) 22%,
    var(--app-border-strong) 50%,
    color-mix(in srgb, var(--app-border-strong) 35%, transparent) 78%,
    transparent 100%
  );
}

.app-footer__divider--top {
  margin: 0;
}

.app-footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  color: var(--app-text-faint);
  font-size: 11px;
  line-height: 1.5;
}

.app-footer__bottom p {
  max-width: 620px;
  margin: 0;
}

.app-footer__links {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
  white-space: nowrap;
}

.app-footer__links a {
  color: var(--app-text-muted);
  text-decoration: none;
  transition: color 160ms ease;
}

.app-footer__links a:hover,
.app-footer__links a:focus-visible {
  color: var(--app-text);
}

@media (max-width: 760px) {
  .app-footer__content {
    padding-top: 36px;
  }

  .app-footer__topics {
    grid-template-columns: 1fr;
  }

  .app-footer__bottom,
  .app-footer__links {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .app-footer__links {
    gap: 10px;
  }
}
</style>
