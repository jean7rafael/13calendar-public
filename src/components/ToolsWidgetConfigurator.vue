<template>
  <section id="widget" class="education-section" aria-labelledby="widget-title">
    <div class="education-section__heading">
      <p class="education-eyebrow">{{ t('education.tools.widget.eyebrow') }}</p>
      <h2 id="widget-title">{{ t('education.tools.widget.title') }}</h2>
      <p>{{ t('education.tools.widget.description') }}</p>
    </div>

    <div class="widget-tool">
      <q-card flat bordered class="widget-tool__configuration">
        <q-card-section>
          <q-select
            v-model="theme"
            outlined
            emit-value
            map-options
            :options="themeOptions"
            :label="t('education.tools.widget.theme')"
          />
          <q-input
            :model-value="iframeCode"
            outlined
            readonly
            autogrow
            type="textarea"
            :label="t('education.tools.widget.embedCode')"
          />
          <q-btn
            no-caps
            unelevated
            icon="content_copy"
            class="app-action app-action--primary"
            :label="t('education.tools.widget.copy')"
            @click="copyEmbedCode"
          />
          <p v-if="statusMessage" role="status">{{ statusMessage }}</p>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="widget-tool__preview">
        <q-card-section>
          <span>{{ t('education.tools.widget.preview') }}</span>
        </q-card-section>
        <q-separator />
        <iframe
          :key="widgetUrl"
          :src="widgetUrl"
          :title="t('education.tools.widget.preview')"
          loading="lazy"
        ></iframe>
      </q-card>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { copyText, createAbsoluteRouteUrl } from 'src/utils/calendarTools';

const { t, locale } = useI18n({ useScope: 'global' });
const theme = ref('auto');
const statusMessage = ref('');

const themeOptions = computed(() => [
  { label: t('education.tools.widget.auto'), value: 'auto' },
  { label: t('education.tools.widget.light'), value: 'light' },
  { label: t('education.tools.widget.dark'), value: 'dark' },
]);
const widgetUrl = computed(() =>
  createAbsoluteRouteUrl('/widget', { lang: locale.value, theme: theme.value }),
);
const iframeCode = computed(
  () =>
    `<iframe src="${widgetUrl.value}" title="13 Calendar — IFC" width="100%" height="190" loading="lazy" style="border:0;border-radius:18px" referrerpolicy="strict-origin-when-cross-origin"></iframe>`,
);

async function copyEmbedCode() {
  await copyText(iframeCode.value);
  statusMessage.value = t('education.tools.widget.copied');
}
</script>

<style scoped>
.widget-tool {
  display: grid;
  grid-template-columns: minmax(300px, 0.8fr) minmax(0, 1.2fr);
  align-items: stretch;
  gap: 22px;
  max-width: 1040px;
  margin: 0 auto;
}

.widget-tool__configuration,
.widget-tool__preview {
  overflow: hidden;
  border-color: var(--app-border);
  border-radius: 24px;
  box-shadow: var(--app-card-shadow);
}

.widget-tool__configuration .q-card__section {
  display: grid;
  gap: 16px;
  padding: 24px;
}

.widget-tool__configuration p {
  margin: 0;
  color: #059669;
  font-size: 13px;
  text-align: center;
}

.widget-tool__preview > .q-card__section {
  color: var(--app-text-muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.widget-tool__preview iframe {
  width: 100%;
  height: 230px;
  display: block;
  background: transparent;
  border: 0;
}

@media (max-width: 760px) {
  .widget-tool {
    grid-template-columns: 1fr;
  }
}
</style>
