<template>
  <q-page class="moon-page">
    <AppPageHero
      icon="brightness_3"
      :eyebrow="t('education.moon.eyebrow')"
      :title="t('education.moon.title')"
      :description="t('education.moon.intro')"
    />

    <main>
      <EducationMoonSection :show-heading="false" />
      <CalendarContextSection
        context-title-id="moon-methodology-title"
        :eyebrow="t('education.sources.eyebrow')"
        :title="t('education.sources.title')"
        :description="t('education.sources.description')"
        :topics="methodologyTopics"
      />
    </main>
  </q-page>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';
import AppPageHero from 'src/components/AppPageHero.vue';
import CalendarContextSection from 'src/components/CalendarContextSection.vue';
import EducationMoonSection from 'src/components/EducationMoonSection.vue';

const { t } = useI18n({ useScope: 'global' });
const canonicalUrl = 'https://13calendar.pages.dev/moon';
const methodologyTopics = computed(() => [
  {
    title: t('education.sources.nasa'),
    text: t('education.sources.nasaMethodText'),
    tone: 'source',
    href: 'https://science.nasa.gov/moon/moon-phases/',
  },
  {
    title: t('education.sources.calendarPolicy'),
    text: t('education.sources.calendarMethodText'),
    tone: 'privacy',
    href: 'https://github.com/jean7rafael/13calendar-public#calendar-standard',
  },
  {
    title: t('education.sources.productRoadmap'),
    text: t('education.sources.productMethodText'),
    tone: 'limits',
    href: 'https://github.com/jean7rafael/13calendar/blob/feature/vue-educational-migration/docs/PRODUCT_ROADMAP_AND_LUNAR_POLICY.md',
  },
]);

useMeta(() => ({
  script: {
    structuredData: {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        name: t('education.moon.title'),
        description: t('education.moon.intro'),
        url: canonicalUrl,
        isAccessibleForFree: true,
      }),
    },
  },
}));
</script>

<style scoped>
.moon-page {
  padding-top: 24px;
  color: var(--app-text);
}

.moon-page main {
  overflow: hidden;
}

.moon-page :deep(.education-moon) {
  padding-top: 26px;
}
</style>
