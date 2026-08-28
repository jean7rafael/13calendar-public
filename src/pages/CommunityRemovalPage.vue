<template>
  <q-page class="community-removal-page">
    <section class="community-removal-card">
      <div class="community-removal-icon" aria-hidden="true">
        <q-icon name="person_remove" />
      </div>
      <p class="community-removal-eyebrow">{{ t('community.removalEyebrow') }}</p>
      <h1>{{ t('community.removalTitle') }}</h1>
      <p class="community-removal-description">{{ t('community.removalDescription') }}</p>

      <q-form ref="removalForm" class="community-removal-form" @submit.prevent="removeRegistration">
        <q-input
          ref="deletionCodeInput"
          v-model.trim="deletionCode"
          outlined
          type="textarea"
          autogrow
          lazy-rules
          :label="t('community.removalCodeLabel')"
          :rules="[(value) => Boolean(value?.trim()) || t('community.required')]"
        />

        <q-checkbox v-model="confirmed" class="community-removal-confirmation">
          {{ t('community.removalConfirmation') }}
        </q-checkbox>

        <!-- A autoexclusão usa uma ação Turnstile própria e um token por envio. -->
        <div
          v-if="turnstileSiteKey"
          ref="turnstileContainer"
          class="community-removal-turnstile"
        ></div>

        <q-btn
          unelevated
          no-caps
          color="negative"
          class="app-action app-action--tertiary community-removal-submit"
          type="submit"
          icon="delete_forever"
          :loading="state === 'sending'"
          :disable="!canSubmit"
          :label="t(state === 'sending' ? 'community.removalSending' : 'community.removalSubmit')"
        />

        <p
          v-if="message"
          class="community-removal-message"
          :class="`community-removal-message--${state}`"
          aria-live="polite"
        >
          {{ message }}
        </p>
      </q-form>

      <q-btn
        unelevated
        no-caps
        class="app-action app-action--secondary"
        icon="arrow_back"
        :to="{ name: 'community' }"
        :label="t('community.removalBack')"
      />
    </section>
  </q-page>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';
import { useRoute } from 'vue-router';
import { useSuccessfulFormReset } from 'src/composables/useSuccessfulFormReset';
import { getCommunityApiUrl } from 'src/services/communityApi';

/* ===========================================================
   CÓDIGO PRIVADO ENTREGUE AO TITULAR
=========================================================== */

const route = useRoute();
const { t } = useI18n({ useScope: 'global' });
const deletionCode = ref(String(route.query.code || '').trim());
const confirmed = ref(false);
const state = ref('idle');
const message = ref('');
const removalForm = ref(null);
const deletionCodeInput = ref(null);
const turnstileContainer = ref(null);
const turnstileToken = ref('');
const turnstileSiteKey = String(import.meta.env.VITE_TURNSTILE_SITE_KEY || '').trim();
const removalEndpoint = getCommunityApiUrl('registrations/remove');
const { resetSuccessfulForm } = useSuccessfulFormReset();
let turnstileWidgetId = null;

const canSubmit = computed(
  () =>
    Boolean(deletionCode.value.trim()) &&
    confirmed.value &&
    Boolean(removalEndpoint) &&
    Boolean(turnstileSiteKey) &&
    Boolean(turnstileToken.value),
);

useMeta(() => ({ title: t('community.removalBrowserTitle') }));

/* ===========================================================
   PROTEÇÃO CONTRA AUTOMAÇÃO
=========================================================== */

