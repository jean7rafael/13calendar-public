<template>
  <q-page class="tools-page">
    <main>
      <section class="tools-hero" aria-labelledby="tools-title">
        <div>
          <p class="education-eyebrow">{{ t('education.tools.hero.eyebrow') }}</p>
          <h1 id="tools-title">{{ t('education.tools.hero.title') }}</h1>
          <p>{{ t('education.tools.hero.description') }}</p>
          <div class="tools-hero__actions app-action-group">
            <q-btn
              no-caps
              unelevated
              icon-right="arrow_downward"
              class="app-action app-action--primary"
              :label="t('education.tools.hero.start')"
              href="#share-date"
            />
            <q-btn
              no-caps
              unelevated
              class="app-action app-action--secondary"
              icon="auto_stories"
              :label="t('education.toolbarTitle')"
              :to="{ name: 'education' }"
            />
          </div>
        </div>

        <nav class="tools-hero__map" :aria-label="t('education.tools.hero.map')">
          <a v-for="item in toolMap" :key="item.href" :href="item.href">
            <q-icon :name="item.icon" aria-hidden="true" />
            <span>{{ item.label }}</span>
          </a>
        </nav>
      </section>

      <ToolsShareCard />
      <ToolsBirthdayCard />
      <ToolsEditorialCards />
      <ToolsAnnualPlanner />
      <ToolsAstronomyLayers />
      <ToolsLocalFavorites />
      <ToolsWidgetConfigurator />
      <ToolsPwaCard />

      <section class="tools-cta" aria-labelledby="tools-cta-title">
        <h2 id="tools-cta-title">{{ t('education.tools.cta.title') }}</h2>
        <p>{{ t('education.tools.cta.description') }}</p>
        <div class="app-action-group">
          <q-btn
            no-caps
            unelevated
            icon="calendar_month"
            class="app-action app-action--primary"
            :label="t('education.cta.calendars')"
            :to="{ name: 'home' }"
          />
          <q-btn
            no-caps
            unelevated
            class="app-action app-action--tertiary"
            icon="groups"
            :label="t('education.cta.community')"
            :to="{ name: 'community' }"
          />
        </div>
      </section>
    </main>

  </q-page>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';
import ToolsAnnualPlanner from 'src/components/ToolsAnnualPlanner.vue';
import ToolsAstronomyLayers from 'src/components/ToolsAstronomyLayers.vue';
import ToolsBirthdayCard from 'src/components/ToolsBirthdayCard.vue';
import ToolsEditorialCards from 'src/components/ToolsEditorialCards.vue';
import ToolsLocalFavorites from 'src/components/ToolsLocalFavorites.vue';
import ToolsPwaCard from 'src/components/ToolsPwaCard.vue';
import ToolsShareCard from 'src/components/ToolsShareCard.vue';
import ToolsWidgetConfigurator from 'src/components/ToolsWidgetConfigurator.vue';

const { t } = useI18n({ useScope: 'global' });
const canonicalUrl = 'https://13calendar.pages.dev/tools';

const toolMap = computed(() => [
  { href: '#share-date', icon: 'share', label: t('education.tools.share.title') },
  { href: '#birthday', icon: 'cake', label: t('education.tools.birthday.title') },
  { href: '#annual-planner', icon: 'view_week', label: t('education.tools.planner.title') },
  { href: '#astronomy', icon: 'public', label: t('education.tools.astronomy.title') },
  { href: '#favorites', icon: 'bookmark', label: t('education.tools.favorites.title') },
  { href: '#widget', icon: 'widgets', label: t('education.tools.widget.title') },
]);

useMeta(() => {
  const title = t('education.tools.browserTitle');
  const description = t('education.tools.hero.description');
  return {
    script: {
      structuredData: {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: title,
          description,
          url: canonicalUrl,
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Any',
          isAccessibleForFree: true,
          featureList: [
            t('education.tools.share.title'),
            t('education.tools.birthday.title'),
            t('education.tools.planner.title'),
            t('education.tools.planner.exportIcs'),
            t('education.tools.astronomy.title'),
            t('education.tools.favorites.title'),
            t('education.tools.widget.title'),
            t('education.tools.pwa.title'),
          ],
        }),
      },
    },
  };
});
</script>

<style scoped>
.tools-page {
  color: var(--app-text);
}

.tools-page main {
  overflow: hidden;
}

.tools-hero {
  min-height: min(720px, calc(100vh - 58px));
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(390px, 0.8fr);
  align-items: center;
  gap: clamp(34px, 7vw, 90px);
  max-width: 1240px;
  margin: 0 auto;
  padding: 78px 34px;
}

.tools-hero h1 {
  max-width: 740px;
  margin: 10px 0 20px;
  font-size: clamp(44px, 7vw, 82px);
  font-weight: 850;
  line-height: 0.98;
  letter-spacing: -0.055em;
}

.tools-hero > div > p:not(.education-eyebrow) {
  max-width: 680px;
  margin: 0;
  color: var(--app-text-muted);
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.65;
}

.tools-hero__actions {
  --app-action-group-max: 520px;
  --app-action-min-width: 240px;

  margin-top: 28px;
}

.tools-hero__map {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding: 18px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 26px;
  box-shadow: var(--app-card-shadow);
}

.tools-hero__map a {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 18px;
  color: var(--app-text);
  background: var(--app-primary-soft);
  border: 1px solid transparent;
  border-radius: 17px;
  font-weight: 700;
  text-decoration: none;
  transition:
    border-color 160ms ease,
    transform 160ms ease;
}

.tools-hero__map a:hover,
.tools-hero__map a:focus-visible {
  border-color: var(--app-primary-text);
  transform: translateY(-2px);
}

.tools-hero__map .q-icon {
  color: var(--app-primary-text);
  font-size: 27px;
}

.tools-cta {
  max-width: 980px;
  margin: 30px auto 90px;
  padding: 54px 26px;
  color: white;
  background: linear-gradient(135deg, #312e81, #6d28d9);
  border-radius: 28px;
  text-align: center;
}

.tools-cta h2 {
  margin: 0;
  font-size: clamp(28px, 5vw, 44px);
}

.tools-cta p {
  max-width: 650px;
  margin: 12px auto 24px;
  color: rgb(255 255 255 / 74%);
}

.tools-cta > div {
  --app-action-group-max: 520px;
  --app-action-min-width: 230px;

  margin-inline: auto;
}

.tools-cta :deep(.q-btn--outline) {
  color: white !important;
}

@media (max-width: 900px) {
  .tools-hero {
    grid-template-columns: 1fr;
    min-height: 0;
    text-align: center;
  }

  .tools-hero h1,
  .tools-hero > div > p:not(.education-eyebrow) {
    margin-inline: auto;
  }

  .tools-hero__actions {
    margin-inline: auto;
  }
}

@media (max-width: 560px) {
  .tools-hero {
    padding: 54px 18px;
  }

  .tools-hero h1 {
    font-size: clamp(40px, 14vw, 58px);
  }

  .tools-hero__map {
    grid-template-columns: 1fr;
  }

  .tools-hero__map a {
    min-height: 88px;
  }

  .tools-cta {
    margin-inline: 14px;
  }
}
</style>
