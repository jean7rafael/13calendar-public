<template>
  <section class="calendar-context" :aria-labelledby="contextTitleId">
    <div class="calendar-context__divider" aria-hidden="true"></div>

    <div class="calendar-context__content">
      <div class="calendar-context__heading">
        <p class="calendar-context__eyebrow">{{ resolvedEyebrow }}</p>
        <h2 :id="contextTitleId">{{ resolvedTitle }}</h2>
        <p>{{ resolvedDescription }}</p>
      </div>

      <div class="calendar-context__topics">
        <component
          :is="topic.href ? 'a' : 'article'"
          v-for="topic in resolvedTopics"
          :key="topic.title"
          class="calendar-context__topic"
          :href="topic.href"
          :target="topic.href ? '_blank' : undefined"
          :rel="topic.href ? 'noopener noreferrer' : undefined"
        >
          <span
            class="calendar-context__topic-marker"
            :class="`calendar-context__topic-marker--${topic.tone}`"
            aria-hidden="true"
          ></span>
          <h3>{{ topic.title }}</h3>
          <p>{{ topic.text }}</p>
        </component>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  contextTitleId: { type: String, default: 'calendar-context-title' },
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  topics: { type: Array, default: () => [] },
});
const { t } = useI18n({ useScope: 'global' });
const resolvedEyebrow = computed(() => props.eyebrow || '13 Calendar');
const resolvedTitle = computed(() => props.title || t('footer.title'));
const resolvedDescription = computed(() => props.description || t('footer.description'));
const resolvedTopics = computed(() =>
  props.topics.length
    ? props.topics
    : [
        { title: t('footer.sourcesTitle'), text: t('footer.sourcesText'), tone: 'source' },
        { title: t('footer.privacyTitle'), text: t('footer.privacyText'), tone: 'privacy' },
        { title: t('footer.limitationsTitle'), text: t('footer.limitationsText'), tone: 'limits' },
      ],
);
</script>

<style scoped>
/* ===========================================================
   CONTEXTO EXCLUSIVO DA PÁGINA DOS CALENDÁRIOS

   Fontes, privacidade e limitações explicam os dados exibidos
   nos calendários. Este conteúdo não pertence ao rodapé global.
=========================================================== */

.calendar-context {
  width: 100%;
  margin-top: 28px;
  color: var(--app-text);
}

.calendar-context__divider {
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

.calendar-context__content {
  width: min(calc(100% - 36px), 1240px);
  margin-inline: auto;
  padding: 48px 8px 12px;
}

.calendar-context__heading {
  max-width: 680px;
  margin: 0 auto 32px;
  text-align: center;
}

.calendar-context__eyebrow {
  margin: 0 0 8px;
  color: var(--app-accent-purple);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.calendar-context__heading h2 {
  margin: 0;
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.calendar-context__heading > p:last-child {
  margin: 12px auto 0;
  color: var(--app-text-muted);
  font-size: 14px;
  line-height: 1.6;
}

.calendar-context__topics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.calendar-context__topic {
  min-width: 0;
  padding: 18px;
  background: color-mix(in srgb, var(--app-surface) 84%, transparent);
  border: 1px solid var(--app-border);
  border-radius: 16px;
  color: var(--app-text);
  text-decoration: none;
  transition:
    border-color 160ms ease,
    transform 160ms ease;
}

a.calendar-context__topic:hover,
a.calendar-context__topic:focus-visible {
  border-color: color-mix(in srgb, var(--app-primary-text) 34%, var(--app-border));
  outline: none;
  transform: translateY(-2px);
}

.calendar-context__topic-marker {
  width: 24px;
  height: 4px;
  display: block;
  margin-bottom: 14px;
  border-radius: 999px;
}

.calendar-context__topic-marker--source {
  background: var(--app-accent-purple);
}

.calendar-context__topic-marker--privacy {
  background: var(--app-accent-green);
}

.calendar-context__topic-marker--limits {
  background: var(--app-accent-amber);
}

.calendar-context__topic h3 {
  margin: 0 0 7px;
  font-size: 14px;
  font-weight: 700;
}

.calendar-context__topic p {
  margin: 0;
  color: var(--app-text-muted);
  font-size: 12px;
  line-height: 1.55;
}

@media (max-width: 760px) {
  .calendar-context__content {
    padding-top: 36px;
  }

  .calendar-context__topics {
    grid-template-columns: 1fr;
  }
}
</style>
