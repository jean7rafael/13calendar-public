<template>
  <q-page class="community-admin-page">
    <section class="community-admin-card">
      <header>
        <q-icon name="verified_user" />
        <div>
          <h1>{{ t('community.adminTitle') }}</h1>
          <p>{{ t('community.adminDescription') }}</p>
        </div>
      </header>

      <!-- O segredo administrativo fica somente nesta aba. -->
      <form v-if="!isAuthorized" class="community-admin-login" @submit.prevent="loadRegistrations">
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
          class="app-primary-action"
          type="submit"
          icon="login"
          :loading="isLoading"
          :disable="!adminToken.trim()"
          :label="t('community.adminConnect')"
        />
      </form>

      <template v-else>
        <!-- Estado do aviso privado de novas solicitações. -->
        <section class="community-admin-notifications">
          <q-icon name="notifications_active" aria-hidden="true" />
          <div>
            <h2>{{ t('community.adminTelegramTitle') }}</h2>
            <p>{{ t('community.adminTelegramDescription') }}</p>
            <small>{{ telegramStatusText }}</small>
          </div>
          <q-btn
            v-if="notificationStatus.configured"
            outline
            no-caps
            color="primary"
            icon="send"
            :loading="isConnectingTelegram"
            :label="t('community.adminTelegramConnect')"
            @click="connectTelegram"
          />
        </section>

        <!-- A fila segue a ordem de chegada: o cadastro mais antigo vem primeiro. -->
        <div class="community-admin-toolbar">
          <div>
            <h2>{{ t('community.adminPending') }}</h2>
            <small>{{ t('community.adminQueueOrder') }}</small>
          </div>
          <q-btn flat round icon="logout" :aria-label="t('community.adminExit')" @click="signOut">
            <q-tooltip>{{ t('community.adminExit') }}</q-tooltip>
          </q-btn>
        </div>

        <div v-if="pendingRegistrations.length" class="community-admin-list">
          <article v-for="registration in pendingRegistrations" :key="registration.id">
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
                :loading="actionId === registration.id"
                :label="t('community.adminReject')"
                @click="moderate(registration.id, 'rejected')"
              />
              <q-btn
                unelevated
                no-caps
                color="positive"
                icon="check"
                :loading="actionId === registration.id"
                :label="t('community.adminApprove')"
                @click="moderate(registration.id, 'approved')"
              />
            </div>
          </article>
        </div>
        <p v-else class="community-admin-empty">{{ t('community.adminEmpty') }}</p>

        <!-- Lista dos perfis que já estão publicados. -->
        <div class="community-admin-toolbar community-admin-toolbar--approved">
          <div>
            <h2>{{ t('community.adminPublished') }}</h2>
            <small>{{ t('community.adminPublishedDescription') }}</small>
          </div>
          <q-btn
            flat
            round
            icon="refresh"
            :loading="isLoading"
            :aria-label="t('community.adminRefresh')"
            @click="loadRegistrations({ preserveMessage: true })"
          >
            <q-tooltip>{{ t('community.adminRefresh') }}</q-tooltip>
          </q-btn>
        </div>

        <div v-if="approvedRegistrations.length" class="community-admin-list">
          <article v-for="registration in approvedRegistrations" :key="registration.id">
            <div class="community-admin-identity">
              <span class="community-admin-avatar" aria-hidden="true">
                <img v-if="registration.avatarUrl" :src="registration.avatarUrl" alt="" />
                <template v-else>{{ getMemberInitial(registration.publicName) }}</template>
              </span>
              <div>
                <strong>{{ registration.publicName }}</strong>
                <small>{{ registration.socialNetwork }} · {{ registration.socialProfile }}</small>
                <time>{{ formatDate(registration.reviewedAt || registration.createdAt) }}</time>
              </div>
            </div>
            <div class="community-admin-actions">
              <q-btn
                flat
                round
                icon="open_in_new"
                :href="getProfileUrl(registration)"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="t('community.memberProfile', { name: registration.publicName })"
              >
                <q-tooltip>{{
                  t('community.memberProfile', { name: registration.publicName })
                }}</q-tooltip>
              </q-btn>
              <q-btn
                outline
                no-caps
                color="primary"
                icon="manage_accounts"
                :label="t('community.adminManage')"
                @click="openManagement(registration)"
              />
            </div>
          </article>
        </div>
        <p v-else class="community-admin-empty">{{ t('community.adminPublishedEmpty') }}</p>
      </template>

      <p
        v-if="message"
        class="community-admin-message"
        :class="{ 'community-admin-message--error': hasError }"
      >
        {{ message }}
      </p>
    </section>

    <!-- Dados, foto capturada e propriedade do perfil são geridos num só lugar. -->
    <q-dialog v-model="managementOpen" persistent>
      <q-card class="community-management-dialog">
        <q-card-section class="community-management-dialog__header">
          <div>
            <div class="text-h6">{{ t('community.adminManageTitle') }}</div>
            <div class="text-caption text-grey-6">{{ managedRegistration?.publicName }}</div>
          </div>
          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup
            :aria-label="t('navigation.closeMenu')"
          />
        </q-card-section>
        <q-separator />

        <q-card-section class="community-management-dialog__body">
          <!-- A imagem pública é importada automaticamente; o envio manual
               permanece como alternativa quando a rede social bloqueia a leitura. -->
          <div class="community-management-dialog__avatar">
            <span class="community-admin-avatar community-admin-avatar--large">
              <img
                v-if="managedRegistration?.avatarUrl"
                :src="managedRegistration.avatarUrl"
                alt=""
              />
              <template v-else>{{ getMemberInitial(editForm.publicName) }}</template>
            </span>
            <div>
              <strong>{{ t('community.adminPhotoTitle') }}</strong>
              <p>{{ t('community.adminPhotoDescription') }}</p>
            </div>
          </div>

          <q-file
            v-model="selectedAvatarFile"
            outlined
            dense
            accept="image/jpeg,image/png,image/webp"
            max-file-size="524288"
            :label="t('community.adminPhotoSelect')"
            @rejected="showAvatarSizeError"
          >
            <template #prepend><q-icon name="photo_camera" /></template>
          </q-file>
          <div class="community-management-dialog__row-actions">
            <q-btn
              outline
              no-caps
              color="primary"
              icon="photo_camera"
              :loading="actionName === 'avatar-capture'"
              :label="t('community.adminPhotoCapture')"
              @click="captureAvatar"
            />
            <q-btn
              outline
              no-caps
              color="primary"
              icon="upload"
              :disable="!selectedAvatarFile"
              :loading="actionName === 'avatar'"
              :label="t('community.adminPhotoUpload')"
              @click="uploadAvatar"
            />
            <q-btn
              v-if="managedRegistration?.avatarUrl"
              flat
              no-caps
              color="negative"
              icon="hide_image"
              :loading="actionName === 'avatar-remove'"
              :label="t('community.adminPhotoRemove')"
              @click="removeAvatar"
            />
          </div>

          <q-separator />
          <div class="community-management-dialog__fields">
            <q-input
              v-model.trim="editForm.publicName"
              outlined
              dense
              :label="t('community.nameLabel')"
            />
            <q-select
              v-model="editForm.socialNetwork"
              outlined
              dense
              emit-value
              map-options
              :options="socialNetworkOptions"
              :label="t('community.networkLabel')"
            />
            <q-input
              v-model.trim="editForm.socialProfile"
              outlined
              dense
              :label="t('community.profileLabel')"
            />
            <q-input
              v-model.trim="editForm.country"
              outlined
              dense
              maxlength="2"
              :label="t('community.adminCountry')"
            />
          </div>
          <q-btn
            unelevated
            no-caps
            color="primary"
            class="app-primary-action"
            icon="save"
            :loading="actionName === 'save'"
            :label="t('community.adminSave')"
            @click="saveRegistration"
          />

          <q-separator />
          <section class="community-management-dialog__ownership">
            <div>
              <strong>{{ t('community.adminDeletionTitle') }}</strong>
              <p>{{ t('community.adminDeletionDescription') }}</p>
            </div>
            <q-btn
              outline
              no-caps
              color="primary"
              icon="key"
              :loading="actionName === 'deletion-code'"
              :label="
                t(
                  managedRegistration?.hasDeletionCode
                    ? 'community.adminDeletionRotate'
                    : 'community.adminDeletionCreate',
                )
              "
              @click="generateDeletionCode"
            />
          </section>
          <q-btn
            outline
            no-caps
            color="negative"
            icon="delete_forever"
            :label="t('community.adminDelete')"
            @click="deleteConfirmationOpen = true"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- O código completo é exibido uma vez e nunca retorna da base. -->
    <q-dialog v-model="deletionCodeOpen" persistent>
      <q-card class="community-code-dialog">
        <q-card-section>
          <div class="text-h6">{{ t('community.adminDeletionReady') }}</div>
          <p>{{ t('community.adminDeletionReadyDescription') }}</p>
          <q-input v-model="generatedDeletionLink" outlined readonly type="textarea" autogrow />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            no-caps
            icon="content_copy"
            :label="t('community.adminCopy')"
            @click="copyDeletionLink"
          />
          <q-btn
            unelevated
            no-caps
            color="primary"
            :label="t('community.adminDone')"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deleteConfirmationOpen">
      <q-card class="community-confirm-dialog">
        <q-card-section>
          <div class="text-h6">{{ t('community.adminDeleteConfirmTitle') }}</div>
          <p>
            {{
              t('community.adminDeleteConfirmDescription', {
                name: managedRegistration?.publicName,
              })
            }}
          </p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat no-caps :label="t('holidaySettings.cancel')" v-close-popup />
          <q-btn
            unelevated
            no-caps
            color="negative"
            icon="delete_forever"
            :loading="actionName === 'delete'"
            :label="t('community.adminDelete')"
            @click="deleteManagedRegistration"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';
