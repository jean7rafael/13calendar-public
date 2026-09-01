<template>
  <section
    id="education-holiday-rhythm"
    class="education-section education-holiday-rhythm"
    aria-labelledby="education-holiday-rhythm-title"
  >
    <div class="education-section__heading">
      <p class="education-eyebrow">{{ copy.eyebrow }}</p>
      <h2 id="education-holiday-rhythm-title">{{ copy.title }}</h2>
      <p>{{ copy.introduction }}</p>
    </div>

    <!-- A comemoração original e a folga observada são apresentadas como
         conceitos complementares, não como uma substituição automática. -->
    <div class="education-holiday-rhythm__concepts">
      <article v-for="(card, index) in copy.cards" :key="card.title">
        <q-icon :name="conceptIcons[index]" aria-hidden="true" />
        <div>
          <h3>{{ card.title }}</h3>
          <p>{{ card.text }}</p>
        </div>
      </article>
    </div>

    <div class="education-holiday-rhythm__example">
      <div class="education-holiday-rhythm__calendar-column">
        <header>
          <p>{{ copy.windowsEyebrow }}</p>
          <h3>{{ copy.windowsTitle }}</h3>
          <span>{{ copy.windowsText }}</span>
        </header>

        <!-- Todo mês fixo começa no domingo; por isso a primeira segunda é
             sempre o dia 2 e a última sexta é sempre o dia 27. -->
        <div class="education-holiday-rhythm__calendar" :aria-label="copy.windowsTitle">
          <span
            v-for="weekday in weekDaysShort"
            :key="weekday"
            class="education-holiday-rhythm__weekday"
          >
            {{ weekday }}
          </span>
          <span
            v-for="day in 28"
            :key="day"
            class="education-holiday-rhythm__day"
            :class="{
              'education-holiday-rhythm__day--first': day === 2,
              'education-holiday-rhythm__day--last': day === 27,
            }"
          >
            {{ day }}
          </span>
        </div>

        <div class="education-holiday-rhythm__windows">
          <span class="education-holiday-rhythm__window--first">
            <i aria-hidden="true" />{{ copy.firstMonday }}
          </span>
          <span class="education-holiday-rhythm__window--last">
            <i aria-hidden="true" />{{ copy.lastFriday }}
          </span>
        </div>
      </div>

      <!-- A regra em três passos explicita que uma janela só é usada quando
           uma autoridade decide deslocar a folga de uma data específica. -->
      <div class="education-holiday-rhythm__rule">
        <p>{{ copy.ruleEyebrow }}</p>
        <h3>{{ copy.ruleTitle }}</h3>
        <ol>
          <li v-for="(step, index) in copy.steps" :key="step">
            <strong>{{ index + 1 }}</strong>
            <span>{{ step }}</span>
          </li>
        </ol>
      </div>
    </div>

    <EducationClosingNotice
      icon="event_busy"
      tone="pink"
      :title="copy.cautionTitle"
      :text="copy.cautionText"
    />
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCalendarTranslations } from 'src/composables/useCalendarTranslations';
import EducationClosingNotice from 'src/components/EducationClosingNotice.vue';
import { educationHolidayTranslations } from 'src/i18n/educationHolidayTranslations.js';

const { locale } = useI18n({ useScope: 'global' });
const { weekDaysShort } = useCalendarTranslations();

const copy = computed(
  () => educationHolidayTranslations[locale.value] || educationHolidayTranslations['en-US'],
);
const conceptIcons = ['history', 'event_available'];
</script>

<style scoped>
.education-holiday-rhythm {
  border-top: 1px solid color-mix(in srgb, var(--app-accent-amber-border) 60%, transparent);
}

.education-holiday-rhythm .education-eyebrow,
.education-holiday-rhythm__example > div > header > p,
.education-holiday-rhythm__rule > p {
  color: var(--app-accent-amber-text);
}

.education-holiday-rhythm__concepts {
  max-width: 1080px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin: 0 auto 22px;
}

.education-holiday-rhythm__concepts article {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: clamp(22px, 3vw, 28px);
  background: color-mix(in srgb, var(--app-accent-purple-soft) 62%, var(--app-surface));
  border: 1px solid var(--app-accent-purple-border);
  border-radius: 20px;
}

