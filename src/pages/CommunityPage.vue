<template>
  <q-page class="community-page">
    <!-- Identidade da comunidade inspirada no painel de perfil. -->
    <section class="community-hero">
      <div class="community-orbit" aria-hidden="true">
        <q-icon name="public" />
      </div>

      <p class="community-eyebrow">{{ t('community.eyebrow') }}</p>
      <h1>{{ t('community.title') }}</h1>
      <p class="community-description">{{ t('community.description') }}</p>

      <q-select
        v-model="selectedScope"
        outlined
        dense
        emit-value
        map-options
        options-dense
        :options="scopeOptions"
        :label="t('community.scopeLabel')"
        class="community-scope-select"
      />
    </section>

    <!-- Aviso honesto enquanto a coleta ainda não está conectada. -->
    <section
      v-if="!isReady"
      class="community-status"
      :class="{ 'community-status--error': loadFailed }"
      role="status"
    >
      <q-icon :name="loadFailed ? 'cloud_off' : 'query_stats'" size="24px" />
      <div>
        <h2>{{ t(loadFailed ? 'community.unavailableTitle' : 'community.waitingTitle') }}</h2>
        <p>
          {{
            t(
              loadFailed
                ? 'community.unavailableDescription'
                : 'community.waitingDescription',
            )
          }}
        </p>
      </div>
    </section>

    <!-- Faixa compacta com os números principais. -->
    <section class="community-metrics" :aria-label="t('community.title')">
      <article v-for="metric in summaryMetrics" :key="metric.label" class="community-metric">
        <strong>{{ metric.value }}</strong>
        <span>{{ metric.label }}</span>
      </article>
    </section>

    <div class="community-dashboard">
      <!-- Mapa de calor diário. -->
      <section class="community-panel community-panel--activity">
        <header class="community-panel__header">
          <div>
            <h2>{{ t('community.activityTitle') }}</h2>
            <p>{{ t('community.activityDescription') }}</p>
          </div>
          <span v-if="updatedAtLabel" class="community-updated">{{ updatedAtLabel }}</span>
        </header>

        <div class="community-heatmap-shell" dir="ltr">
          <div class="community-heatmap" role="img" :aria-label="t('community.activityTitle')">
            <span
              v-for="cell in activityCells"
              :key="cell.date"
              class="community-heatmap__cell"
              :class="`community-heatmap__cell--level-${cell.level}`"
              :title="`${formatDate(cell.date)} · ${formatVisits(cell.visits)}`"
            ></span>
          </div>

          <div class="community-heatmap-legend">
            <span>{{ t('community.less') }}</span>
            <i v-for="level in 5" :key="level" :class="`community-heatmap__cell--level-${level - 1}`"></i>
            <span>{{ t('community.more') }}</span>
          </div>
        </div>
      </section>

      <!-- Distribuição geográfica agregada. -->
      <section class="community-panel">
        <header class="community-panel__header">
          <div>
            <h2>{{ t('community.geographyTitle') }}</h2>
            <p>{{ t('community.geographyDescription') }}</p>
          </div>
          <q-icon name="language" class="community-panel__icon" />
        </header>

        <div v-if="topCountries.length" class="community-ranking">
          <article v-for="(country, index) in topCountries" :key="country.code" class="community-ranking__row">
            <div class="community-ranking__label">
              <span>{{ getCountryFlag(country.code) }}</span>
              <strong>{{ getCountryName(country.code) }}</strong>
              <small>{{ t('community.rank', { position: index + 1 }) }}</small>
            </div>
            <div class="community-ranking__track" aria-hidden="true">
              <span :style="{ width: `${country.barWidth}%` }"></span>
            </div>
            <b>{{ formatNumber(country.visits) }}</b>
          </article>
        </div>
        <p v-else class="community-empty">{{ t('community.empty') }}</p>
      </section>

      <!-- Páginas mais exploradas. -->
      <section class="community-panel">
        <header class="community-panel__header">
          <div>
            <h2>{{ t('community.interestsTitle') }}</h2>
            <p>{{ t('community.interestsDescription') }}</p>
          </div>
          <q-icon name="auto_awesome" class="community-panel__icon" />
        </header>

        <ol v-if="topPages.length" class="community-simple-list">
          <li v-for="page in topPages" :key="page.path">
            <span>{{ getPageLabel(page.path) }}</span>
            <strong>{{ formatNumber(page.views) }}</strong>
          </li>
        </ol>
        <p v-else class="community-empty">{{ t('community.empty') }}</p>
      </section>

      <!-- Origem e dispositivos ficam juntos como no painel de referência. -->
      <section class="community-panel community-panel--split">
        <article>
          <header class="community-panel__header">
            <div>
              <h2>{{ t('community.originsTitle') }}</h2>
              <p>{{ t('community.originsDescription') }}</p>
            </div>
          </header>
          <ol v-if="topReferrers.length" class="community-simple-list">
            <li v-for="referrer in topReferrers" :key="referrer.host">
              <span>{{ referrer.host }}</span>
              <strong>{{ formatNumber(referrer.visits) }}</strong>
            </li>
          </ol>
          <p v-else class="community-empty">{{ t('community.empty') }}</p>
        </article>

        <article>
          <header class="community-panel__header">
            <div>
              <h2>{{ t('community.devicesTitle') }}</h2>
              <p>{{ t('community.devicesDescription') }}</p>
            </div>
          </header>
          <ol v-if="topDevices.length" class="community-simple-list">
            <li v-for="device in topDevices" :key="device.name">
              <span>{{ device.name }}</span>
              <strong>{{ formatNumber(device.visits) }}</strong>
            </li>
          </ol>
          <p v-else class="community-empty">{{ t('community.empty') }}</p>
        </article>
      </section>
    </div>

    <!-- Transparência sobre fonte, privacidade e interpretação. -->
    <section class="community-privacy">
      <q-icon name="shield" size="26px" />
      <div>
        <h2>{{ t('community.privacyTitle') }}</h2>
        <p>{{ t('community.privacyDescription') }}</p>
        <p>{{ t('community.approximateNote') }}</p>
        <small>{{ t('community.dataSource') }}</small>
      </div>
      <!-- Acesso discreto: a rota continua protegida pelo segredo administrativo. -->
      <q-btn
        class="community-privacy__admin"
        flat
        round
        dense
        icon="admin_panel_settings"
        :to="{ name: 'community-admin' }"
        :aria-label="t('community.adminAccess')"
      >
        <q-tooltip>{{ t('community.adminAccess') }}</q-tooltip>
      </q-btn>
    </section>

    <!-- Perfis voluntários aparecem somente após moderação. -->
    <section class="community-members" :aria-labelledby="membersTitleId">
      <header class="community-members__heading">
        <p>{{ t('community.membersEyebrow') }}</p>
        <h2 :id="membersTitleId">{{ t('community.membersTitle') }}</h2>
        <span>{{ t('community.membersDescription') }}</span>
      </header>

      <div v-if="approvedMembers.length" class="community-members__grid">
        <a
          v-for="member in approvedMembers"
          :key="`${member.socialNetwork}:${member.socialProfile}`"
          class="community-member"
          :href="getMemberProfileUrl(member)"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="t('community.memberProfile', { name: member.publicName })"
        >
          <span class="community-member__avatar" aria-hidden="true">
            {{ getMemberInitial(member.publicName) }}
          </span>
          <span class="community-member__identity">
            <strong>{{ member.publicName }}</strong>
            <small>{{ getMemberProfileLabel(member) }}</small>
          </span>
          <span class="community-member__country" :title="getCountryName(member.country)">
            {{ getCountryFlag(member.country) }}
          </span>
        </a>
      </div>
      <p v-else class="community-members__empty">{{ t('community.membersEmpty') }}</p>
    </section>

    <!-- Cadastro voluntário separado visualmente do painel e do rodapé. -->
    <CommunityRegistration />

    <!-- Rodapé institucional compartilhado, sem repetir o bloco explicativo. -->
    <AppFooter :show-context="false" />
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';
import CommunityRegistration from 'src/components/CommunityRegistration.vue';
import AppFooter from 'src/components/AppFooter.vue';
import { getCommunityApiUrl } from 'src/services/communityApi';