function loadTurnstileScript() {
  return new Promise((resolve, reject) => {
    if (window.turnstile) return resolve();
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
  if (!turnstileSiteKey) return;
  try {
    await loadTurnstileScript();
    await nextTick();
    turnstileWidgetId = window.turnstile.render(turnstileContainer.value, {
      sitekey: turnstileSiteKey,
      action: 'community_deletion',
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
    state.value = 'error';
    message.value = t('community.removalError');
  }
}

onMounted(mountTurnstile);
onBeforeUnmount(() => {
  if (window.turnstile && turnstileWidgetId !== null) window.turnstile.remove(turnstileWidgetId);
});

/* ===========================================================
   EXCLUSÃO SOMENTE DO CADASTRO VINCULADO AO CÓDIGO
=========================================================== */

async function removeRegistration() {
  if (!canSubmit.value) return;
  state.value = 'sending';
  message.value = '';

  /* O campo aceita tanto o código isolado quanto o link completo que foi
     entregue pela moderação. A normalização também existe no Worker para
     manter a API segura diante de clientes antigos. */
  const normalizedDeletionCode = extractDeletionCode(deletionCode.value);

  try {
    const response = await fetch(removalEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deletionCode: normalizedDeletionCode,
        turnstileToken: turnstileToken.value,
      }),
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(
        payload?.error === 'invalid_deletion_code' ? 'invalid_deletion_code' : 'request_failed',
      );
    }

    state.value = 'success';
    message.value = t('community.removalSuccess');
    deletionCode.value = '';
    confirmed.value = false;

    /* O formulário vazio após uma exclusão concluída representa o fim do
       processo, não uma nova tentativa inválida. A próxima tentativa sem
       código continuará acionando normalmente as regras obrigatórias. */
    await resetSuccessfulForm({
      form: removalForm.value,
      fields: [deletionCodeInput.value],
    });
  } catch (error) {
    state.value = 'error';
    message.value =
      error?.message === 'invalid_deletion_code'
        ? t('community.removalInvalid')
        : t('community.removalError');
  } finally {
    if (window.turnstile && turnstileWidgetId !== null) window.turnstile.reset(turnstileWidgetId);
    turnstileToken.value = '';
  }
}

function extractDeletionCode(value) {
  let candidate = String(value || '').trim();

  if (!candidate) return '';

  try {
    const url = new URL(candidate);
    const directCode = url.searchParams.get('code');
    const hashQuery = url.hash.includes('?') ? url.hash.slice(url.hash.indexOf('?') + 1) : '';
    candidate = directCode || new URLSearchParams(hashQuery).get('code') || candidate;
  } catch {
    const query = candidate.includes('?') ? candidate.slice(candidate.indexOf('?') + 1) : '';
    candidate = new URLSearchParams(query).get('code') || candidate;
  }

  return candidate.trim();
}
</script>

<style scoped>
.community-removal-page {
  min-height: calc(100vh - 58px);
  display: grid;
  place-items: center;
  padding: 36px 18px;
  color: var(--app-text);
}

.community-removal-card {
  width: min(100%, 680px);
  padding: clamp(28px, 6vw, 52px);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 22px;
  box-shadow: var(--app-card-shadow);
  text-align: center;
}

.community-removal-icon {
  width: 66px;
  height: 66px;
  display: grid;
  place-items: center;
  margin: 0 auto 18px;
  color: white;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-radius: 50%;
  font-size: 28px;
}

.community-removal-eyebrow {
  margin: 0 0 8px;
  color: #8b5cf6;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.community-removal-card h1 {
  margin: 0;
  font-size: clamp(28px, 5vw, 42px);
  letter-spacing: -0.04em;
}
.community-removal-description {
  max-width: 540px;
  margin: 14px auto 30px;
  color: var(--app-text-muted);
  line-height: 1.65;
}
.community-removal-form {
  display: grid;
  gap: 16px;
  text-align: start;
}
.community-removal-confirmation {
  color: var(--app-text-muted);
}
.community-removal-turnstile {
  min-height: 65px;
}
.community-removal-submit {
  justify-self: end;
}
.community-removal-message {
  margin: 0;
  padding: 12px 14px;
  border-radius: 12px;
  text-align: center;
}
.community-removal-message--success {
  color: #059669;
  background: rgb(16 185 129 / 10%);
}
.community-removal-message--error {
  color: #dc2626;
  background: rgb(239 68 68 / 10%);
}

@media (max-width: 560px) {
  .community-removal-submit {
    width: 100%;
  }
}
</style>
