<template>
  <q-page class="privacy-page">
    <article class="privacy-card">
      <header class="privacy-heading">
        <p>{{ t('privacy.eyebrow') }}</p>
        <h1>{{ t('privacy.title') }}</h1>
        <small>{{ t('privacy.updated') }}</small>
        <span>{{ t('privacy.intro') }}</span>
      </header>

      <section v-for="section in sections" :key="section.title" class="privacy-section">
        <h2>{{ section.title }}</h2>
        <p>{{ section.text }}</p>
      </section>

      <section class="privacy-contact">
        <h2>{{ t('privacy.contactTitle') }}</h2>
        <p>
          {{ t('privacy.contactText') }}
          <a href="mailto:jean7rafael@icloud.com">jean7rafael@icloud.com</a>.
        </p>
      </section>

      <q-btn
        unelevated
        no-caps
        class="app-action app-action--tertiary"
        icon="today"
        :to="{ name: 'home' }"
        :label="t('privacy.back')"
      />
    </article>

  </q-page>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';

/* ===========================================================
   AVISO PÚBLICO E LOCALIZADO
=========================================================== */

const { t, tm } = useI18n({ useScope: 'global' });
const sections = computed(() => tm('privacy.sections'));

useMeta(() => ({ title: t('privacy.browserTitle') }));
</script>

<style scoped>
.privacy-page {
  width: min(100%, 1080px);
  margin: 0 auto;
  padding: 48px 20px 0;
  color: var(--app-text);
}

.privacy-card {
  padding: clamp(24px, 5vw, 52px);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 22px;
  box-shadow: var(--app-card-shadow);
}

.privacy-heading { max-width: 760px; margin-bottom: 36px; }
.privacy-heading > p { margin: 0 0 8px; color: #8b5cf6; font-size: 11px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
.privacy-heading h1 { margin: 0; font-size: clamp(32px, 6vw, 54px); line-height: 1.05; }
.privacy-heading small { display: block; margin-top: 10px; color: var(--app-text-faint); }
.privacy-heading span { display: block; margin-top: 20px; color: var(--app-text-muted); font-size: 16px; line-height: 1.7; }
.privacy-section, .privacy-contact { padding: 24px 0; border-top: 1px solid var(--app-border); }
.privacy-section h2, .privacy-contact h2 { margin: 0 0 10px; font-size: 18px; }
.privacy-section p, .privacy-contact p { max-width: 820px; margin: 0; color: var(--app-text-muted); line-height: 1.7; }
.privacy-contact a { color: #8b5cf6; }
</style>