/* ===========================================================
   ESTADO DOS DADOS AGREGADOS
=========================================================== */

const EMPTY_DATA = {
  status: 'awaiting_configuration',
  generatedAt: null,
  period: { from: null, to: null },
  summary: { visits: null, pageViews: null, countries: null },
  activity: [],
  countries: [],
  pages: [],
  referrers: [],
  devices: [],
};

const communityData = ref(EMPTY_DATA);
const approvedMembers = ref([]);
const loadFailed = ref(false);
const selectedScope = ref('world');
const membersTitleId = 'community-members-title';

const { t, locale } = useI18n({ useScope: 'global' });
const preferredHolidayCountry = readPreferredHolidayCountry();

useMeta(() => ({ title: t('community.browserTitle') }));

/* ===========================================================
   CARREGAMENTO DO RETRATO PÚBLICO

   O navegador recebe somente um JSON agregado. Credenciais e
   consultas à Cloudflare nunca fazem parte desta página.
=========================================================== */

onMounted(async () => {
  await Promise.all([loadCommunityAnalytics(), loadApprovedMembers()]);
});

async function loadCommunityAnalytics() {
  try {
    const liveEndpoint = getCommunityApiUrl('analytics/stats');
    const response = await fetch(liveEndpoint || `${import.meta.env.BASE_URL}data/community-stats.json`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    communityData.value = {
      ...EMPTY_DATA,
      ...(await response.json()),
    };
  } catch {
    loadFailed.value = true;
  }
}

async function loadApprovedMembers() {
  const endpoint = getCommunityApiUrl('members');

  if (!endpoint) return;

  try {
    const response = await fetch(endpoint, { cache: 'no-store' });

    if (!response.ok) return;

    const payload = await response.json();
    approvedMembers.value = Array.isArray(payload?.members) ? payload.members : [];
  } catch {
    // O painel de estatísticas continua funcional se a lista estiver indisponível.
  }
}

const isReady = computed(() => communityData.value.status === 'ready');

/* ===========================================================
   ESCOPO MUNDIAL OU PAÍS ESCOLHIDO
=========================================================== */

const countryRows = computed(() =>
  Array.isArray(communityData.value.countries) ? communityData.value.countries : [],
);

const scopeOptions = computed(() => [
  { label: t('community.scopeWorld'), value: 'world' },
  ...countryRows.value.map((country) => ({
    label: `${getCountryFlag(country.code)} ${getCountryName(country.code)}`,
    value: String(country.code).toUpperCase(),
  })),
]);

watch(
  countryRows,
  (countries) => {
    if (
      selectedScope.value === 'world' &&
      countries.some(({ code }) => code === preferredHolidayCountry)
    ) {
      selectedScope.value = preferredHolidayCountry;
    }
  },
  { immediate: true },
);

const selectedCountryRow = computed(() =>
  countryRows.value.find(({ code }) => String(code).toUpperCase() === selectedScope.value),
);

/* ===========================================================
   MÉTRICAS PRINCIPAIS
=========================================================== */

const summaryMetrics = computed(() => {
  const summary = communityData.value.summary || {};
  const countryValue = selectedCountryRow.value?.visits;

  return [
    {
      value: formatMetricValue(summary.visits),
      label: t('community.estimatedVisits'),
    },
    {
      value: formatMetricValue(summary.pageViews),
      label: t('community.pageViews'),
    },
    {
      value: formatMetricValue(summary.countries),
      label: t('community.countries'),
    },
    {
      value:
        selectedScope.value === 'world'
          ? periodLabel.value
          : formatMetricValue(countryValue),
      label:
        selectedScope.value === 'world'
          ? t('community.period')
          : t('community.selectedCountry'),
    },
  ];
});

const periodLabel = computed(() => {
  const { from, to } = communityData.value.period || {};

  if (!from || !to) {
    return '—';
  }

  const fromDate = parseDay(from);
  const toDate = parseDay(to);

  if (!fromDate || !toDate) {
    return '—';
  }

  const monthFormatter = new Intl.DateTimeFormat(locale.value, { month: 'short' });
  const monthYearFormatter = new Intl.DateTimeFormat(locale.value, {
    month: 'short',
    year: 'numeric',
  });

  return fromDate.getUTCFullYear() === toDate.getUTCFullYear()
    ? `${monthFormatter.format(fromDate)} – ${monthYearFormatter.format(toDate)}`
    : `${monthYearFormatter.format(fromDate)} – ${monthYearFormatter.format(toDate)}`;
});

const updatedAtLabel = computed(() => {
  if (!communityData.value.generatedAt) {
    return '';
  }

  return t('community.updatedAt', {
    date: new Intl.DateTimeFormat(locale.value, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(communityData.value.generatedAt)),
  });
});

/* ===========================================================
   MAPA DE CALOR DOS ÚLTIMOS SEIS MESES
=========================================================== */

const activityCells = computed(() => {
  const values = new Map(
    (communityData.value.activity || []).map((item) => [item.date, Number(item.visits) || 0]),
  );
  const endDate = parseDay(communityData.value.period?.to) || new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 181);
  const maximum = Math.max(0, ...values.values());

  return Array.from({ length: 182 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const dateKey = toDateKey(date);
    const visits = values.get(dateKey) || 0;

    return {
      date: dateKey,
      visits,
      level: maximum && visits ? Math.max(1, Math.ceil((visits / maximum) * 4)) : 0,
    };
  });
});

