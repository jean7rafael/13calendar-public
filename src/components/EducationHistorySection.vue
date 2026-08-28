<template>
  <section class="education-history-reference" aria-labelledby="education-history-title">
    <div class="education-history-reference__heading">
      <h2 id="education-history-title">{{ t('education.history.title') }}</h2>
      <p>{{ t('education.history.description') }}</p>
    </div>

    <div
      class="education-history-reference__timeline"
      role="list"
      :aria-label="t('education.history.timelineLabel')"
    >
      <article
        v-for="(event, index) in events"
        :key="`${event.year}-${event.title}`"
        class="education-history-reference__event"
        :class="{ 'education-history-reference__event--reverse': index % 2 === 1 }"
        role="listitem"
      >
        <div class="education-history-reference__event-card">
          <time>{{ event.year }}</time>
          <h3>{{ event.title }}</h3>
          <p>{{ event.text }}</p>
        </div>
        <span aria-hidden="true" />
        <div aria-hidden="true" />
      </article>
    </div>

    <div class="education-history-reference__faq-heading">
      <h2 id="education-history-faq-title">{{ t('education.history.faqTitle') }}</h2>
    </div>

    <div
      class="education-history-reference__faqs"
      role="list"
      aria-labelledby="education-history-faq-title"
    >
      <component
        :is="faqLinks[index] ? 'a' : 'article'"
        v-for="(faq, index) in faqs"
        :key="faq.question"
        class="education-history-reference__faq"
        :class="{ 'education-history-reference__faq--link': faqLinks[index] }"
        :href="faqLinks[index] || undefined"
        role="listitem"
      >
        <h3>
          <span aria-hidden="true">?</span>
          {{ faq.question }}
        </h3>
        <p>{{ faq.answer }}</p>
        <span v-if="faqLinks[index]" class="education-history-reference__indicator" aria-hidden="true">
          {{ faqIndicators[index] }}
        </span>
      </component>
    </div>

    <aside
      id="kodak-fact"
      class="education-history-reference__kodak"
      :aria-label="t('education.history.kodakLabel')"
    >
      <h3>{{ t('education.history.kodakTitle') }}</h3>
      <p>{{ t('education.history.kodakText') }}</p>

      <div class="education-history-reference__kodak-numbers">
        <div>
          <strong>1928</strong>
          <span>{{ t('education.history.kodakStartLabel') }}</span>
        </div>
        <div>
          <strong>61</strong>
          <span>{{ t('education.history.kodakDurationLabel') }}</span>
        </div>
        <div>
          <strong>1989</strong>
          <span>{{ t('education.history.kodakEndLabel') }}</span>
        </div>
      </div>

      <div class="education-history-reference__kodak-detail">
        <p>{{ t('education.history.kodakStartText') }}</p>
        <p>{{ t('education.history.kodakEndText') }}</p>
      </div>
    </aside>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, tm } = useI18n({ useScope: 'global' });

const events = computed(() => tm('education.history.events'));
const faqs = computed(() => tm('education.history.faqs'));
const faqLinks = ['#special-days', '/', '#education-sabbath', '#kodak-fact', '', ''];
const faqIndicators = ['↑', '↗', '↓', '↓', '', ''];
</script>

<style scoped>
.education-history-reference {
  padding: clamp(72px, 10vw, 132px) 24px;
  background: color-mix(in srgb, var(--app-surface) 46%, transparent);
  border-top: 1px solid color-mix(in srgb, var(--app-accent-green-border) 55%, transparent);
}

.education-history-reference__heading,
.education-history-reference__faq-heading {
  max-width: 720px;
  margin: 0 auto 70px;
  text-align: center;
}