import { useRouter } from 'vue-router';
import { getCommunityApiUrl } from 'src/services/communityApi';

/* ===========================================================
   ESTADO DA SESSÃO E DAS LISTAS
=========================================================== */

const SESSION_KEY = '13calendar-community-admin-token';
const adminToken = ref(readSessionToken());
const registrations = ref([]);
const isAuthorized = ref(false);
const isLoading = ref(false);
const actionId = ref('');
const actionName = ref('');
const isConnectingTelegram = ref(false);
const notificationStatus = ref({ configured: null, connected: false, username: '' });
const message = ref('');
const hasError = ref(false);
const managementOpen = ref(false);
const deletionCodeOpen = ref(false);
const deleteConfirmationOpen = ref(false);
const managedRegistration = ref(null);
const selectedAvatarFile = ref(null);
const generatedDeletionLink = ref('');
const editForm = reactive({
  publicName: '',
  socialNetwork: 'instagram',
  socialProfile: '',
  country: '',
});
const { t, locale } = useI18n({ useScope: 'global' });
const router = useRouter();

const pendingRegistrations = computed(() =>
  registrations.value.filter(({ status }) => status === 'pending'),
);
const approvedRegistrations = computed(() =>
  registrations.value.filter(({ status }) => status === 'approved'),
);
const socialNetworkOptions = computed(() => [
  { label: 'Instagram', value: 'instagram' },
  { label: 'Facebook', value: 'facebook' },
  { label: t('community.otherNetwork'), value: 'other' },
]);
const telegramStatusText = computed(() => {
  if (notificationStatus.value.configured === null) return t('community.adminTelegramUnavailable');
  if (!notificationStatus.value.configured) return t('community.adminTelegramMissing');
  if (notificationStatus.value.connected)
    return t('community.adminTelegramConnected', {
      username: notificationStatus.value.username || 'jean7rafael',
    });
  return t('community.adminTelegramWaiting');
});

