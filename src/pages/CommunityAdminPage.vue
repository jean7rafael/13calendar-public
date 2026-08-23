<template>
  <q-page class="community-admin-page">
    <!-- A página não é anunciada no menu e nunca recebe um segredo compilado. -->
    <section class="community-admin-card">
      <header>
        <q-icon name="verified_user" />
        <div>
          <h1>{{ t('community.adminTitle') }}</h1>
          <p>{{ t('community.adminDescription') }}</p>
        </div>
      </header>

      <form v-if="!isAuthorized" class="community-admin-login" @submit.prevent="loadPending">
        <q-input
          v-model="adminToken"
          outlined
          type="password"
          autocomplete="current-password"
          :label="t('community.adminToken')"
        />
        <q-btn
          unelevated
          no-caps
          color="primary"
          type="submit"
          icon="login"
          :loading="isLoading"
          :disable="!adminToken.trim()"
          :label="t('community.adminConnect')"
        />
      </form>

      <template v-else>
        <div class="community-admin-toolbar">
          <h2>{{ t('community.adminPending') }}</h2>
          <q-btn flat round icon="logout" :aria-label="t('community.adminExit')" @click="signOut">
            <q-tooltip>{{ t('community.adminExit') }}</q-tooltip>
          </q-btn>
        </div>

        <div v-if="registrations.length" class="community-admin-list">
          <article v-for="registration in registrations" :key="registration.id">
            <div class="community-admin-identity">
              <span aria-hidden="true">{{ getCountryFlag(registration.country) }}</span>
              <div>
                <strong>{{ registration.publicName }}</strong>
                <small>{{ registration.socialNetwork }} · {{ registration.socialProfile }}</small>
                <time>{{ formatDate(registration.createdAt) }}</time>
              </div>
            </div>
            <div class="community-admin-actions">
              <q-btn
                outline
                no-caps
                color="negative"
                icon="close"
                :loading="moderatingId === registration.id"
                :label="t('community.adminReject')"
                @click="moderate(registration.id, 'rejected')"
              />
              <q-btn
                unelevated
                no-caps
                color="positive"
                icon="check"
                :loading="moderatingId === registration.id"
                :label="t('community.adminApprove')"
                @click="moderate(registration.id, 'approved')"
              />
            </div>
          </article>
        </div>
        <p v-else class="community-admin-empty">{{ t('community.adminEmpty') }}</p>
      </template>

      <p v-if="message" class="community-admin-message" :class="{ 'community-admin-message--error': hasError }">
        {{ message }}
      </p>
    </section>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';
import { getCommunityApiUrl } from 'src/services/communityApi';

/* ===========================================================
   SESSÃO ADMINISTRATIVA TEMPORÁRIA

   O segredo permanece somente na memória desta aba e é
   removido ao fechá-la ou ao escolher Sair.
=========================================================== */

const SESSION_KEY = '13calendar-community-admin-token';
const adminToken = ref(readSessionToken());
const registrations = ref([]);
const isAuthorized = ref(false);
const isLoading = ref(false);
const moderatingId = ref('');
const message = ref('');
const hasError = ref(false);
const { t, locale } = useI18n({ useScope: 'global' });

useMeta(() => ({ title: t('community.adminTitle') }));

if (adminToken.value) {
  loadPending();
}

async function loadPending() {
  const endpoint = getCommunityApiUrl('admin/registrations');

  if (!endpoint || !adminToken.value.trim()) return;

  isLoading.value = true;
  message.value = '';
  hasError.value = false;

  try {
    const response = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${adminToken.value.trim()}` },
      cache: 'no-store',
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const payload = await response.json();
    registrations.value = Array.isArray(payload?.registrations) ? payload.registrations : [];
    isAuthorized.value = true;
    sessionStorage.setItem(SESSION_KEY, adminToken.value.trim());
  } catch {
    isAuthorized.value = false;
    hasError.value = true;
    message.value = t('community.adminError');
    sessionStorage.removeItem(SESSION_KEY);
  } finally {
    isLoading.value = false;
  }
}

async function moderate(id, status) {
  const endpoint = getCommunityApiUrl(`admin/registrations/${encodeURIComponent(id)}`);
  moderatingId.value = id;
  message.value = '';

  try {
    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${adminToken.value.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    registrations.value = registrations.value.filter((registration) => registration.id !== id);
    hasError.value = false;
    message.value = t('community.adminUpdated');
  } catch {
    hasError.value = true;
    message.value = t('community.adminError');
  } finally {
    moderatingId.value = '';
  }
}

function signOut() {
  sessionStorage.removeItem(SESSION_KEY);
  adminToken.value = '';
  registrations.value = [];
  isAuthorized.value = false;
  message.value = '';
}

function readSessionToken() {
  try {
    return sessionStorage.getItem(SESSION_KEY) || '';
  } catch {
    return '';
  }
}

function getCountryFlag(code) {
  const country = String(code || '').toUpperCase();

  if (!/^[A-Z]{2}$/.test(country)) return '🌐';

  return country.replace(/[A-Z]/g, (letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)));
}

function formatDate(value) {
  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}
</script>

<style scoped>
.community-admin-page {
  width: min(100%, 900px);
  min-height: calc(100vh - 58px);
  display: grid;
  place-items: start center;
  margin: 0 auto;
  padding: 48px 20px;
  color: var(--app-text);
}

.community-admin-card {
  width: 100%;
  padding: clamp(22px, 5vw, 42px);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 20px;
  box-shadow: var(--app-card-shadow);
}

.community-admin-card > header { display: flex; align-items: flex-start; gap: 16px; }
.community-admin-card > header .q-icon { color: #8b5cf6; font-size: 34px; }
.community-admin-card h1 { margin: 0; font-size: clamp(24px, 4vw, 36px); }
.community-admin-card header p { margin: 8px 0 0; color: var(--app-text-muted); }

.community-admin-login {
  max-width: 520px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 12px;
  margin: 32px auto 0;
}

.community-admin-toolbar { display: flex; align-items: center; justify-content: space-between; margin-top: 32px; }
.community-admin-toolbar h2 { margin: 0; font-size: 18px; }
.community-admin-list { display: grid; gap: 12px; margin-top: 16px; }

.community-admin-list article {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px;
  border: 1px solid var(--app-border);
  border-radius: 15px;
}

.community-admin-identity { min-width: 0; display: flex; align-items: flex-start; gap: 12px; }
.community-admin-identity > span { font-size: 23px; }
.community-admin-identity strong,
.community-admin-identity small,
.community-admin-identity time { display: block; }
.community-admin-identity small { margin-top: 3px; color: var(--app-text-muted); }
.community-admin-identity time { margin-top: 5px; color: var(--app-text-faint); font-size: 11px; }
.community-admin-actions { flex: none; display: flex; gap: 8px; }
.community-admin-empty { margin: 32px 0 0; color: var(--app-text-muted); text-align: center; }
.community-admin-message { margin: 22px 0 0; color: #059669; text-align: center; }
.community-admin-message--error { color: #dc2626; }

@media (max-width: 680px) {
  .community-admin-page { padding: 24px 12px; }
  .community-admin-login { grid-template-columns: 1fr; }
  .community-admin-list article { align-items: stretch; flex-direction: column; }
  .community-admin-actions { justify-content: flex-end; }
}
</style>
