<template>
  <section id="share-date" class="education-section" aria-labelledby="share-date-title">
    <div class="education-section__heading">
      <p class="education-eyebrow">{{ t('education.tools.share.eyebrow') }}</p>
      <h2 id="share-date-title">{{ t('education.tools.share.title') }}</h2>
      <p>{{ t('education.tools.share.description') }}</p>
    </div>

    <div class="share-tool">
      <q-card flat bordered class="share-tool__controls">
        <q-card-section>
          <AppDateInput
            v-model="selectedDate"
            class="share-tool__date"
            :label="t('education.tools.share.date')"
          />

          <div class="share-tool__actions app-action-group">
            <q-btn
              no-caps
              unelevated
              icon="download"
              class="app-action app-action--primary"
              :label="t('education.tools.share.download')"
              @click="downloadCard"
            />
            <q-btn
              no-caps
              unelevated
              class="app-action app-action--secondary"
              icon="ios_share"
              :label="t('education.tools.share.native')"
              @click="shareNative"
            />
            <q-btn
              no-caps
              unelevated
              class="app-action app-action--tertiary"
              icon="link"
              :label="t('education.tools.share.copy')"
              @click="copyCurrentLink"
            />
          </div>

          <div
            class="share-tool__networks app-action-group"
            :aria-label="t('education.tools.share.networks')"
          >
            <q-btn
              no-caps
              unelevated
              class="app-action app-action--tertiary"
              :icon="fabWhatsapp"
              :label="t('education.tools.share.whatsapp')"
              @click="openWhatsapp"
            />
            <q-btn
              no-caps
              unelevated
              class="app-action app-action--tertiary"
              :icon="fabFacebook"
              :label="t('education.tools.share.facebook')"
              @click="openFacebook"
            />
            <q-btn
              no-caps
              unelevated
              class="app-action app-action--tertiary"
              :icon="fabXTwitter"
              :label="t('education.tools.share.x')"
              @click="openX"
            />
            <q-btn
              no-caps
              unelevated
              class="app-action app-action--tertiary"
              :icon="fabTelegram"
              :label="t('education.tools.share.telegram')"
              @click="openTelegram"
            />
          </div>

          <p v-if="statusMessage" class="share-tool__status" role="status">
            {{ statusMessage }}
          </p>
        </q-card-section>
      </q-card>

      <article class="date-share-card" aria-live="polite">
        <div class="date-share-card__brand" aria-hidden="true">13</div>
        <p>{{ t('education.tools.share.cardTitle') }}</p>
        <div>
          <span>{{ t('education.hero.gregorian') }}</span>
          <AppComparisonDateTitle :title="gregorianTitle" />
          <small>{{ comparisonYear }}</small>
        </div>
        <div>
          <span>{{ t('education.hero.fixed') }}</span>
          <AppComparisonDateTitle :title="fixedTitle" />
          <small>{{ comparisonYear }}</small>
          <small>{{ fixedCaption }}</small>
        </div>
        <footer>13 Calendar · {{ t('education.tools.share.cardFooter') }}</footer>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { fabFacebook, fabTelegram, fabWhatsapp, fabXTwitter } from '@quasar/extras/fontawesome-v6';
import AppComparisonDateTitle from 'src/components/AppComparisonDateTitle.vue';
import AppDateInput from 'src/components/AppDateInput.vue';
import { useCalendarTranslations } from 'src/composables/useCalendarTranslations';
import {
  canvasToBlob,
  buildDateComparisonPresentation,
  copyText,
  createAbsoluteRouteUrl,
  downloadBlob,
  isoToGregorianParts,
  localDateToIso,
  splitComparisonTitle,
} from 'src/utils/calendarTools';

const { t, locale } = useI18n({ useScope: 'global' });
const { months13Long, weekDaysComparison } = useCalendarTranslations();
const route = useRoute();
const router = useRouter();

const initialDate = isoToGregorianParts(route.query.date) ? route.query.date : localDateToIso();
const selectedDate = ref(String(initialDate));
const statusMessage = ref('');