.education-holiday-rhythm__concepts article:nth-child(2) {
  background: color-mix(in srgb, var(--app-accent-green-soft) 62%, var(--app-surface));
  border-color: var(--app-accent-green-border);
}

.education-holiday-rhythm__concepts .q-icon {
  flex: none;
  color: var(--app-accent-purple-text);
  font-size: 30px;
}

.education-holiday-rhythm__concepts article:nth-child(2) .q-icon {
  color: var(--app-accent-green-text);
}

.education-holiday-rhythm__concepts h3 {
  margin: 0 0 8px;
  color: var(--app-text);
  font-size: 20px;
  line-height: 1.25;
}

.education-holiday-rhythm__concepts p {
  margin: 0;
  color: var(--app-text-muted);
  font-size: 13px;
  line-height: 1.65;
}

.education-holiday-rhythm__example {
  max-width: 1080px;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  gap: 18px;
  margin: 0 auto;
}

.education-holiday-rhythm__calendar-column,
.education-holiday-rhythm__rule {
  padding: clamp(22px, 3vw, 30px);
  background: var(--app-surface-raised);
  border: 1px solid var(--app-border);
  border-radius: 20px;
}

.education-holiday-rhythm__calendar-column header > p,
.education-holiday-rhythm__rule > p {
  margin: 0 0 7px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.education-holiday-rhythm__calendar-column h3,
.education-holiday-rhythm__rule h3 {
  margin: 0;
  color: var(--app-text);
  font-size: 22px;
  line-height: 1.2;
}

.education-holiday-rhythm__calendar-column header > span {
  display: block;
  margin-top: 8px;
  color: var(--app-text-muted);
  font-size: 12px;
  line-height: 1.55;
}

.education-holiday-rhythm__calendar {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 5px;
  margin-top: 20px;
}

.education-holiday-rhythm__weekday {
  padding: 5px 2px;
  color: var(--app-text-faint);
  font-size: 9px;
  font-weight: 800;
  text-align: center;
  text-transform: uppercase;
}

.education-holiday-rhythm__day {
  min-height: 36px;
  display: grid;
  place-items: center;
  color: var(--app-text-muted);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
}

.education-holiday-rhythm__day--first {
  color: var(--app-accent-green-text);
  background: var(--app-accent-green-soft);
  border-color: var(--app-accent-green-border);
}

.education-holiday-rhythm__day--last {
  color: var(--app-accent-amber-text);
  background: var(--app-accent-amber-soft);
  border-color: var(--app-accent-amber-border);
}

.education-holiday-rhythm__windows {
  display: flex;
  flex-wrap: wrap;
  gap: 9px 16px;
  margin-top: 15px;
}

.education-holiday-rhythm__windows span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--app-text-muted);
  font-size: 10px;
}

.education-holiday-rhythm__windows i {
  width: 10px;
  height: 10px;
  background: var(--app-accent-green-soft);
  border: 1px solid var(--app-accent-green-border);
  border-radius: 3px;
}

.education-holiday-rhythm__windows .education-holiday-rhythm__window--last i {
  background: var(--app-accent-amber-soft);
  border-color: var(--app-accent-amber-border);
}

.education-holiday-rhythm__rule ol {
  display: grid;
  gap: 14px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
}

.education-holiday-rhythm__rule li {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  align-items: start;
  gap: 11px;
  color: var(--app-text-muted);
  font-size: 12px;
  line-height: 1.55;
}

.education-holiday-rhythm__rule li strong {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  color: var(--app-accent-amber-text);
  background: var(--app-accent-amber-soft);
  border: 1px solid var(--app-accent-amber-border);
  border-radius: 50%;
  font-size: 11px;
}

@media (max-width: 760px) {
  .education-holiday-rhythm__concepts,
  .education-holiday-rhythm__example {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 390px) {
  .education-holiday-rhythm__calendar-column {
    padding-inline: 14px;
  }

  .education-holiday-rhythm__calendar {
    gap: 3px;
  }

  .education-holiday-rhythm__day {
    min-height: 31px;
    font-size: 10px;
  }
}
</style>
