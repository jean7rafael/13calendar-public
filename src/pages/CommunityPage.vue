<template>
  <q-page class="community-page">
    <!-- Identidade da comunidade inspirada no painel de perfil. -->
    <AppPageHero
      icon="public"
      :eyebrow="t('community.eyebrow')"
      :title="t('community.title')"
      :description="t('community.description')"
    >
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
    </AppPageHero>

    <!-- Aviso honesto enquanto a coleta ainda não está conectada. -->
    <AppNoticePanel
      v-if="!isReady"
      class="community-status"
      :tone="loadFailed ? 'amber' : 'purple'"
      :icon="loadFailed ? 'cloud_off' : 'query_stats'"
      :title="t(loadFailed ? 'community.unavailableTitle' : 'community.waitingTitle')"
      role="status"
    >
      <p>
        {{ t(loadFailed ? 'community.unavailableDescription' : 'community.waitingDescription') }}
      </p>
    </AppNoticePanel>

    <!-- Faixa compacta com os números principais. -->
    <section class="community-metrics" :aria-label="t('community.title')">
      <article v-for="metric in summaryMetrics" :key="metric.label" class="community-metric">
        <strong>{{ metric.value }}</strong>
        <span>{{ metric.label }}</span>
      </article>
    </section>

    <div class="community-dashboard">
      <!-- Gráfico diário com escala adaptada ao trecho visível. -->
      <section class="community-panel community-panel--activity">
        <header class="community-panel__header">
          <div>
            <h2>{{ t('community.activityTitle') }}</h2>
            <p>{{ t('community.activityDescription') }}</p>
          </div>
          <span v-if="updatedAtLabel" class="community-updated">{{ updatedAtLabel }}</span>
        </header>

        <div
          ref="activityBarViewport"
          class="community-activity-chart-shell"
          dir="ltr"
          @scroll.passive="updateActivityBarViewport"
        >
          <div
            class="community-activity-chart"
            role="img"
            :aria-label="t('community.activityTitle')"
          >
            <span
              v-for="cell in activityCells"
              :key="cell.date"
              class="community-activity-bar"
              :title="`${formatDate(cell.date)} · ${formatVisits(cell.visits)}`"
            >
              <span class="community-activity-bar__plot">
                <i
                  class="community-activity-bar__fill"
                  :class="`community-activity-bar__fill--level-${cell.level}`"
                  :style="activityBarStyle(cell)"
                ></i>
              </span>
              <time :datetime="cell.date" class="community-activity-bar__day">
                {{ formatActivityDay(cell.date) }}
              </time>
              <small class="community-activity-bar__month">
                {{ formatActivityMonthStart(cell.date) }}
              </small>
            </span>
          </div>
        </div>

        <div class="community-activity-legend">
          <span>{{ t('community.less') }}</span>
          <i
            v-for="level in 5"
            :key="level"
            :class="`community-activity-bar__fill--level-${level - 1}`"
          ></i>
          <span>{{ t('community.more') }}</span>
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
          <article
            v-for="(country, index) in topCountries"
            :key="country.code"
            class="community-ranking__row"
          >
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
          <li v-for="page in topPages" :key="page.label">
            <span>{{ page.label }}</span>
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
    <AppNoticePanel
      class="community-privacy"
      tone="green"
      icon="shield"
      :title="t('community.privacyTitle')"
    >
      <p>{{ t('community.privacyDescription') }}</p>
      <p>{{ t('community.approximateNote') }}</p>
      <small>{{ t('community.dataSource') }}</small>

      <!-- Acesso discreto: a rota continua protegida pelo segredo administrativo. -->
      <template #action>
        <q-btn
          class="community-corner-action"
          flat
          round
          dense
          icon="admin_panel_settings"
          :to="{ name: 'community-admin' }"
          :aria-label="t('community.adminAccess')"
        >
          <q-tooltip>{{ t('community.adminAccess') }}</q-tooltip>
        </q-btn>
      </template>
    </AppNoticePanel>

    <!-- O convite vem antes da vitrine para não ficar oculto após os dados públicos. -->
    <CommunityRegistration />

    <!-- Perfis voluntários aparecem somente após moderação. -->
    <section class="community-members" :aria-labelledby="membersTitleId">
      <!-- Entrada discreta para a retirada do próprio perfil. -->
      <q-btn
        class="community-corner-action community-members__remove"
        flat
        round
        dense
        icon="person_remove"
        :to="{ name: 'community-remove' }"
        :aria-label="t('community.membersRemoveButton')"
      >
        <q-tooltip>{{ t('community.membersRemoveButton') }}</q-tooltip>
      </q-btn>

      <header class="community-members__heading">
        <p>{{ t('community.membersEyebrow') }}</p>
        <h2 :id="membersTitleId">{{ t('community.membersTitle') }}</h2>
        <span>{{ t('community.membersDescription') }}</span>
      </header>

      <div v-if="approvedMembers.length" class="community-members__grid">
        <article
          v-for="member in approvedMembers"
          :key="`${member.socialNetwork}:${member.socialProfile}`"
          class="community-member"
        >
          <a
            class="community-member__profile"
            :href="getMemberProfileUrl(member)"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t('community.memberProfile', { name: member.publicName })"
          >
            <AppProfileAvatar :image-url="member.avatarUrl" :name="member.publicName" />
            <span class="community-member__identity">
              <strong>{{ member.publicName }}</strong>
              <small>{{ getMemberProfileLabel(member) }}</small>
            </span>
            <span class="community-member__country" :title="getCountryName(member.country)">
              {{ getCountryFlag(member.country) }}
            </span>
          </a>

          <span v-if="member.hasVoted" class="community-member__feedback">
            <q-icon name="how_to_vote" class="community-member__vote-icon">
              <q-tooltip>{{ t('community.memberVoted', { name: member.publicName }) }}</q-tooltip>
            </q-icon>
            <q-btn
              v-if="member.feedbackResponse"
              flat
              round
              dense
              icon="forum"
              class="community-member__response-button"
              :aria-label="t('community.memberResponse', { name: member.publicName })"
              @click="openMemberResponse(member)"
            >
              <q-tooltip>{{
                t('community.memberResponse', { name: member.publicName })
              }}</q-tooltip>
            </q-btn>
          </span>
        </article>
      </div>
      <p v-else class="community-members__empty">{{ t('community.membersEmpty') }}</p>
    </section>

    <section
      v-if="anonymousResponses.length"
      class="community-anonymous"
      :aria-labelledby="anonymousResponsesTitleId"
    >
      <header class="community-members__heading">
        <p>{{ t('community.anonymousEyebrow') }}</p>
        <h2 :id="anonymousResponsesTitleId">{{ t('community.anonymousTitle') }}</h2>
        <span>{{ t('community.anonymousDescription') }}</span>
      </header>

      <div class="community-anonymous__list">
        <button
          v-for="response in anonymousResponses"
          :key="response.id"
          type="button"
          @click="openAnonymousResponse(response)"
        >
          <q-icon name="chat_bubble_outline" aria-hidden="true" />
          <span>{{ response.title || t('community.anonymousFallbackTitle') }}</span>
          <q-icon name="arrow_forward" aria-hidden="true" />
        </button>
      </div>
    </section>

    <q-dialog v-model="responseDialogOpen">
      <q-card class="community-response-dialog">
        <q-card-section class="community-response-dialog__header">
          <div>
            <small>{{ activeResponse.eyebrow }}</small>
            <h2>{{ activeResponse.title }}</h2>
          </div>
          <q-btn
            v-close-popup
            flat
            round
            dense
            icon="close"
            :aria-label="t('community.closeResponse')"
          />
        </q-card-section>
        <q-separator />
        <q-card-section class="community-response-dialog__body">
          <p>{{ activeResponse.response }}</p>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Rodapé institucional compartilhado, sem repetir o bloco explicativo. -->
  </q-page>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';
