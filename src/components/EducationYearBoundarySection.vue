<template>
  <section
    id="education-year-boundary"
    class="education-section education-year-boundary"
    aria-labelledby="education-year-boundary-title"
  >
    <div class="education-section__heading">
      <p class="education-eyebrow">{{ copy.eyebrow }}</p>
      <h2 id="education-year-boundary-title">{{ copy.title }}</h2>
      <p>{{ copy.introduction }}</p>
    </div>

    <!-- O Dia Bissexto aparece sempre na explicação para deixar o modelo anual
         completo, mas a legenda informa que ele só existe no ano apropriado. -->
    <div class="education-year-boundary__sequence" role="group" :aria-label="copy.title">
      <span>{{ copy.saturday }}</span>
      <q-icon name="arrow_forward" aria-hidden="true" />
      <strong>{{ copy.yearDay }}</strong>
      <q-icon name="arrow_forward" aria-hidden="true" />
      <span class="education-year-boundary__leap">
        {{ copy.leapDay }}
        <small>{{ copy.leapQualifier }}</small>
      </span>
      <q-icon name="arrow_forward" aria-hidden="true" />
      <span>{{ copy.sunday }}</span>
    </div>

    <div class="education-year-boundary__cards education-content-card-grid">
      <EducationContentCard
        v-for="(card, index) in copy.cards"
        :key="card.title"
        variant="inline"
        :tone="cardStyles[index].tone"
        :icon="cardStyles[index].icon"
        :title="card.title"
        :text="card.text"
      />
    </div>

    <EducationClosingNotice
      icon="balance"
      tone="purple"
      :title="copy.proposalTitle"
      :text="copy.proposalText"
    />
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import EducationClosingNotice from 'src/components/EducationClosingNotice.vue';
import EducationContentCard from 'src/components/EducationContentCard.vue';
import { educationPlanningTranslations } from 'src/i18n/educationPlanningTranslations.js';

const { locale } = useI18n({ useScope: 'global' });
const copy = computed(
  () =>
    educationPlanningTranslations[locale.value]?.yearEnd ||
    educationPlanningTranslations['en-US'].yearEnd,
);
const cardStyles = [
  { icon: 'celebration', tone: 'purple' },
  { icon: 'hotel', tone: 'green' },
  { icon: 'volunteer_activism', tone: 'pink' },
  { icon: 'work_history', tone: 'amber' },
];
</script>

<style scoped>
.education-year-boundary {
  border-top: 1px solid color-mix(in srgb, var(--calendar-sunday-text) 28%, transparent);
}

.education-year-boundary .education-eyebrow {
  color: var(--calendar-sunday-text);
}

.education-year-boundary__sequence {
  max-width: 1080px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  margin: 0 auto 26px;
  padding: 16px;
  background: var(--app-surface-raised);
  border: 1px solid var(--app-border);
  border-radius: 18px;
}

.education-year-boundary__sequence > span,
.education-year-boundary__sequence > strong {
  min-height: 48px;
  display: grid;
  place-items: center;
  padding: 9px 12px;
  border: 1px solid var(--app-border);
  border-radius: 12px;
  color: var(--app-text-muted);
  background: var(--app-surface);
  font-size: 12px;
  text-align: center;
}

.education-year-boundary__sequence > strong {
  color: var(--app-accent-green-text);
  background: var(--app-accent-green-soft);
  border-color: var(--app-accent-green-border);
}

.education-year-boundary__sequence .education-year-boundary__leap {
  color: var(--app-accent-amber-text);
  background: color-mix(in srgb, var(--app-accent-amber-soft) 58%, var(--app-surface));
  border-color: var(--app-accent-amber-border);
}

.education-year-boundary__leap small {
  display: block;
  margin-top: 2px;
  color: var(--app-text-faint);
  font-size: 9px;
  line-height: 1.2;
}

.education-year-boundary__sequence .q-icon {
  color: var(--app-text-faint);
}

.education-year-boundary__cards {
  --content-card-min-height: 184px;

  max-width: 1080px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin: 0 auto;
}

@media (max-width: 850px) {
  .education-year-boundary__sequence {
    grid-template-columns: 1fr;
  }

  .education-year-boundary__sequence .q-icon {
    transform: rotate(90deg);
    justify-self: center;
  }
}

@media (max-width: 720px) {
  .education-year-boundary__cards {
    --content-card-min-height: 0px;

    grid-template-columns: 1fr;
  }
}
</style>