useMeta(() => ({ title: t('community.adminTitle') }));
if (adminToken.value) loadRegistrations();

/* ===========================================================
   LEITURA DA FILA E DOS PERFIS PUBLICADOS
=========================================================== */

async function loadRegistrations(options = {}) {
  const endpoint = getCommunityApiUrl('admin/registrations?status=all');
  if (!endpoint || !adminToken.value.trim()) return;
  isLoading.value = true;
  if (!options.preserveMessage) message.value = '';
  hasError.value = false;

  try {
    const response = await fetch(endpoint, { headers: authorizationHeaders(), cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    registrations.value = Array.isArray(payload?.registrations) ? payload.registrations : [];
    isAuthorized.value = true;
    sessionStorage.setItem(SESSION_KEY, adminToken.value.trim());
    if (notificationStatus.value.configured === null) await loadNotificationStatus();
  } catch {
    isAuthorized.value = false;
    showMessage(t('community.adminError'), true);
    sessionStorage.removeItem(SESSION_KEY);
  } finally {
    isLoading.value = false;
  }
}

function authorizationHeaders(json = false) {
  const headers = { Authorization: `Bearer ${adminToken.value.trim()}` };
  if (json) headers['Content-Type'] = 'application/json';
  return headers;
}

/* ===========================================================
   AVISOS DO TELEGRAM
=========================================================== */

async function loadNotificationStatus() {
  const endpoint = getCommunityApiUrl('admin/notifications');
  if (!endpoint) return;
  try {
    const response = await fetch(endpoint, { headers: authorizationHeaders(), cache: 'no-store' });
    if (!response.ok) return;
    const payload = await response.json();
    if (payload?.telegram) notificationStatus.value = payload.telegram;
  } catch {
    // A moderação permanece utilizável mesmo se o canal estiver indisponível.
  }
}

async function connectTelegram() {
  const endpoint = getCommunityApiUrl('admin/notifications/telegram/connect');
  if (!endpoint) return;
  isConnectingTelegram.value = true;
  message.value = '';

  try {
    const response = await fetch(endpoint, { method: 'POST', headers: authorizationHeaders() });
    const payload = await response.json();
    if (!response.ok || !payload?.telegram?.connected)
      throw new Error(payload?.error || 'telegram_connection_failed');
    notificationStatus.value = payload.telegram;
    showMessage(t('community.adminTelegramSuccess'));
  } catch (error) {
    showMessage(
      error?.message === 'telegram_chat_not_found'
        ? t('community.adminTelegramNotFound')
        : t('community.adminTelegramError'),
      true,
    );
  } finally {
    isConnectingTelegram.value = false;
  }
}

/* ===========================================================
   MODERAÇÃO E EDIÇÃO
=========================================================== */

async function moderate(id, status) {
  const endpoint = getCommunityApiUrl(`admin/registrations/${encodeURIComponent(id)}`);
  actionId.value = id;
  message.value = '';
  try {
    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: authorizationHeaders(true),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await loadRegistrations({ preserveMessage: true });
    showMessage(t('community.adminUpdated'));
  } catch {
    showMessage(t('community.adminError'), true);
  } finally {
    actionId.value = '';
  }
}

function openManagement(registration) {
  managedRegistration.value = { ...registration };
  Object.assign(editForm, {
    publicName: registration.publicName,
    socialNetwork: registration.socialNetwork,
    socialProfile: registration.socialProfile,
    country: registration.country || '',
  });
  selectedAvatarFile.value = null;
  managementOpen.value = true;
}

async function saveRegistration() {
  if (!managedRegistration.value || !editForm.publicName.trim() || !editForm.socialProfile.trim())
    return;
  actionName.value = 'save';
  try {
    const endpoint = getCommunityApiUrl(
      `admin/registrations/${encodeURIComponent(managedRegistration.value.id)}`,
    );
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: authorizationHeaders(true),
      body: JSON.stringify({
        publicName: editForm.publicName.trim(),
        socialNetwork: editForm.socialNetwork,
        socialProfile: editForm.socialProfile.trim(),
        locale: managedRegistration.value.locale || locale.value,
        country: editForm.country.trim().toUpperCase(),
      }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await reloadManagedRegistration();
    showMessage(t('community.adminSaved'));
  } catch {
    showMessage(t('community.adminError'), true);
  } finally {
    actionName.value = '';
  }
}

/* ===========================================================
   CAPTURA DE PERFIL ARMAZENADA NO CLOUDFLARE
=========================================================== */

async function captureAvatar() {
  if (!managedRegistration.value) return;
  actionName.value = 'avatar-capture';
  try {
    const endpoint = getCommunityApiUrl(
      `admin/registrations/${encodeURIComponent(managedRegistration.value.id)}/avatar/capture`,
    );
    const response = await fetch(endpoint, { method: 'POST', headers: authorizationHeaders() });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await reloadManagedRegistration();
    showMessage(t('community.adminPhotoCaptured'));
  } catch {
    showMessage(t('community.adminPhotoCaptureError'), true);
  } finally {
    actionName.value = '';
  }
}

async function uploadAvatar() {
  if (!managedRegistration.value || !selectedAvatarFile.value) return;
  actionName.value = 'avatar';
  try {
    const endpoint = getCommunityApiUrl(
      `admin/registrations/${encodeURIComponent(managedRegistration.value.id)}/avatar`,
    );
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: { ...authorizationHeaders(), 'Content-Type': selectedAvatarFile.value.type },
      body: selectedAvatarFile.value,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    selectedAvatarFile.value = null;
    await reloadManagedRegistration();
    showMessage(t('community.adminPhotoSaved'));
  } catch {
    showMessage(t('community.adminPhotoError'), true);
  } finally {
    actionName.value = '';
  }
}

async function removeAvatar() {
  if (!managedRegistration.value) return;
  actionName.value = 'avatar-remove';
  try {
    const endpoint = getCommunityApiUrl(
      `admin/registrations/${encodeURIComponent(managedRegistration.value.id)}/avatar`,
    );
    const response = await fetch(endpoint, { method: 'DELETE', headers: authorizationHeaders() });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await reloadManagedRegistration();
    showMessage(t('community.adminPhotoRemoved'));
  } catch {
    showMessage(t('community.adminPhotoError'), true);
  } finally {
    actionName.value = '';
  }
}

/* ===========================================================
   CÓDIGO PRIVADO E EXCLUSÃO ADMINISTRATIVA
=========================================================== */

async function generateDeletionCode() {
  if (!managedRegistration.value) return;
  actionName.value = 'deletion-code';
  try {
    const endpoint = getCommunityApiUrl(
      `admin/registrations/${encodeURIComponent(managedRegistration.value.id)}/deletion-code`,
    );
    const response = await fetch(endpoint, { method: 'POST', headers: authorizationHeaders() });
    const payload = await response.json();
    if (!response.ok || !payload?.deletionCode) throw new Error(`HTTP ${response.status}`);
    const route = router.resolve({
      name: 'community-remove',
      query: { code: payload.deletionCode },
    });
    generatedDeletionLink.value = new URL(route.href, window.location.href).href;
    managedRegistration.value.hasDeletionCode = true;
    deletionCodeOpen.value = true;
    await loadRegistrations({ preserveMessage: true });
  } catch {
    showMessage(t('community.adminError'), true);
  } finally {
    actionName.value = '';
  }
}

async function deleteManagedRegistration() {
  if (!managedRegistration.value) return;
  actionName.value = 'delete';
  try {
    const endpoint = getCommunityApiUrl(
      `admin/registrations/${encodeURIComponent(managedRegistration.value.id)}`,
    );
    const response = await fetch(endpoint, { method: 'DELETE', headers: authorizationHeaders() });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    deleteConfirmationOpen.value = false;
    managementOpen.value = false;
    await loadRegistrations({ preserveMessage: true });
    showMessage(t('community.adminDeleted'));
  } catch {
    showMessage(t('community.adminError'), true);
  } finally {
    actionName.value = '';
  }
}

async function reloadManagedRegistration() {
  const id = managedRegistration.value?.id;
  await loadRegistrations({ preserveMessage: true });
  const refreshed = registrations.value.find((registration) => registration.id === id);
  if (refreshed) managedRegistration.value = { ...refreshed };
}

async function copyDeletionLink() {
  try {
    await navigator.clipboard.writeText(generatedDeletionLink.value);
    showMessage(t('community.adminCopied'));
  } catch {
    showMessage(t('community.adminCopyError'), true);
  }
}

function showAvatarSizeError() {
  showMessage(t('community.adminPhotoSizeError'), true);
}
function showMessage(text, error = false) {
  message.value = text;
  hasError.value = error;
}

function signOut() {
  sessionStorage.removeItem(SESSION_KEY);
  adminToken.value = '';
  registrations.value = [];
  notificationStatus.value = { configured: null, connected: false, username: '' };
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

function getProfileUrl(registration) {
  const profile = String(registration?.socialProfile || '').trim();
  if (/^https?:\/\//i.test(profile)) return profile;
  const username = profile.replace(/^@/, '');
  if (registration?.socialNetwork === 'instagram')
    return `https://www.instagram.com/${encodeURIComponent(username)}/`;
  if (registration?.socialNetwork === 'facebook')
    return `https://www.facebook.com/${encodeURIComponent(username)}`;
  return profile;
}

function getMemberInitial(name) {
  return (
    String(name || '?')
      .trim()
      .charAt(0)
      .toUpperCase() || '?'
  );
}
function getCountryFlag(code) {
  const country = String(code || '').toUpperCase();
  if (!/^[A-Z]{2}$/.test(country)) return '🌐';
  return country.replace(/[A-Z]/g, (letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)));
}
function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
}
</script>

<style scoped>
.community-admin-page {
  width: min(100%, 1040px);
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
.community-admin-card > header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.community-admin-card > header .q-icon {
  color: #8b5cf6;
  font-size: 34px;
}
.community-admin-card h1 {
  margin: 0;
  font-size: clamp(24px, 4vw, 36px);
}
.community-admin-card header p {
  margin: 8px 0 0;
  color: var(--app-text-muted);
}
.community-admin-login {
  max-width: 520px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 12px;
  margin: 32px auto 0;
}
.community-admin-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 32px;
}
.community-admin-toolbar--approved {
  margin-top: 44px;
  padding-top: 28px;
  border-top: 1px solid var(--app-border);
}
.community-admin-toolbar h2 {
  margin: 0;
  font-size: 18px;
}
.community-admin-toolbar small {
  display: block;
  margin-top: 4px;
  color: var(--app-text-faint);
}
.community-admin-notifications {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
  margin-top: 32px;
  padding: 16px;
  color: var(--app-text);
  background: color-mix(in srgb, #8b5cf6 8%, var(--app-surface));
  border: 1px solid color-mix(in srgb, #8b5cf6 34%, var(--app-border));
  border-radius: 15px;
}
.community-admin-notifications > .q-icon {
  color: #8b5cf6;
  font-size: 28px;
}
.community-admin-notifications h2 {
  margin: 0;
  font-size: 16px;
}
.community-admin-notifications p {
  margin: 4px 0;
  color: var(--app-text-muted);
}
.community-admin-notifications small {
  color: var(--app-text-faint);
}
.community-admin-list {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}
.community-admin-list article {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px;
  border: 1px solid var(--app-border);
  border-radius: 15px;
}
.community-admin-identity {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}
.community-admin-identity > span:not(.community-admin-avatar) {
  font-size: 23px;
}
.community-admin-identity strong,
.community-admin-identity small,
.community-admin-identity time {
  display: block;
}
.community-admin-identity small {
  margin-top: 3px;
  color: var(--app-text-muted);
}
.community-admin-identity time {
  margin-top: 5px;
  color: var(--app-text-faint);
  font-size: 11px;
}
.community-admin-actions {
  flex: none;
  display: flex;
  align-items: center;
  gap: 8px;
}
.community-admin-avatar {
  width: 44px;
  height: 44px;
  flex: none;
  display: grid;
  place-items: center;
  overflow: hidden;
  color: white;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  border-radius: 50%;
  font-weight: 800;
}
.community-admin-avatar img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
.community-admin-avatar--large {
  width: 70px;
  height: 70px;
  font-size: 22px;
}
.community-admin-empty {
  margin: 32px 0 0;
  color: var(--app-text-muted);
  text-align: center;
}
.community-admin-message {
  margin: 22px 0 0;
  color: #059669;
  text-align: center;
}
.community-admin-message--error {
  color: #dc2626;
}
.community-management-dialog,
.community-code-dialog,
.community-confirm-dialog {
  width: min(680px, 94vw);
  color: var(--app-text);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 18px;
}
.community-management-dialog__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.community-management-dialog__body {
  display: grid;
  gap: 18px;
  max-height: 75vh;
  overflow-y: auto;
}
.community-management-dialog__avatar {
  display: flex;
  align-items: center;
  gap: 16px;
}
.community-management-dialog__avatar p,
.community-management-dialog__ownership p,
.community-code-dialog p,
.community-confirm-dialog p {
  margin: 4px 0 0;
  color: var(--app-text-muted);
}
.community-management-dialog__row-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.community-management-dialog__fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.community-management-dialog__ownership {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

@media (max-width: 680px) {
  .community-admin-page {
    padding: 24px 12px;
  }
  .community-admin-login {
    grid-template-columns: 1fr;
  }
  .community-admin-notifications {
    grid-template-columns: auto 1fr;
  }
  .community-admin-notifications .q-btn {
    grid-column: 1 / -1;
    justify-self: stretch;
  }
  .community-admin-list article {
    align-items: stretch;
    flex-direction: column;
  }
  .community-admin-actions {
    justify-content: flex-end;
    flex-wrap: wrap;
  }
  .community-management-dialog__fields {
    grid-template-columns: 1fr;
  }
  .community-management-dialog__ownership {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
