<template>
  <section class="community-registration" :aria-labelledby="registrationTitleId">
    <div class="community-registration__heading">
      <p>{{ t('community.joinEyebrow') }}</p>
      <h2 :id="registrationTitleId">{{ t('community.joinTitle') }}</h2>
      <span>{{ t('community.joinDescription') }}</span>
    </div>

    <q-form
      ref="registrationForm"
      class="community-registration__form"
      @submit.prevent="submitRegistration"
    >
      <div class="community-registration__fields">
        <q-input
          v-model.trim="publicName"
          outlined
          dense
          maxlength="60"
          :label="t('community.nameLabel')"
          :rules="[(value) => Boolean(value?.trim()) || t('community.required')]"
        />

        <q-select
          v-model="socialNetwork"
          outlined
          dense
          emit-value
          map-options
          options-dense
          :options="socialNetworkOptions"
          :label="t('community.networkLabel')"
        />

        <q-input
          v-model.trim="socialProfile"
          outlined
          dense
          maxlength="160"
          :label="t('community.profileLabel')"
          :rules="[(value) => Boolean(value?.trim()) || t('community.required')]"
        />
      </div>

      <q-checkbox v-model="consent" class="community-registration__consent">
        {{ t('community.consent') }}
      </q-checkbox>

      <!-- O widget só é montado quando a chave pública estiver
           configurada. A chave secreta nunca pertence ao navegador. -->
      <div v-if="turnstileSiteKey" ref="turnstileContainer" class="community-turnstile"></div>

      <div class="community-registration__actions">
        <div>
          <p>{{ t('community.moderation') }}</p>
          <small>{{ t('community.protection') }}</small>
        </div>

        <q-btn
          unelevated
          no-caps
          color="primary"
          class="app-primary-action"
          type="submit"
          icon="person_add"
          :loading="submissionState === 'sending'"
          :disable="!canSubmit"
          :label="t(submissionState === 'sending' ? 'community.sending' : 'community.submit')"
        />
      </div>

      <p
        v-if="submissionMessage"
        class="community-registration__message"
        :class="`community-registration__message--${submissionState}`"
        aria-live="polite"
      >
        {{ submissionMessage }}
      </p>
    </q-form>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/* ===========================================================
   DADOS PÚBLICOS DO CADASTRO VOLUNTÁRIO
=========================================================== */

const publicName = ref('');
const socialNetwork = ref('instagram');
const socialProfile = ref('');
const consent = ref(false);
const submissionState = ref('idle');
const submissionMessage = ref('');
const registrationForm = ref(null);
const registrationTitleId = 'community-registration-title';

const { t, locale } = useI18n({ useScope: 'global' });

const socialNetworkOptions = computed(() => [
  { label: 'Instagram', value: 'instagram' },
  { label: 'Facebook', value: 'facebook' },
  { label: t('community.otherNetwork'), value: 'other' },
]);

/* ===========================================================
   ENDEREÇO SEGURO E PROTEÇÃO CONTRA AUTOMAÇÃO

   O GitHub Pages contém apenas o formulário. O armazenamento,
   a validação e a moderação pertencem ao Worker da Cloudflare.
=========================================================== */

const registrationEndpoint = String(
  import.meta.env.VITE_COMMUNITY_REGISTRATION_URL || '',
).trim();
const turnstileSiteKey = String(import.meta.env.VITE_TURNSTILE_SITE_KEY || '').trim();
const turnstileAction = 'community_registration';
const turnstileContainer = ref(null);
const turnstileToken = ref('');
let turnstileWidgetId = null;

const canSubmit = computed(
  () =>
    Boolean(publicName.value.trim()) &&
    Boolean(socialProfile.value.trim()) &&
    consent.value &&
    Boolean(registrationEndpoint) &&
    Boolean(turnstileSiteKey) &&
    Boolean(turnstileToken.value),
);

function loadTurnstileScript() {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }

    const existingScript = document.querySelector('script[data-community-turnstile]');

    if (existingScript) {
      existingScript.addEventListener('load', resolve, { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.dataset.communityTurnstile = 'true';
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.appendChild(script);
  });
}

async function mountTurnstile() {
  if (!turnstileSiteKey) {
    return;
  }

  try {
    await loadTurnstileScript();
    await nextTick();

    turnstileWidgetId = window.turnstile.render(turnstileContainer.value, {
      sitekey: turnstileSiteKey,
      action: turnstileAction,
      theme: 'auto',
      callback: (token) => {
        turnstileToken.value = token;
      },
      'expired-callback': () => {
        turnstileToken.value = '';
      },
      'error-callback': () => {
        turnstileToken.value = '';
      },
    });
  } catch {
    submissionState.value = 'error';
    submissionMessage.value = t('community.submitError');
  }
}