const gregorianParts = computed(() => isoToGregorianParts(selectedDate.value));
const labels = computed(() => ({
  months: months13Long.value,
  weekdays: weekDaysComparison.value,
  yearDay: t('calendar.specialDays.yearDay'),
  leapDay: t('calendar.specialDays.leapDay'),
  specialDays: t('calendar.specialDays.title'),
  position: (month, week) => t('education.converter.position', { month, week }),
}));
const comparison = computed(() =>
  gregorianParts.value
    ? buildDateComparisonPresentation(gregorianParts.value, locale.value, labels.value)
    : null,
);
const gregorianTitle = computed(
  () => comparison.value?.gregorianTitle || t('education.converter.invalid'),
);
const fixedTitle = computed(() => comparison.value?.fixedTitle || t('education.converter.invalid'));
const fixedCaption = computed(() => comparison.value?.fixedCaption || '');
const comparisonYear = computed(() => comparison.value?.year || '');
const currentUrl = computed(() => createAbsoluteRouteUrl('/tools', { date: selectedDate.value }));
const sharingText = computed(
  () =>
    `${gregorianTitle.value} · ${comparisonYear.value} ↔ ${fixedTitle.value} · ${comparisonYear.value} — 13 Calendar`,
);

watch(selectedDate, (date) => {
  statusMessage.value = '';
  if (!isoToGregorianParts(date)) return;

  router.replace({
    query: { ...route.query, date },
    hash: route.hash,
  });
});

function drawCenteredText(context, text, y, maxWidth, initialSize, weight = 700) {
  let size = initialSize;
  do {
    context.font = `${weight} ${size}px Inter, Arial, sans-serif`;
    size -= 2;
  } while (context.measureText(text).width > maxWidth && size > 28);
  context.fillText(text, 600, y, maxWidth);
}

function drawComparisonTitle(context, title, weekdayY, dateY, maxWidth, initialSize, weight) {
  const parts = splitComparisonTitle(title);
  if (!parts) {
    drawCenteredText(context, title, dateY, maxWidth, initialSize, weight);
    return;
  }

  drawCenteredText(context, `${parts.weekday} ·`, weekdayY, maxWidth, initialSize * 0.72, weight);
  drawCenteredText(context, parts.date, dateY, maxWidth, initialSize, weight);
}

function createCardCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const context = canvas.getContext('2d');

  const gradient = context.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#111827');
  gradient.addColorStop(0.58, '#312e81');
  gradient.addColorStop(1, '#6d28d9');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1200, 630);

  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.direction = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';

  context.fillStyle = '#ffffff';
  context.beginPath();
  context.roundRect(535, 44, 130, 86, 24);
  context.fill();
  context.fillStyle = '#5b21b6';
  context.font = '800 42px Inter, Arial, sans-serif';
  context.fillText('13', 600, 88);

  context.fillStyle = '#c4b5fd';
  context.font = '700 24px Inter, Arial, sans-serif';
  context.fillText(t('education.tools.share.cardTitle').toUpperCase(), 600, 172, 1000);

  context.fillStyle = '#ffffff';
  drawComparisonTitle(context, gregorianTitle.value, 216, 258, 1030, 52, 750);
  context.fillStyle = '#cbd5e1';
  context.font = '500 24px Inter, Arial, sans-serif';
  context.fillText(String(comparisonYear.value), 600, 296, 1000);

  context.strokeStyle = 'rgba(255,255,255,.22)';
  context.beginPath();
  context.moveTo(180, 326);
  context.lineTo(1020, 326);
  context.stroke();

  context.fillStyle = '#ddd6fe';
  drawComparisonTitle(context, fixedTitle.value, 364, 410, 1030, 58, 800);
  context.fillStyle = '#cbd5e1';
  context.font = '500 24px Inter, Arial, sans-serif';
  context.fillText(String(comparisonYear.value), 600, 448, 1000);
  context.font = '500 20px Inter, Arial, sans-serif';
  context.fillText(fixedCaption.value, 600, 482, 1000);

  context.fillStyle = 'rgba(255,255,255,.72)';
  context.font = '500 22px Inter, Arial, sans-serif';
  context.fillText(`13 Calendar · ${t('education.tools.share.cardFooter')}`, 600, 570, 1040);

  return canvas;
}

async function downloadCard() {
  if (!gregorianParts.value) return;
  const blob = await canvasToBlob(createCardCanvas());
  downloadBlob(blob, `13-calendar-${selectedDate.value}.png`);
  statusMessage.value = t('education.tools.share.downloaded');
}

async function copyCurrentLink() {
  await copyText(currentUrl.value);
  statusMessage.value = t('education.tools.share.copied');
}

