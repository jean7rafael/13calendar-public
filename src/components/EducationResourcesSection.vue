<template>
  <section
    class="education-section education-resources"
    aria-labelledby="education-resources-title"
  >
    <div v-if="showHeading" class="education-section__heading">
      <p class="education-eyebrow">{{ t('education.resources.eyebrow') }}</p>
      <h2 id="education-resources-title">{{ t('education.resources.title') }}</h2>
      <p>{{ t('education.resources.description') }}</p>
    </div>

    <div class="education-resources__searches">
      <q-btn
        no-caps
        unelevated
        class="app-action app-action--secondary"
        icon="search"
        :label="t('education.resources.searchGoogle')"
        href="https://www.google.com/search?q=%22International+Fixed+Calendar%22+OR+%2213-month+calendar%22"
        target="_blank"
        rel="noopener noreferrer"
      />
      <q-btn
        no-caps
        unelevated
        class="app-action app-action--tertiary"
        icon="newspaper"
        :label="t('education.resources.searchNews')"
        href="https://news.google.com/search?q=%22International%20Fixed%20Calendar%22%20OR%20%2213-month%20calendar%22"
        target="_blank"
        rel="noopener noreferrer"
      />
    </div>

    <q-btn-toggle
      v-model="activeCollection"
      no-caps
      unelevated
      rounded
      color="transparent"
      text-color="grey-6"
      toggle-color="primary"
      toggle-text-color="white"
      :options="collectionOptions"
      class="education-resources__toggle"
    />

    <div class="education-resources__grid" role="list">
      <article v-for="item in visibleItems" :key="item.url" role="listitem">
        <div class="education-resources__meta">
          <q-chip dense square color="primary" text-color="white">
            {{ t(`education.resources.types.${item.type}`) }}
          </q-chip>
          <span>{{ item.publisher }}</span>
          <time v-if="item.published" :datetime="item.published">
            {{ formatPublishedDate(item.published) }}
          </time>
        </div>

        <!-- O título identifica a publicação original; o resumo é sempre
             editorial e localizado pelo 13 Calendar. -->
        <h3 lang="en">{{ item.title }}</h3>
        <p :lang="locale.split('-')[0]">{{ localizedSummary(item) }}</p>

        <div class="education-resources__footer">
          <span>{{ localizedLanguageLabel(item) }}</span>
          <a :href="item.url" target="_blank" rel="noopener noreferrer">
            {{ t('education.resources.open') }}
            <q-icon name="open_in_new" aria-hidden="true" />
          </a>
        </div>
      </article>
    </div>

    <AppNoticePanel class="education-resources__notice" tone="amber" icon="info">
      <p>{{ t('education.resources.notice') }}</p>
      <small>{{ t('education.resources.updated', { date: reviewedDate }) }}</small>
    </AppNoticePanel>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { educationNews, educationSites } from 'src/data/educationResources';
import {
  localizedResourceLanguageLabels,
  localizedResourceSummaries,
} from 'src/i18n/educationResourceTranslations';
import AppNoticePanel from 'src/components/AppNoticePanel.vue';

defineProps({
  showHeading: {
    type: Boolean,
    default: true,
  },
});

const { t, locale } = useI18n({ useScope: 'global' });
const activeCollection = ref('news');
const reviewedDate = computed(() => formatPublishedDate('2026-08-26'));

const collectionOptions = computed(() => [
  { label: t('education.resources.news'), value: 'news', icon: 'newspaper' },
  { label: t('education.resources.sites'), value: 'sites', icon: 'language' },
]);

const visibleItems = computed(() =>
  activeCollection.value === 'news' ? educationNews : educationSites,
);

function localizedSummary(item) {
  if (locale.value === 'en-US') return item.summary.en;
  if (locale.value === 'pt-BR') return item.summary.pt;

  return localizedResourceSummaries[locale.value]?.[item.id] || item.summary.en;
}

function localizedLanguageLabel(item) {
  return (
    localizedResourceLanguageLabels[locale.value]?.[item.languageKey] ||
    localizedResourceLanguageLabels['en-US'][item.languageKey]
  );
}

function formatPublishedDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);

  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
</script>

<style scoped>
.education-resources__searches {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: -18px auto 26px;
}

.education-resources__toggle {
  display: flex;
  width: fit-content;
  margin: 0 auto 24px;
}

.education-resources__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  max-width: 1040px;
  margin: 0 auto;
}

.education-resources__grid article {
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 22px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 18px;
  box-shadow: 0 8px 24px rgb(15 23 42 / 4%);
}

.education-resources__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  color: var(--app-text-faint);
  font-size: 10px;
}

.education-resources__meta .q-chip {
  margin: 0;
  font-size: 9px;
}

.education-resources__grid h3 {
  margin: 18px 0 9px;
  font-size: 18px;
  line-height: 1.35;
}

.education-resources__grid p {
  flex: 1 1 auto;
  margin: 0;
  color: var(--app-text-muted);
  line-height: 1.65;
}

.education-resources__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 22px;
  padding-top: 15px;
  border-top: 1px solid var(--app-border);
}

.education-resources__footer > span {
  color: var(--app-text-faint);
  font-size: 10px;
}

.education-resources__footer a {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--app-primary-text);
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.education-resources__notice {
  max-width: 1040px;
  margin: 18px auto 0;
}

@media (max-width: 700px) {
  .education-resources__grid {
    grid-template-columns: 1fr;
  }

  .education-resources__searches {
    flex-direction: column;
  }
}

@media (max-width: 420px) {
  .education-resources__toggle {
    width: 100%;
  }

  .education-resources__toggle :deep(.q-btn) {
    min-width: 0;
    flex: 1 1 50%;
    padding-inline: 8px;
    font-size: 11px;
  }

  .education-resources__footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