onMounted(mountTurnstile);

onBeforeUnmount(() => {
  if (window.turnstile && turnstileWidgetId !== null) {
    window.turnstile.remove(turnstileWidgetId);
  }
});

/* ===========================================================
   ENVIO PARA MODERAÇÃO
=========================================================== */

async function submitRegistration() {
  submissionMessage.value = '';

  if (!registrationEndpoint) {
    submissionState.value = 'setup';
    submissionMessage.value = t('community.submitSetup');
    return;
  }

  submissionState.value = 'sending';

  try {
    const response = await fetch(registrationEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicName: publicName.value.trim(),
        socialNetwork: socialNetwork.value,
        socialProfile: socialProfile.value.trim(),
        locale: locale.value,
        country: readPreferredHolidayCountry(),
        turnstileToken: turnstileToken.value,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    publicName.value = '';
    socialProfile.value = '';
    consent.value = false;

    /* O formulário vazio representa um novo cadastro, não uma tentativa
       inválida. Depois que o Vue aplicar a limpeza, removemos somente o
       resultado visual da validação anterior. Uma nova tentativa incompleta
       continua sendo validada normalmente pelo QForm. */
    await nextTick();
    registrationForm.value?.resetValidation();

    submissionState.value = 'success';
    submissionMessage.value = t('community.submitSuccess');
  } catch {
    submissionState.value = 'error';
    submissionMessage.value = t('community.submitError');
  } finally {
    resetTurnstile();
  }
}

/* Cada token é válido para um único envio. O widget é renovado
   tanto após sucesso quanto após erro para permitir uma nova tentativa. */
function resetTurnstile() {
  if (window.turnstile && turnstileWidgetId !== null) {
    window.turnstile.reset(turnstileWidgetId);
  }

  turnstileToken.value = '';
}

function readPreferredHolidayCountry() {
  try {
    return String(window.localStorage.getItem('calendar-app-holiday-country') || '').toUpperCase();
  } catch {
    return '';
  }
}
</script>

<style scoped>
/* ===========================================================
   CARD DE IDENTIFICAÇÃO VOLUNTÁRIA
=========================================================== */

.community-registration {
  margin-top: 28px;
  padding: clamp(24px, 5vw, 46px);
  background:
    radial-gradient(circle at 90% 10%, rgb(124 58 237 / 12%), transparent 34%),
    color-mix(in srgb, var(--app-surface) 90%, transparent);
  border-top: 1px solid var(--app-border);
}

.community-registration__heading {
  max-width: 680px;
  margin: 0 auto 28px;
  text-align: center;
}

.community-registration__heading p {
  margin: 0 0 8px;
  color: #8b5cf6;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.community-registration__heading h2 {
  margin: 0;
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.community-registration__heading span {
  display: block;
  margin-top: 12px;
  color: var(--app-text-muted);
  font-size: 14px;
  line-height: 1.6;
}

.community-registration__form {
  max-width: 860px;
  margin: 0 auto;
}

.community-registration__fields {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(150px, 0.8fr) minmax(0, 1.4fr);
  gap: 14px;
}

.community-registration__consent {
  margin: 2px 0 18px;
  color: var(--app-text-muted);
  font-size: 13px;
}

.community-turnstile {
  min-height: 65px;
  margin-bottom: 18px;
}

.community-registration__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 18px;
  border-top: 1px solid var(--app-border);
}

.community-registration__actions p,
.community-registration__actions small {
  display: block;
  margin: 0;
  color: var(--app-text-muted);
  line-height: 1.5;
}

.community-registration__actions p {
  font-size: 13px;
  font-weight: 600;
}

.community-registration__actions small {
  margin-top: 3px;
  color: var(--app-text-faint);
  font-size: 11px;
}

.community-registration__message {
  margin: 18px 0 0;
  padding: 12px 14px;
  color: var(--app-text-muted);
  background: var(--app-hover);
  border-radius: 12px;
  font-size: 13px;
  text-align: center;
}

.community-registration__message--success {
  color: #059669;
  background: rgb(16 185 129 / 10%);
}

.community-registration__message--error {
  color: #dc2626;
  background: rgb(239 68 68 / 10%);
}

@media (max-width: 760px) {
  .community-registration__fields {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .community-registration__actions {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