async function shareNative() {
  if (!navigator.share) {
    await copyCurrentLink();
    statusMessage.value = t('education.tools.share.unavailable');
    return;
  }

  try {
    await navigator.share({
      title: t('education.tools.share.cardTitle'),
      text: sharingText.value,
      url: currentUrl.value,
    });
    statusMessage.value = t('education.tools.share.shared');
  } catch (error) {
    if (error?.name !== 'AbortError') {
      await copyCurrentLink();
      statusMessage.value = t('education.tools.share.unavailable');
    }
  }
}

function openSharingUrl(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

function openWhatsapp() {
  openSharingUrl(
    `https://wa.me/?text=${encodeURIComponent(`${sharingText.value}\n${currentUrl.value}`)}`,
  );
}

function openFacebook() {
  openSharingUrl(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl.value)}`,
  );
}

function openX() {
  openSharingUrl(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(sharingText.value)}&url=${encodeURIComponent(currentUrl.value)}`,
  );
}

function openTelegram() {
  openSharingUrl(
    `https://t.me/share/url?url=${encodeURIComponent(currentUrl.value)}&text=${encodeURIComponent(sharingText.value)}`,
  );
}
</script>

<style scoped>
.share-tool {
  display: grid;
  grid-template-columns: 400px minmax(0, 1fr);
  align-items: stretch;
  gap: 24px;
  max-width: 1120px;
  margin: 0 auto;
}

.share-tool__controls,
.date-share-card {
  border-color: var(--app-border);
  border-radius: 24px;
  box-shadow: var(--app-card-shadow);
}

.share-tool__controls {
  width: min(100%, 400px);
  justify-self: center;
}

.share-tool__controls .q-card__section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  padding: 28px;
}

.share-tool__date {
  width: 100%;
  justify-self: center;
}

.share-tool__actions,
.share-tool__networks {
  --app-action-group-max: 100%;
}

.share-tool__actions {
  /* O card é dimensionado pela grade social 2 × 2; as três ações principais
     e o seletor então ocupam toda a largura interna disponível. */
  --app-action-min-width: 100%;
}

.share-tool__networks {
  /* A grade explícita evita que poucos pixels acrescentados pela medição das
     traduções desmontem o arranjo 2 × 2. A margem automática consome o espaço
     livre do card e mantém as redes junto à base quando a prévia é mais alta. */
  width: 100%;
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: auto;
  padding-top: 12px;
}

.share-tool__networks > .app-action {
  width: 100%;
  min-width: 0;
  max-width: none;
  flex: none;
}

.share-tool__status {
  min-height: 20px;
  margin: 0;
  color: #059669;
  font-size: 13px;
  text-align: center;
}

.date-share-card {
  min-height: 410px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 38px;
  color: white;
  background: linear-gradient(135deg, #111827, #312e81 58%, #6d28d9);
  text-align: center;
}

.date-share-card__brand {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  color: #5b21b6;
  background: white;
  border-radius: 18px;
  font-size: 22px;
  font-weight: 850;
}

.date-share-card > p {
  margin: 0;
  color: #c4b5fd;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.date-share-card > div:not(.date-share-card__brand) {
  display: grid;
  gap: 5px;
}

.date-share-card > div:not(.date-share-card__brand) > span,
.date-share-card small,
.date-share-card footer {
  color: rgb(255 255 255 / 68%);
  font-size: 12px;
}

.date-share-card strong {
  font-size: clamp(22px, 4vw, 34px);
  line-height: 1.2;
}

.date-share-card footer {
  margin-top: 16px;
}

@media (max-width: 820px) {
  .share-tool {
    grid-template-columns: 1fr;
  }

  .date-share-card {
    width: 100%;
  }
}

@media (max-width: 460px) {
  .share-tool__controls .q-card__section {
    padding: 22px 19px;
  }

  .date-share-card {
    padding: 22px;
  }
}

@media (max-width: 340px) {
  /* Somente a menor faixa móvel abandona a grade 2 × 2. Os botões continuam
     compactos e centralizados, sem herdar a largura das ações principais. */
  .share-tool__networks {
    grid-template-columns: 1fr;
  }

  .share-tool__networks > .app-action {
    width: min(100%, max(var(--app-action-min-width), var(--app-action-content-width)));
    justify-self: center;
  }
}
</style>
