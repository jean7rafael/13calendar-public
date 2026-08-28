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
          :label="installButtonLabel"
          @click="installApp"
        />
      </q-card-section>
    </q-card>

    <q-dialog v-model="showsInstallHelp">
      <q-card class="pwa-install-dialog">
        <q-card-section>
          <div class="pwa-install-dialog__icon" aria-hidden="true">
            <q-icon name="add_to_home_screen" />
          </div>
          <div>
            <h3>{{ t('education.tools.pwa.helpTitle') }}</h3>
          </div>
        </q-card-section>

        <q-card-section class="pwa-install-dialog__guide">
          <q-icon :name="installGuideIcon" aria-hidden="true" />
          <p>{{ installGuideText }}</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            no-caps
            unelevated
            class="app-action app-action--secondary"
            :label="t('education.tools.pwa.close')"
            @click="showsInstallHelp = false"
          />
          <q-btn
            v-if="shareAvailable"
            no-caps
            unelevated
            icon-right="ios_share"
            class="app-action app-action--primary"
            :label="t('education.tools.share.native')"
            :loading="sharing"
            @click="openShareMenu"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });
const installAvailable = ref(false);
const installed = ref(false);
const installGuide = ref('desktop');
const shareAvailable = ref(false);
const sharing = ref(false);
const showsInstallHelp = ref(false);

const installStateText = computed(() => {
  if (installed.value) return t('education.tools.pwa.installed');
  if (installAvailable.value) return t('education.tools.pwa.available');
  return t('education.tools.pwa.ready');
});
const installButtonLabel = computed(() =>
  t(installAvailable.value ? 'education.tools.pwa.install' : 'education.tools.pwa.instructions'),
);
const installGuideText = computed(() =>
  t(`education.tools.pwa.guides.${installGuide.value}`),
);
const installGuideIcon = computed(() => {
  if (installGuide.value.startsWith('ios')) return 'phone_iphone';
  if (installGuide.value.startsWith('android')) return 'android';
  return 'computer';
});

function detectInstallGuide() {
  const userAgent = navigator.userAgent;
  const isIos =
    /iPad|iPhone|iPod/.test(userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (isIos) {
    installGuide.value = /CriOS|EdgiOS|FxiOS|OPiOS/.test(userAgent) ? 'iosOther' : 'iosSafari';
    return;
  }

  if (/Android/.test(userAgent)) {
    installGuide.value = /Firefox|FxiOS/.test(userAgent) ? 'androidFirefox' : 'androidChromium';
    return;
  }

  installGuide.value = 'desktop';
}

function refreshInstallState() {
  installed.value =
    window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  installAvailable.value = Boolean(window.__calendarInstallPrompt);
}

async function installApp() {
  const prompt = window.__calendarInstallPrompt;
  if (!prompt) {
    showsInstallHelp.value = true;
    return;
  }

  try {
    await prompt.prompt();
    await prompt.userChoice;
    window.__calendarInstallPrompt = null;
    refreshInstallState();
  } catch {
    showsInstallHelp.value = true;
  }
}

async function openShareMenu() {
  if (!shareAvailable.value) return;
  sharing.value = true;

  try {
    await navigator.share({
      title: '13 Calendar',
      url: `${window.location.origin}/`,
    });
  } catch {
    // O guia permanece visível se o sistema não abrir o compartilhamento.
  } finally {
    sharing.value = false;
  }
}

onMounted(() => {
  detectInstallGuide();
  shareAvailable.value = typeof navigator.share === 'function';
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

.pwa-install-dialog {
  width: min(580px, calc(100vw - 28px));
  max-height: calc(100vh - 28px);
  overflow-y: auto;
  color: var(--app-text);
  background: var(--app-surface-raised);
  border: 1px solid var(--app-accent-purple-border);
  border-radius: 24px;
  box-shadow: var(--app-card-shadow);
}

.pwa-install-dialog > .q-card__section:first-child {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 26px 26px 18px;
}

.pwa-install-dialog__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  color: var(--app-accent-purple-text);
  background: var(--app-accent-purple-soft);
  border: 1px solid var(--app-accent-purple-border);
  border-radius: 14px;
  font-size: 25px;
}

.pwa-install-dialog h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}

.pwa-install-dialog__guide {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  margin: 0 26px;
  padding: 18px !important;
  color: var(--app-text);
  background: var(--app-accent-purple-soft);
  border: 1px solid var(--app-accent-purple-border);
  border-radius: 16px;
}

.pwa-install-dialog__guide > .q-icon {
  color: var(--app-accent-purple-text);
  font-size: 24px;
}

.pwa-install-dialog__guide p {
  margin: 0;
  line-height: 1.6;
}

.pwa-install-dialog .q-card__actions {
  gap: 10px;
  padding: 22px 26px 26px;
}

@media (max-width: 620px) {
  .pwa-card .q-card__section {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }

  .pwa-install-dialog > .q-card__section:first-child {
    padding: 22px 20px 16px;
  }

  .pwa-install-dialog__guide {
    margin: 0 20px;
  }

  .pwa-install-dialog .q-card__actions {
    display: grid;
    grid-template-columns: 1fr;
    padding: 18px 20px 22px;
  }
}
</style>
