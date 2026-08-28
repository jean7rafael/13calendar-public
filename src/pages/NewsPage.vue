<template>
  <q-page class="news-page">
    <AppPageHero
      icon="newspaper"
      :eyebrow="t('education.resources.eyebrow')"
      :title="t('education.resources.title')"
      :description="t('education.resources.description')"
    />

    <main>
      <EducationResourcesSection :show-heading="false" />
    </main>

  </q-page>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';
import EducationResourcesSection from 'src/components/EducationResourcesSection.vue';
import AppPageHero from 'src/components/AppPageHero.vue';

const { t } = useI18n({ useScope: 'global' });
const canonicalUrl = 'https://13calendar.pages.dev/news';

useMeta(() => ({
  script: {
    structuredData: {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: t('education.resources.title'),
        description: t('education.resources.description'),
        url: canonicalUrl,
        isAccessibleForFree: true,
      }),
    },
  },
}));
</script>

<style scoped>
.news-page {
  padding-top: 24px;
  color: var(--app-text);
}

.news-page main {
  min-height: calc(100vh - 300px);
}

.news-page :deep(.education-resources) {
  padding-top: 26px;
}
</style>
