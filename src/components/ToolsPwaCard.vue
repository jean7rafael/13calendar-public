<template>
  <section id="offline" class="education-section" aria-labelledby="offline-title">
    <div class="education-section__heading">
      <p class="education-eyebrow">{{ t('education.tools.pwa.eyebrow') }}</p>
      <h2 id="offline-title">{{ t('education.tools.pwa.title') }}</h2>
      <p>{{ t('education.tools.pwa.description') }}</p>
    </div>

    <q-card flat bordered class="pwa-card">
      <q-card-section>
        <q-icon name="offline_bolt" color="primary" aria-hidden="true" />
        <div>
          <strong>{{ installStateText }}</strong>
          <p>{{ t('education.tools.pwa.privacy') }}</p>
        </div>
        <q-btn
          v-if="!installed"
          no-caps
          unelevated
          icon="install_mobile"
          class="app-action app-action--primary"
          :disable="!installAvailable"
          :label="t('education.tools.pwa.install')"
          @click="installApp"
        />
      </q-card-section>
    </q-card>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });
const installAvailable = ref(false);
const installed = ref(false);

const installStateText = computed(() => {
  if (installed.value) return t('education.tools.pwa.installed');
  if (installAvailable.value) return t('education.tools.pwa.available');
  return t('education.tools.pwa.ready');
});

function refreshInstallState() {
  installed.value = window.matchMedia('(display-mode: standalone)').matches;
  installAvailable.value = Boolean(window.__calendarInstallPrompt);
}

async function installApp() {
  const prompt = window.__calendarInstallPrompt;
  if (!prompt) return;
  await prompt.prompt();
  await prompt.userChoice;
  window.__calendarInstallPrompt = null;
  refreshInstallState();
}

onMounted(() => {
  refreshInstallState();
  window.addEventListener('calendar-install-available', refreshInstallState);
  window.addEventListener('calendar-app-installed', refreshInstallState);
});

onBeforeUnmount(() => {
  window.removeEventListener('calendar-install-available', refreshInstallState);
  window.removeEventListener('calendar-app-installed', refreshInstallState);
});
</script>

<style scoped>
.pwa-card {
  max-width: 860px;
  margin: 0 auto;
  border-color: var(--app-border);
  border-radius: 24px;
  box-shadow: var(--app-card-shadow);
}

.pwa-card .q-card__section {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 18px;
  padding: 28px;
}

.pwa-card .q-icon {
  font-size: 38px;
}

.pwa-card strong {
  font-size: 17px;
}

.pwa-card p {
  margin: 6px 0 0;
  color: var(--app-text-muted);
  line-height: 1.55;
}

@media (max-width: 620px) {
  .pwa-card .q-card__section {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }
}
</style>