.education-history-reference__heading h2,
.education-history-reference__faq-heading h2 {
  margin: 0;
  font-size: clamp(34px, 6vw, 56px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.education-history-reference__heading p {
  margin: 18px 0 0;
  color: var(--app-text-muted);
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.6;
}

.education-history-reference__timeline {
  position: relative;
  max-width: 1100px;
  margin: 0 auto 120px;
}

.education-history-reference__timeline::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  content: '';
  background: linear-gradient(
    180deg,
    var(--app-accent-amber),
    color-mix(in srgb, var(--app-accent-purple) 42%, transparent),
    transparent
  );
}

.education-history-reference__event {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 34px 1fr;
  align-items: start;
  margin-bottom: 46px;
}

.education-history-reference__event--reverse .education-history-reference__event-card {
  grid-column: 3;
}

.education-history-reference__event--reverse > span {
  grid-column: 2;
  grid-row: 1;
}

.education-history-reference__event-card {
  max-width: 480px;
  justify-self: end;
  padding: 28px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 18px;
}

.education-history-reference__event--reverse .education-history-reference__event-card {
  justify-self: start;
}

.education-history-reference__event > span {
  z-index: 1;
  width: 12px;
  height: 12px;
  justify-self: center;
  margin-top: 33px;
  background: var(--app-page);
  border: 2px solid var(--app-accent-amber);
  border-radius: 50%;
}

.education-history-reference__event time {
  color: var(--app-accent-amber-strong);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.education-history-reference__event h3 {
  margin: 7px 0 8px;
  font-size: 18px;
}

.education-history-reference__event p {
  margin: 0;
  color: var(--app-text-muted);
  font-size: 15px;
  line-height: 1.55;
}

.education-history-reference__faq-heading {
  margin-bottom: 48px;
}

.education-history-reference__faqs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  max-width: 1040px;
  margin: 0 auto;
}

.education-history-reference__faq {
  position: relative;
  display: block;
  min-width: 0;
  padding: 26px;
  color: var(--app-text);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 18px;
  text-decoration: none;
  transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
}

.education-history-reference__faq:hover,
.education-history-reference__faq--link:focus-visible {
  border-color: var(--app-accent-purple-border);
  box-shadow: var(--app-card-shadow);
  transform: translateY(-2px);
}

.education-history-reference__faq h3 {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 0 26px 12px 0;
  font-size: 17px;
}

.education-history-reference__faq h3 > span {
  width: 25px;
  height: 25px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: var(--app-accent-purple-text);
  background: var(--app-accent-purple-soft);
  border-radius: 50%;
  font-size: 11px;
}

.education-history-reference__faq p {
  margin: 0 0 0 37px;
  color: var(--app-text-muted);
  font-size: 15px;
  line-height: 1.6;
}

.education-history-reference__indicator {
  position: absolute;
  top: 24px;
  right: 24px;
  color: var(--app-accent-purple-strong);
}

.education-history-reference__kodak {
  max-width: 850px;
  margin: 80px auto 0;
  padding: clamp(30px, 5vw, 48px);
  background: color-mix(in srgb, var(--app-accent-amber-soft) 42%, var(--app-surface));
  border: 1px solid var(--app-accent-amber-border);
  border-radius: 22px;
  text-align: center;
}

.education-history-reference__kodak > h3 {
  margin: 0;
  color: var(--app-accent-amber-text);
  font-size: clamp(22px, 4vw, 30px);
}

.education-history-reference__kodak > p {
  max-width: 650px;
  margin: 16px auto 0;
  color: var(--app-text-muted);
  font-size: 16px;
  line-height: 1.6;
}

.education-history-reference__kodak-numbers {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 30px;
}

.education-history-reference__kodak-numbers > div {
  padding: 18px 10px;
  border: 1px solid color-mix(in srgb, var(--app-accent-amber-border) 70%, transparent);
  border-radius: 12px;
}

.education-history-reference__kodak-numbers strong,
.education-history-reference__kodak-numbers span {
  display: block;
}

.education-history-reference__kodak-numbers strong {
  color: var(--app-accent-amber-text);
  font-size: 28px;
}

.education-history-reference__kodak-numbers span {
  margin-top: 4px;
  color: var(--app-text-muted);
  font-size: 12px;
}

.education-history-reference__kodak-detail {
  margin-top: 28px;
  padding-top: 22px;
  border-top: 1px solid color-mix(in srgb, var(--app-accent-amber-border) 65%, transparent);
  text-align: left;
}

.education-history-reference__kodak-detail p {
  margin: 0;
  color: var(--app-text-muted);
  line-height: 1.6;
}

.education-history-reference__kodak-detail p + p {
  margin-top: 12px;
}

@media (max-width: 700px) {
  .education-history-reference {
    padding-inline: 16px;
  }

  .education-history-reference__timeline::before {
    left: 16px;
  }

  .education-history-reference__event,
  .education-history-reference__event--reverse {
    grid-template-columns: 34px minmax(0, 1fr);
  }

  .education-history-reference__event-card,
  .education-history-reference__event--reverse .education-history-reference__event-card {
    grid-column: 2;
    justify-self: stretch;
    padding: 22px;
  }

  .education-history-reference__event > span,
  .education-history-reference__event--reverse > span {
    grid-column: 1;
    grid-row: 1;
  }

  .education-history-reference__faqs {
    grid-template-columns: 1fr;
  }

  .education-history-reference__faq {
    padding: 22px;
  }
}

@media (max-width: 430px) {
  .education-history-reference__kodak-numbers {
    grid-template-columns: 1fr;
  }
}
</style>