/* ===========================================================
   RANKINGS E LISTAS SECUNDÁRIAS
=========================================================== */

const topCountries = computed(() => {
  const rows = [...countryRows.value]
    .sort((left, right) => Number(right.visits) - Number(left.visits))
    .slice(0, 8);
  const maximum = Math.max(1, ...rows.map(({ visits }) => Number(visits) || 0));

  return rows.map((row) => ({
    ...row,
    barWidth: Math.max(4, ((Number(row.visits) || 0) / maximum) * 100),
  }));
});

const topPages = computed(() => (communityData.value.pages || []).slice(0, 6));
const topReferrers = computed(() => (communityData.value.referrers || []).slice(0, 5));
const topDevices = computed(() => (communityData.value.devices || []).slice(0, 5));

/* ===========================================================
   FORMATAÇÃO LOCALIZADA
=========================================================== */

function formatNumber(value) {
  return new Intl.NumberFormat(locale.value, { notation: 'compact', maximumFractionDigits: 1 }).format(
    Number(value) || 0,
  );
}

function formatMetricValue(value) {
  return value === null || value === undefined || !isReady.value ? '—' : formatNumber(value);
}

function formatVisits(value) {
  return t('community.visits', { count: formatNumber(value) });
}

function formatDate(value) {
  const date = parseDay(value);

  return date
    ? new Intl.DateTimeFormat(locale.value, { day: '2-digit', month: 'short', year: 'numeric' }).format(
        date,
      )
    : '—';
}

