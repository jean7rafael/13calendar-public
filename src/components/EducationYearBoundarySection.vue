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

    <div class="education-year-boundary__cards">
      <article
        v-for="(card, index) in copy.cards"
        :key="card.title"
        :class="`education-year-boundary__card--${cardStyles[index].tone}`"
      >
        <q-icon :name="cardStyles[index].icon" aria-hidden="true" />
        <div>
          <h3>{{ card.title }}</h3>
          <p>{{ card.text }}</p>
        </div>
      </article>
    </div>

    <aside class="education-year-boundary__proposal">
      <div>
        <q-icon name="balance" aria-hidden="true" />
        <h3>{{ copy.proposalTitle }}</h3>
      </div>
      <p>{{ copy.proposalText }}</p>
    </aside>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
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
  max-width: 1080px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin: 0 auto;
}

.education-year-boundary__cards article {
  --card-color: var(--app-accent-purple-text);
  --card-soft: var(--app-accent-purple-soft);
  --card-border: var(--app-accent-purple-border);

  min-height: 184px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: clamp(22px, 3vw, 28px);
  color: var(--card-color);
  background: color-mix(in srgb, var(--card-soft) 78%, var(--app-surface));
  border: 1px solid var(--card-border);
  border-radius: 20px;
}

.education-year-boundary__card--green {
  --card-color: var(--app-accent-green-text) !important;
  --card-soft: var(--app-accent-green-soft) !important;
  --card-border: var(--app-accent-green-border) !important;
}

.education-year-boundary__card--pink {
  --card-color: var(--calendar-sunday-text) !important;
  --card-soft: var(--calendar-sunday-cell) !important;
  --card-border: color-mix(in srgb, var(--calendar-sunday-text) 34%, transparent) !important;
}

.education-year-boundary__card--amber {
  --card-color: var(--app-accent-amber-text) !important;
  --card-soft: var(--app-accent-amber-soft) !important;
  --card-border: var(--app-accent-amber-border) !important;
}

.education-year-boundary__cards .q-icon {
  width: 42px;
  height: 42px;
  flex: none;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--card-soft) 80%, transparent);
  border: 1px solid var(--card-border);
  border-radius: 13px;
  font-size: 23px;
}

.education-year-boundary__cards h3 {
  margin: 1px 0 8px;
  font-size: 21px;
  line-height: 1.2;
}

.education-year-boundary__cards p {
  margin: 0;
  color: var(--app-text-muted);
  font-size: 14px;
  line-height: 1.65;
}

.education-year-boundary__proposal {
  max-width: 1080px;
  display: grid;
  grid-template-columns: minmax(220px, 0.65fr) minmax(0, 1.35fr);
  align-items: center;
  gap: 24px;
  margin: 22px auto 0;
  padding: clamp(22px, 3vw, 30px);
  background:
    radial-gradient(circle at 0 0, var(--app-accent-purple-soft), transparent 48%),
    var(--app-surface-raised);
  border: 1px solid var(--app-accent-purple-border);
  border-radius: 20px;
  box-shadow: var(--app-card-shadow);
}

.education-year-boundary__proposal > div {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--app-accent-purple-text);
}

.education-year-boundary__proposal .q-icon {
  font-size: 28px;
}

.education-year-boundary__proposal h3,
.education-year-boundary__proposal p {
  margin: 0;
}

.education-year-boundary__proposal h3 {
  font-size: 20px;
  line-height: 1.25;
}

.education-year-boundary__proposal p {
  color: var(--app-text-muted);
  font-size: 14px;
  line-height: 1.65;
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
    grid-template-columns: 1fr;
  }

  .education-year-boundary__cards article {
    min-height: 0;
  }

  .education-year-boundary__proposal {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  .education-year-boundary__cards article {
    display: block;
  }

  .education-year-boundary__cards .q-icon {
    margin-bottom: 16px;
  }
}
</style>
