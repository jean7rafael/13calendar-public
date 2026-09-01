<template>
  <section
    id="education-sabbath"
    class="education-sabbath-reference"
    aria-labelledby="education-sabbath-title"
  >
    <div class="education-sabbath-reference__heading">
      <p class="education-sabbath-reference__eyebrow">{{ copy.eyebrow }}</p>
      <h2 id="education-sabbath-title">{{ copy.title }}</h2>
      <p>{{ copy.introduction }}</p>
    </div>

    <div class="education-sabbath-reference__panel">
      <!-- Os quatro cards usam uma anatomia única. A coluna esquerda descreve
           a opção 1 e a direita a opção 2, inclusive nas consequências. -->
      <div class="education-sabbath-reference__cards">
        <article
          v-for="card in sabbathCards"
          :key="`${card.number}-${card.title}`"
          :class="`education-sabbath-reference__card--${card.tone}`"
        >
          <span aria-hidden="true">{{ card.number }}</span>
          <h3>{{ card.title }}</h3>
          <p>{{ card.text }}</p>
          <small>{{ card.highlight }}</small>
        </article>
      </div>

      <div class="education-sabbath-reference__sequences">
        <div>
          <p>{{ copy.civilLabel }}</p>
          <div>
            <template v-for="(value, index) in civilSequence" :key="value">
              <span
                class="education-sabbath-reference__sequence-item education-sabbath-reference__sequence-item--green"
              >
                {{ value }}
              </span>
              <q-icon
                v-if="index < civilSequence.length - 1"
                name="arrow_forward"
                aria-hidden="true"
              />
            </template>
          </div>
        </div>

        <div>
          <p>{{ copy.continuousLabel }}</p>
          <div>
            <template v-for="(value, index) in continuousSequence" :key="value">
              <span
                class="education-sabbath-reference__sequence-item education-sabbath-reference__sequence-item--amber"
              >
                {{ value }}
              </span>
              <q-icon
                v-if="index < continuousSequence.length - 1"
                name="arrow_forward"
                aria-hidden="true"
              />
            </template>
          </div>
        </div>
      </div>

      <EducationClosingNotice
        icon="sync_problem"
        tone="amber"
        :title="copy.limitationTitle"
        :text="copy.limitationText"
      />

      <p class="education-sabbath-reference__sources">
        {{ copy.sources }}:
        <a
          href="https://www.jta.org/archive/religious-protests-move-league-to-drop-calendar-reform-agenda"
          target="_blank"
          rel="noopener noreferrer"
          >JTA, 1 Oct. 1937</a
        >
        ·
        <a
          href="https://www.un.org/en/about-us/history-of-the-un"
          target="_blank"
          rel="noopener noreferrer"
          >United Nations, 1945</a
        >
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import EducationClosingNotice from 'src/components/EducationClosingNotice.vue';
import { educationSabbathTranslations } from 'src/i18n/educationSabbathTranslations.js';

const { locale } = useI18n({ useScope: 'global' });

const copy = computed(
  () => educationSabbathTranslations[locale.value] || educationSabbathTranslations['en-US'],
);
const sabbathCards = computed(() => [
  {
    number: 1,
    tone: 'purple',
    title: copy.value.solutionTitle,
    text: copy.value.solutionText,
    highlight: copy.value.solutionHighlight,
  },
  {
    number: 2,
    tone: 'pink',
    title: copy.value.alternativeTitle,
    text: copy.value.alternativeText,
    highlight: copy.value.alternativeCost,
  },
  {
    number: 1,
    tone: 'green',
    title: copy.value.civilTitle,
    text: copy.value.civilText,
    highlight: copy.value.civilHighlight,
  },
  {
    number: 2,
    tone: 'amber',
    title: copy.value.continuousTitle,
    text: copy.value.continuousText,
    highlight: copy.value.continuousHighlight,
  },
]);
const civilSequence = computed(() => [copy.value.saturday, copy.value.yearDay, copy.value.sunday]);
const continuousSequence = computed(() => [
  copy.value.seventhDay,
  copy.value.firstDay,
  copy.value.secondDay,
]);
</script>

<style scoped>
.education-sabbath-reference {
  scroll-margin-top: 78px;
  padding: clamp(72px, 10vw, 132px) 24px;
  border-top: 1px solid color-mix(in srgb, var(--app-accent-purple-border) 55%, transparent);
}

.education-sabbath-reference__heading {
  max-width: 780px;
  margin: 0 auto 48px;
  text-align: center;
}