function parseDay(value) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toDateKey(date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part, index) => (index ? String(part).padStart(2, '0') : String(part)))
    .join('-');
}

function getCountryName(code) {
  try {
    return new Intl.DisplayNames([locale.value], { type: 'region' }).of(String(code).toUpperCase());
  } catch {
    return String(code).toUpperCase();
  }
}

function getCountryFlag(code) {
  if (!/^[A-Z]{2}$/.test(String(code || '').toUpperCase())) {
    return '🌐';
  }

  return String(code)
    .toUpperCase()
    .replace(/[A-Z]/g, (letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)));
}

function getPageLabel(path) {
  if (!path || path === '/' || path === '/#/') {
    return '13 Calendar';
  }

  return String(path).replace(/^\/?#?\/?/, '/');
}

function getMemberInitial(name) {
  return Array.from(String(name || '').trim())[0]?.toUpperCase() || '•';
}

function getMemberProfileLabel(member) {
  return `${member.socialNetwork} · ${member.socialProfile}`;
}

function getMemberProfileUrl(member) {
  const profile = String(member?.socialProfile || '').trim();

  if (/^https:\/\//i.test(profile)) {
    return profile;
  }

  const username = profile.replace(/^@/, '').replace(/^\/+|\/+$/g, '');

  if (member?.socialNetwork === 'instagram') {
    return `https://www.instagram.com/${encodeURIComponent(username)}/`;
  }

  if (member?.socialNetwork === 'facebook') {
    return `https://www.facebook.com/${encodeURIComponent(username)}`;
  }

  return '#';
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
   ESTRUTURA DA PÁGINA COMUNITÁRIA
=========================================================== */

.community-page {
  width: min(100%, 1180px);
  min-height: 100%;
  margin: 0 auto;
  padding: 24px 24px 36px;
  color: var(--app-text);
}

/* ===========================================================
   IDENTIDADE E FILTRO DE ESCOPO
=========================================================== */

.community-hero {
  max-width: 760px;
  margin: 20px auto 32px;
  text-align: center;
}

.community-orbit {
  width: 78px;
  height: 78px;
  display: grid;
  place-items: center;
  margin: 0 auto 18px;
  color: white;
  background:
    radial-gradient(circle at 32% 24%, rgb(255 255 255 / 28%), transparent 28%),
    linear-gradient(135deg, #2563eb, #7c3aed);
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 50%;
  box-shadow: 0 18px 44px rgb(79 70 229 / 26%);
  font-size: 34px;
}

.community-eyebrow {
  margin: 0 0 10px;
  color: #8b5cf6;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.community-hero h1 {
  margin: 0;
  font-size: clamp(28px, 5vw, 48px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.04em;
}

.community-description {
  max-width: 620px;
  margin: 18px auto 0;
  color: var(--app-text-muted);
  font-size: 16px;
  line-height: 1.65;
}

.community-scope-select {
  width: min(100%, 290px);
  margin: 24px auto 0;
}

/* ===========================================================
   AVISO E MÉTRICAS PRINCIPAIS
=========================================================== */

.community-status {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 18px;
  padding: 16px 18px;
  color: #6d28d9;
  background: color-mix(in srgb, #8b5cf6 9%, var(--app-surface));
  border: 1px solid color-mix(in srgb, #8b5cf6 28%, var(--app-border));
  border-radius: 16px;
}

.community-status--error {
  color: #b45309;
  background: color-mix(in srgb, #f59e0b 8%, var(--app-surface));
  border-color: color-mix(in srgb, #f59e0b 28%, var(--app-border));
}

.community-status h2 {
  margin: 0 0 3px;
  color: var(--app-text);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
}

.community-status p {
  margin: 0;
  color: var(--app-text-muted);
  font-size: 12px;
  line-height: 1.5;
}

.community-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 20px;
  background: color-mix(in srgb, var(--app-surface) 88%, transparent);
  border: 1px solid var(--app-border);
  border-radius: 17px;
  box-shadow: var(--app-card-shadow);
  overflow: hidden;
}

.community-metric {
  min-width: 0;
  padding: 17px 20px;
  text-align: center;
}

.community-metric + .community-metric {
  border-inline-start: 1px solid var(--app-border);
}

.community-metric strong,
.community-metric span {
  display: block;
}

.community-metric strong {
  overflow: hidden;
  font-size: 18px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.community-metric span {
  margin-top: 3px;
  color: var(--app-text-muted);
  font-size: 11px;
}

/* ===========================================================
   PAINÉIS E GRÁFICOS
=========================================================== */

.community-dashboard {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.community-panel {
  min-width: 0;
  padding: 22px;
  background: color-mix(in srgb, var(--app-surface) 92%, transparent);
  border: 1px solid var(--app-border);
  border-radius: 18px;
  box-shadow: var(--app-card-shadow);
}

.community-panel--activity,
.community-panel--split {
  grid-column: 1 / -1;
}

.community-panel--split {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 38px;
}

.community-panel--split > article + article {
  padding-inline-start: 38px;
  border-inline-start: 1px solid var(--app-border);
}

.community-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 20px;
}

.community-panel__header h2 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
}

.community-panel__header p {
  margin: 5px 0 0;
  color: var(--app-text-muted);
  font-size: 12px;
  line-height: 1.45;
}

.community-panel__icon,
.community-updated {
  color: var(--app-text-faint);
}

.community-panel__icon {
  font-size: 22px;
}

.community-updated {
  flex: none;
  font-size: 10px;
}

.community-heatmap-shell {
  overflow-x: auto;
  padding: 4px 1px 1px;
}

.community-heatmap {
  width: max-content;
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(7, 11px);
  gap: 4px;
  margin-inline: auto;
}

.community-heatmap__cell,
.community-heatmap-legend i {
  width: 11px;
  height: 11px;
  display: block;
  background: color-mix(in srgb, var(--app-text) 7%, transparent);
  border: 1px solid color-mix(in srgb, var(--app-border) 66%, transparent);
  border-radius: 3px;
}

.community-heatmap__cell--level-1 { background: #c7d2fe !important; }
.community-heatmap__cell--level-2 { background: #818cf8 !important; }
.community-heatmap__cell--level-3 { background: #6366f1 !important; }
.community-heatmap__cell--level-4 { background: #7c3aed !important; }

.community-heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 12px;
  color: var(--app-text-faint);
  font-size: 10px;
}

.community-ranking {
  display: grid;
  gap: 13px;
}

.community-ranking__row {
  display: grid;
  grid-template-columns: minmax(120px, 0.8fr) minmax(80px, 1fr) auto;
  align-items: center;
  gap: 12px;
}

.community-ranking__label {
  min-width: 0;
  display: grid;
  grid-template-columns: 23px minmax(0, 1fr);
  align-items: center;
  column-gap: 7px;
}

.community-ranking__label strong,
.community-ranking__label small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.community-ranking__label strong {
  font-size: 12px;
  font-weight: 600;
}

.community-ranking__label small {
  grid-column: 2;
  color: var(--app-text-faint);
  font-size: 9px;
}

.community-ranking__track {
  height: 7px;
  overflow: hidden;
  background: color-mix(in srgb, var(--app-text) 6%, transparent);
  border-radius: 999px;
}

.community-ranking__track span {
  height: 100%;
  display: block;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: inherit;
}

.community-ranking__row > b {
  min-width: 34px;
  text-align: end;
  font-size: 11px;
}

.community-simple-list {
  display: grid;
  gap: 1px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.community-simple-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 9px 2px;
  color: var(--app-text-muted);
  border-bottom: 1px solid color-mix(in srgb, var(--app-border) 72%, transparent);
  font-size: 12px;
}

.community-simple-list li:last-child {
  border-bottom: 0;
}

.community-simple-list span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.community-simple-list strong {
  color: var(--app-text);
  font-weight: 600;
}

.community-empty {
  min-height: 84px;
  display: grid;
  place-items: center;
  margin: 0;
  color: var(--app-text-faint);
  font-size: 12px;
  text-align: center;
}

/* ===========================================================
   PRIVACIDADE E FONTE DOS DADOS
=========================================================== */

.community-privacy {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-top: 18px;
  padding: 22px 58px 22px 22px;
  color: #059669;
  background: color-mix(in srgb, #10b981 7%, var(--app-surface));
  border: 1px solid color-mix(in srgb, #10b981 24%, var(--app-border));
  border-radius: 18px;
}

.community-privacy h2 {
  margin: 0 0 7px;
  color: var(--app-text);
  font-size: 14px;
  line-height: 1.35;
}

.community-privacy p {
  margin: 3px 0;
  color: var(--app-text-muted);
  font-size: 12px;
  line-height: 1.5;
}

.community-privacy small {
  display: block;
  margin-top: 8px;
  color: var(--app-text-faint);
  font-size: 10px;
}

.community-privacy__admin {
  position: absolute;
  right: 14px;
  bottom: 12px;
  color: var(--app-text-faint);
  opacity: 0.38;
  transition: color 160ms ease, opacity 160ms ease, background 160ms ease;
}

.community-privacy__admin:hover,
.community-privacy__admin:focus-visible {
  color: #8b5cf6;
  opacity: 1;
}

[dir='rtl'] .community-privacy {
  padding-right: 22px;
  padding-left: 58px;
}

[dir='rtl'] .community-privacy__admin {
  right: auto;
  left: 14px;
}

/* ===========================================================
   PERFIS PÚBLICOS APROVADOS
=========================================================== */

.community-members {
  margin-top: 28px;
  padding: clamp(24px, 5vw, 42px);
  background: color-mix(in srgb, var(--app-surface) 92%, transparent);
  border: 1px solid var(--app-border);
  border-radius: 20px;
  box-shadow: var(--app-card-shadow);
}

.community-members__heading {
  max-width: 680px;
  margin: 0 auto 28px;
  text-align: center;
}

.community-members__heading p {
  margin: 0 0 8px;
  color: #8b5cf6;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.community-members__heading h2 {
  margin: 0;
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 800;
  letter-spacing: -0.035em;
}

.community-members__heading span {
  display: block;
  margin-top: 10px;
  color: var(--app-text-muted);
  line-height: 1.55;
}

.community-members__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 12px;
}

.community-member {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 15px;
  color: var(--app-text);
  background: color-mix(in srgb, #8b5cf6 5%, var(--app-surface));
  border: 1px solid var(--app-border);
  border-radius: 15px;
  text-decoration: none;
  transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
}

.community-member:hover,
.community-member:focus-visible {
  background: color-mix(in srgb, #8b5cf6 10%, var(--app-surface));
  border-color: color-mix(in srgb, #8b5cf6 42%, var(--app-border));
  outline: none;
  transform: translateY(-2px);
}

.community-member__avatar {
  width: 42px;
  height: 42px;
  flex: none;
  display: grid;
  place-items: center;
  color: white;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  border-radius: 50%;
  font-weight: 800;
}

.community-member__identity {
  min-width: 0;
  flex: 1;
}

.community-member__identity strong,
.community-member__identity small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.community-member__identity strong { font-size: 13px; }
.community-member__identity small { margin-top: 3px; color: var(--app-text-muted); font-size: 11px; }
.community-member__country { flex: none; font-size: 21px; }
.community-members__empty { margin: 0; color: var(--app-text-faint); text-align: center; }

@media (max-width: 760px) {
  .community-page {
    padding: 16px 12px 28px;
  }

  .community-hero {
    margin-top: 8px;
  }

  .community-description {
    font-size: 14px;
  }

  .community-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .community-metric:nth-child(3) {
    border-inline-start: 0;
    border-top: 1px solid var(--app-border);
  }

  .community-metric:nth-child(4) {
    border-top: 1px solid var(--app-border);
  }

  .community-dashboard,
  .community-panel--split {
    grid-template-columns: 1fr;
  }

  .community-panel--split {
    gap: 26px;
  }

  .community-panel--split > article + article {
    padding: 26px 0 0;
    border-top: 1px solid var(--app-border);
    border-inline-start: 0;
  }

  .community-panel {
    padding: 18px;
  }

  .community-ranking__row {
    grid-template-columns: minmax(105px, 1fr) minmax(65px, 0.8fr) auto;
    gap: 8px;
  }
}
</style>