import CommunityRegistration from 'src/components/CommunityRegistration.vue';
import AppProfileAvatar from 'src/components/AppProfileAvatar.vue';
import AppNoticePanel from 'src/components/AppNoticePanel.vue';
import AppPageHero from 'src/components/AppPageHero.vue';
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
const anonymousResponses = ref([]);
const responseDialogOpen = ref(false);
const activeResponse = ref({ eyebrow: '', title: '', response: '' });
const loadFailed = ref(false);
const selectedScope = ref('world');
const activityBarViewport = ref(null);
const visibleActivityRange = ref({ start: 0, end: 1 });
const membersTitleId = 'community-members-title';
const anonymousResponsesTitleId = 'community-anonymous-responses-title';
let activityResizeObserver = null;
let activityScrollFrame = 0;

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
  await nextTick();
  setupActivityBarChart();
});

onBeforeUnmount(() => {
  activityResizeObserver?.disconnect();

  if (activityScrollFrame) {
    window.cancelAnimationFrame(activityScrollFrame);
  }
});

async function loadCommunityAnalytics() {
  try {
    const liveEndpoint = getCommunityApiUrl('analytics/stats');
    const response = await fetch(
      liveEndpoint || `${import.meta.env.BASE_URL}data/community-stats.json`,
      {
        cache: 'no-store',
      },
    );

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
    const members = Array.isArray(payload?.members) ? payload.members : [];
    anonymousResponses.value = Array.isArray(payload?.anonymousResponses)
      ? payload.anonymousResponses
      : [];

    /* A vitrine preserva a ordem de chegada mesmo se uma versão antiga da
       API devolver os perfis em outra sequência. Registros sem data mantêm
       a ordem recebida até o Worker atualizado assumir essa garantia. */
    approvedMembers.value = members
      .map((member, originalIndex) => ({ member, originalIndex }))
      .sort((left, right) => {
        const leftOrder = Number(left.member.sortOrder);
        const rightOrder = Number(right.member.sortOrder);

        if (!Number.isFinite(leftOrder) || !Number.isFinite(rightOrder)) {
          return left.originalIndex - right.originalIndex;
        }

        return leftOrder - rightOrder || left.originalIndex - right.originalIndex;
      })
      .map(({ member }) => member);
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
      value: selectedScope.value === 'world' ? periodLabel.value : formatMetricValue(countryValue),
      label:
        selectedScope.value === 'world' ? t('community.period') : t('community.selectedCountry'),
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
   GRÁFICO DE BARRAS DOS ÚLTIMOS SEIS MESES

   A cor compara cada dia com o período inteiro. A altura usa
   somente o maior valor atualmente visível, preservando a
   leitura de períodos com movimentos muito diferentes.
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

const visibleActivityMaximum = computed(() => {
  const { start, end } = visibleActivityRange.value;

  return Math.max(
    1,
    ...activityCells.value.slice(start, end).map(({ visits }) => Number(visits) || 0),
  );
});

function setupActivityBarChart() {
  const viewport = activityBarViewport.value;

  if (!viewport) return;

  activityResizeObserver = new ResizeObserver(updateActivityBarViewport);
  activityResizeObserver.observe(viewport);

  window.requestAnimationFrame(() => {
    viewport.scrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    updateActivityBarViewport();
  });
}

function updateActivityBarViewport() {
  if (activityScrollFrame) return;

  activityScrollFrame = window.requestAnimationFrame(() => {
    activityScrollFrame = 0;
    const viewport = activityBarViewport.value;

    if (!viewport) return;

    const bars = Array.from(viewport.querySelectorAll('.community-activity-bar'));
    const viewportRect = viewport.getBoundingClientRect();
    let start = bars.findIndex((bar) => bar.getBoundingClientRect().right > viewportRect.left);

    if (start < 0) start = Math.max(0, bars.length - 1);

    let end = start;

    while (end < bars.length && bars[end].getBoundingClientRect().left < viewportRect.right) {
      end += 1;
    }

    visibleActivityRange.value = { start, end: Math.max(start + 1, end) };
  });
}

function activityBarStyle(cell) {
  if (!cell.visits) {
    return { '--activity-bar-height': '3px' };
  }

  const percentage = Math.min(100, Math.max(8, (cell.visits / visibleActivityMaximum.value) * 100));
  return { '--activity-bar-height': `${percentage}%` };
}

function formatActivityDay(value) {
  const date = parseDay(value);
  return date ? new Intl.DateTimeFormat(locale.value, { day: '2-digit' }).format(date) : '';
}

function formatActivityMonthStart(value) {
  const date = parseDay(value);

  if (!date || date.getUTCDate() !== 1) return '';

  return new Intl.DateTimeFormat(locale.value, { month: 'short' }).format(date);
}

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

const topPages = computed(() => {
  const totalsByPage = new Map();

  for (const page of communityData.value.pages || []) {
    const label = getPageLabel(page.path);
    totalsByPage.set(label, (totalsByPage.get(label) || 0) + (Number(page.views) || 0));
  }

  return Array.from(totalsByPage, ([label, views]) => ({ label, views }))
    .sort((left, right) => right.views - left.views)
    .slice(0, 6);
});
const topReferrers = computed(() => (communityData.value.referrers || []).slice(0, 5));
const topDevices = computed(() => (communityData.value.devices || []).slice(0, 5));

/* ===========================================================
   FORMATAÇÃO LOCALIZADA
=========================================================== */

function formatNumber(value) {
  return new Intl.NumberFormat(locale.value, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);
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
    ? new Intl.DateTimeFormat(locale.value, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date)
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
  const normalizedPath = String(path || '')
    .trim()
    .toLowerCase();

  if (normalizedPath.includes('reference-site')) return t('community.pageHome');
  if (normalizedPath.includes('community-admin')) return t('community.pageModeration');
  if (normalizedPath.includes('community')) return t('community.pageCommunity');
  if (normalizedPath.includes('privacy')) return t('community.pagePrivacy');
  if (
    !normalizedPath ||
    normalizedPath === '/' ||
    normalizedPath === '/#/' ||
    normalizedPath === '13 calendar' ||
    normalizedPath.includes('13calendar-public')
  ) {
    return t('community.pageCalendars');
  }

  return t('community.pageOther');
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

function openMemberResponse(member) {
  activeResponse.value = {
    eyebrow: member.publicName,
    title:
      member.feedbackTitle || t('community.memberResponseTitle', { name: member.publicName }),
    response: member.feedbackResponse,
  };
  responseDialogOpen.value = true;
}

function openAnonymousResponse(response) {
  activeResponse.value = {
    eyebrow: t('community.anonymousEyebrow'),
    title: response.title || t('community.anonymousFallbackTitle'),
    response: response.response,
  };
  responseDialogOpen.value = true;
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

.community-scope-select {
  width: min(100%, 290px);
  margin: 24px auto 0;
}

/* ===========================================================
   AVISO E MÉTRICAS PRINCIPAIS
=========================================================== */

.community-status {
  margin-bottom: 18px;
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

.community-activity-chart-shell {
  max-width: 100%;
  overflow-x: auto;
  padding: 4px 1px 8px;
  overscroll-behavior-inline: contain;
  scrollbar-color: color-mix(in srgb, #8b5cf6 48%, transparent) transparent;
  scrollbar-width: thin;
}

.community-activity-chart-shell::-webkit-scrollbar {
  height: 5px;
}

.community-activity-chart-shell::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, #8b5cf6 48%, transparent);
  border-radius: 999px;
}

.community-activity-chart {
  --activity-chart-height: clamp(140px, 22vw, 220px);
  min-width: max-content;
  display: flex;
  align-items: stretch;
  gap: 6px;
  padding: 0 2px;
}

.community-activity-bar {
  width: 24px;
  flex: 0 0 24px;
  display: grid;
  grid-template-rows: var(--activity-chart-height) 15px 12px;
  align-items: end;
  text-align: center;
}

.community-activity-bar__plot {
  width: 100%;
  height: var(--activity-chart-height);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border-bottom: 1px solid color-mix(in srgb, var(--app-border) 72%, transparent);
}

.community-activity-bar__fill {
  width: 13px;
  height: var(--activity-bar-height);
  display: block;
  background: color-mix(in srgb, var(--app-text) 7%, transparent);
  border: 1px solid color-mix(in srgb, var(--app-border) 66%, transparent);
  border-radius: 5px 5px 2px 2px;
  transition:
    height 180ms ease,
    background 180ms ease;
}

.community-activity-bar__fill--level-1 {
  background: #c7d2fe !important;
}
.community-activity-bar__fill--level-2 {
  background: #818cf8 !important;
}
.community-activity-bar__fill--level-3 {
  background: #6366f1 !important;
}
.community-activity-bar__fill--level-4 {
  background: #7c3aed !important;
}

.community-activity-bar__day,
.community-activity-bar__month {
  overflow: hidden;
  color: var(--app-text-faint);
  font-size: 9px;
  line-height: 1;
  text-overflow: clip;
  white-space: nowrap;
}

.community-activity-bar__month {
  color: color-mix(in srgb, #8b5cf6 78%, var(--app-text-muted));
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
}

.community-activity-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 8px;
  color: var(--app-text-faint);
  font-size: 10px;
}

.community-activity-legend i {
  width: 11px;
  height: 11px;
  display: block;
  background: color-mix(in srgb, var(--app-text) 7%, transparent);
  border: 1px solid color-mix(in srgb, var(--app-border) 66%, transparent);
  border-radius: 3px;
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
  margin-top: 18px;
}

.community-corner-action {
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  color: var(--app-text-faint);
  opacity: 0.46;
  transition:
    color 160ms ease,
    opacity 160ms ease,
    background 160ms ease;
}

.community-corner-action:hover,
.community-corner-action:focus-visible {
  color: var(--app-accent-purple);
  background: color-mix(in srgb, var(--app-accent-purple) 10%, transparent);
  opacity: 1;
}

/* ===========================================================
   PERFIS PÚBLICOS APROVADOS
=========================================================== */

.community-members {
  position: relative;
  margin-top: 28px;
  padding: clamp(24px, 5vw, 42px);
  background: color-mix(in srgb, var(--app-surface) 92%, transparent);
  border: 1px solid var(--app-border);
  border-radius: 20px;
  box-shadow: var(--app-card-shadow);
}

.community-members__remove {
  position: absolute;
  top: 16px;
  right: 16px;
}

[dir='rtl'] .community-members__remove {
  right: auto;
  left: 18px;
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
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  padding: 7px 9px 7px 7px;
  color: var(--app-text);
  background: color-mix(in srgb, #8b5cf6 5%, var(--app-surface));
  border: 1px solid var(--app-border);
  border-radius: 15px;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;
}

.community-member__profile {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 8px;
  color: inherit;
  border-radius: 11px;
  text-decoration: none;
}

.community-member:hover,
.community-member:focus-visible {
  background: color-mix(in srgb, #8b5cf6 10%, var(--app-surface));
  border-color: color-mix(in srgb, #8b5cf6 42%, var(--app-border));
  outline: none;
  transform: translateY(-2px);
}

.community-member__profile:focus-visible,
.community-member__response-button:focus-visible {
  outline: 2px solid var(--app-accent-purple-border);
  outline-offset: 2px;
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

.community-member__identity strong {
  font-size: 13px;
}
.community-member__identity small {
  margin-top: 3px;
  color: var(--app-text-muted);
  font-size: 11px;
}
.community-member__country {
  flex: none;
  font-size: 21px;
}

.community-member__feedback {
  display: flex;
  align-items: center;
  gap: 2px;
}

.community-member__vote-icon {
  padding: 8px;
  color: var(--app-accent-green-strong);
  font-size: 20px;
}

.community-member__response-button {
  color: var(--app-accent-purple-text);
}

.community-anonymous {
  margin-top: 18px;
  padding: clamp(24px, 5vw, 42px);
  background: color-mix(in srgb, var(--app-accent-purple-soft) 38%, var(--app-surface));
  border: 1px solid var(--app-accent-purple-border);
  border-radius: 20px;
  box-shadow: var(--app-card-shadow);
}

.community-anonymous__list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.community-anonymous__list button {
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 15px;
  color: var(--app-text);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 14px;
  text-align: start;
  cursor: pointer;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    transform 160ms ease;
}

.community-anonymous__list button:hover,
.community-anonymous__list button:focus-visible {
  background: var(--app-accent-purple-soft);
  border-color: var(--app-accent-purple-border);
  outline: none;
  transform: translateY(-2px);
}

.community-anonymous__list button > .q-icon:first-child {
  color: var(--app-accent-purple-text);
}

.community-anonymous__list button span {
  overflow: hidden;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.community-response-dialog {
  width: min(620px, calc(100vw - 28px));
  max-height: min(80vh, 720px);
  border-radius: 22px;
}

.community-response-dialog__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 24px;
}

.community-response-dialog__header small {
  display: block;
  margin-bottom: 5px;
  color: var(--app-accent-purple-text);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.community-response-dialog__header h2 {
  margin: 0;
  color: var(--app-text);
  font-size: clamp(20px, 4vw, 28px);
}

.community-response-dialog__body {
  overflow-y: auto;
  padding: 24px;
}

.community-response-dialog__body p {
  margin: 0;
  color: var(--app-text-muted);
  font-size: 15px;
  line-height: 1.75;
  white-space: pre-wrap;
}
.community-members__empty {
  margin: 0;
  color: var(--app-text-faint);
  text-align: center;
}

@media (max-width: 760px) {
  .community-page {
    padding: 16px 12px 28px;
  }

  .community-anonymous__list {
    grid-template-columns: 1fr;
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

  .community-panel--activity .community-panel__header {
    flex-direction: column;
    gap: 8px;
  }

  .community-activity-chart {
    --activity-chart-height: clamp(140px, 38vw, 180px);
  }

  .community-ranking__row {
    grid-template-columns: minmax(105px, 1fr) minmax(65px, 0.8fr) auto;
    gap: 8px;
  }
}
</style>