.education-sabbath-reference__eyebrow {
  margin: 0 0 10px !important;
  color: var(--app-accent-purple-text) !important;
  font-size: 11px !important;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.education-sabbath-reference__heading h2 {
  margin: 0;
  font-size: clamp(34px, 6vw, 56px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.education-sabbath-reference__heading > p:last-child {
  margin: 18px 0 0;
  color: var(--app-text-muted);
  font-size: 16px;
  line-height: 1.65;
}

.education-sabbath-reference__panel {
  max-width: 1040px;
  margin: 0 auto;
  padding: clamp(20px, 4vw, 40px);
  background: color-mix(in srgb, var(--app-surface-raised) 82%, transparent);
  border: 1px solid var(--app-accent-purple-border);
  border-radius: 24px;
  box-shadow: var(--app-card-shadow);
}

.education-sabbath-reference__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 26px;
}

.education-sabbath-reference__cards article {
  --card-color: var(--app-accent-purple-text);
  --card-soft: var(--app-accent-purple-soft);
  --card-border: var(--app-accent-purple-border);

  display: grid;
  grid-template-rows: auto auto 1fr auto;
  align-items: start;
  padding: 24px;
  color: var(--card-color);
  background: var(--card-soft);
  border: 1px solid var(--card-border);
  border-radius: 16px;
}

.education-sabbath-reference__cards article > span {
  width: 27px;
  height: 27px;
  display: grid;
  place-items: center;
  margin-bottom: 10px;
  background: color-mix(in srgb, var(--card-color) 18%, transparent);
  border-radius: 50%;
  font-size: 11px;
  font-weight: 800;
}

.education-sabbath-reference__cards h3 {
  margin: 0 0 8px;
  font-size: 21px;
  line-height: 1.3;
}

.education-sabbath-reference__cards p {
  margin: 0;
  color: var(--app-text-muted);
  font-size: 14px;
  line-height: 1.65;
}

.education-sabbath-reference__cards small {
  display: block;
  margin-top: 13px;
  color: var(--card-color);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.55;
}

.education-sabbath-reference__card--pink {
  --card-color: var(--calendar-sunday-text) !important;
  --card-soft: var(--calendar-sunday-cell) !important;
  --card-border: color-mix(in srgb, var(--calendar-sunday-text) 34%, transparent) !important;
}

.education-sabbath-reference__card--green {
  --card-color: var(--app-accent-green-text) !important;
  --card-soft: var(--app-accent-green-soft) !important;
  --card-border: var(--app-accent-green-border) !important;
}

.education-sabbath-reference__card--amber {
  --card-color: var(--app-accent-amber-text) !important;
  --card-soft: var(--app-accent-amber-soft) !important;
  --card-border: var(--app-accent-amber-border) !important;
}

.education-sabbath-reference__sequences {
  overflow: hidden;
  margin-bottom: 26px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 16px;
}

/* Mantém a superfície dos quatro cards uniforme; a faixa final compartilhada
   abaixo concentra a conclusão editorial sem outro título ampliado. */
.education-sabbath-reference__panel :deep(.education-closing-notice) {
  max-width: none;
}

/* Regras preservadas da visualização sequencial. */
.education-sabbath-reference__sequence-item {
  min-width: 0;
  flex: 1;
  padding: 10px 7px;
}

.education-sabbath-reference__sequences > div {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  padding: 16px;
}

.education-sabbath-reference__sequences > div + div {
  border-top: 1px solid var(--app-border);
}

.education-sabbath-reference__sequences p {
  margin: 0;
  color: var(--app-text-faint);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.education-sabbath-reference__sequences > div > div {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 7px;
}

.education-sabbath-reference__sequences .q-icon {
  flex: 0 0 auto;
  color: var(--app-text-faint);
}

.education-sabbath-reference__sequence-item {
  border: 1px solid var(--app-border);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

.education-sabbath-reference__sequence-item--green {
  color: var(--app-accent-green-text);
  background: var(--app-accent-green-soft);
  border-color: var(--app-accent-green-border);
}

.education-sabbath-reference__sequence-item--amber {
  color: var(--app-accent-amber-text);
  background: var(--app-accent-amber-soft);
  border-color: var(--app-accent-amber-border);
}

.education-sabbath-reference__sources {
  margin: 24px 0 0;
  color: var(--app-text-faint);
  font-size: 11px;
  text-align: center;
}

.education-sabbath-reference__sources a {
  color: inherit;
  text-underline-offset: 3px;
}

.education-sabbath-reference__sources a:hover,
.education-sabbath-reference__sources a:focus-visible {
  color: var(--app-accent-purple-text);
}

@media (max-width: 700px) {
  .education-sabbath-reference {
    padding-inline: 16px;
  }

  .education-sabbath-reference__cards {
    grid-template-columns: 1fr;
  }

  .education-sabbath-reference__sequences > div {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 430px) {
  .education-sabbath-reference__panel {
    padding: 14px;
  }

  .education-sabbath-reference__cards article {
    padding: 19px;
  }

  .education-sabbath-reference__sequences > div > div {
    gap: 4px;
  }

  .education-sabbath-reference__sequence-item {
    padding-inline: 4px;
    font-size: 9px;
  }
}
</style>
