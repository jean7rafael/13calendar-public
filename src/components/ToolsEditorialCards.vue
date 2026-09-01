<template>
  <section id="fact-cards" class="education-section" aria-labelledby="fact-cards-title">
    <div class="education-section__heading">
      <p class="education-eyebrow">{{ t('education.tools.editorial.eyebrow') }}</p>
      <h2 id="fact-cards-title">{{ t('education.tools.editorial.title') }}</h2>
      <p>{{ t('education.tools.editorial.description') }}</p>
    </div>

    <div
      class="editorial-carousel app-no-double-tap"
      role="region"
      :aria-label="t('education.tools.editorial.title')"
      tabindex="0"
      @dblclick.prevent
      @keydown.left.prevent="showPrevious"
      @keydown.right.prevent="showNext"
    >
      <q-btn
        round
        flat
        icon="chevron_left"
        class="editorial-carousel__navigation"
        :aria-label="t('education.tools.editorial.previousCard')"
        @click="showPrevious"
      />

      <div
        ref="carouselViewport"
        class="editorial-carousel__viewport"
        :class="{ 'editorial-carousel__viewport--dragging': dragging }"
        :style="viewportStyle"
        @click.capture="suppressClickAfterDrag"
        @dragstart.prevent
        @pointerdown="beginPointerNavigation"
        @pointermove="movePointerNavigation"
        @pointerup="endPointerNavigation"
        @pointercancel="cancelPointerNavigation"
      >
        <div
          ref="carouselTrack"
          class="editorial-cards"
          :class="{
            'editorial-cards--without-motion': !motionEnabled,
            'editorial-cards--rapid': rapidMovement,
            'editorial-cards--dragging': dragging,
          }"
          :style="trackStyle"
          @transitionend="finishMovement"
        >
          <article
            v-for="(fact, index) in carouselFacts"
            :key="fact.renderKey"
            :aria-hidden="!isCardVisible(index)"
            :class="`editorial-card--${fact.variant}`"
            :style="{
              '--editorial-accent': fact.accent,
              '--editorial-soft': fact.soft,
              '--editorial-dark': fact.dark,
            }"
          >
            <div class="editorial-card__icon" aria-hidden="true">
              <q-icon :name="fact.icon" />
            </div>
            <span>{{ fact.eyebrow }}</span>
            <h3>{{ fact.title }}</h3>
            <p>{{ fact.text }}</p>
            <q-btn
              v-if="fact.variant === 'color'"
              no-caps
              unelevated
              class="app-action app-action--primary"
              icon="download"
              :label="t('education.tools.editorial.download')"
              :tabindex="isCardVisible(index) ? undefined : -1"
              @click="downloadFact(fact)"
            />
            <q-btn
              v-else-if="fact.variant === 'light'"
              no-caps
              unelevated
              class="app-action app-action--tertiary"
              icon="download"
              :label="t('education.tools.editorial.download')"
              :tabindex="isCardVisible(index) ? undefined : -1"
              @click="downloadFact(fact)"
            />
            <q-btn
              v-else
              no-caps
              unelevated
              class="app-action app-action--secondary"
              icon="download"
              :label="t('education.tools.editorial.download')"
              :tabindex="isCardVisible(index) ? undefined : -1"
              @click="downloadFact(fact)"
            />
          </article>
        </div>
      </div>

      <q-btn
        round
        flat
        icon="chevron_right"
        class="editorial-carousel__navigation"
        :aria-label="t('education.tools.editorial.nextCard')"
        @click="showNext"
      />
    </div>

    <p v-if="statusMessage" class="editorial-cards__status" role="status">
      {{ statusMessage }}
    </p>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { canvasToBlob, downloadBlob } from 'src/utils/calendarTools';

const { t, tm } = useI18n({ useScope: 'global' });
const statusMessage = ref('');
const carouselViewport = ref(null);
const carouselTrack = ref(null);
const cardWidth = ref(300);
const visibleCount = ref(3);
const peekWidth = ref(32);
const factCount = 12;
const loopCopies = 7;
const middleCopy = Math.floor(loopCopies / 2);
const physicalIndex = ref(factCount * middleCopy);
const motionEnabled = ref(true);
const moving = ref(false);
const rapidMovement = ref(false);
const dragOffset = ref(0);
const dragging = ref(false);
const cardGap = 14;
let resizeObserver;
let movementFallback;
let lastMovementAt = 0;
let activePointerId = null;
let pointerStartX = 0;
let pointerStartY = 0;
let pointerStartTime = 0;
let pointerAxis = null;
let suppressClickUntil = 0;

const facts = computed(() => {
  const ideaFacts = tm('education.idea.facts') || [];
  const purple = { accent: '#7c3aed', soft: '#ddd6fe', dark: '#160f24' };
  const green = { accent: '#059669', soft: '#a7f3d0', dark: '#091c19' };
  const amber = { accent: '#d97706', soft: '#fde68a', dark: '#21170d' };
  const pink = { accent: '#db2777', soft: '#fbcfe8', dark: '#21101a' };

  return [
    {
      key: 'solaris',
      icon: 'wb_sunny',
      symbol: '☀️',
      eyebrow: t('education.idea.eyebrow'),
      title: ideaFacts[1]?.title || t('education.idea.monthTitle'),
      text: ideaFacts[1]?.text || t('education.idea.monthDescription'),
      variant: 'color',
      ...amber,
    },
    {
      key: 'kodak',
      icon: 'photo_camera',
      symbol: '📷',
      eyebrow: t('education.tools.editorial.kodakEyebrow'),
      title: t('education.tools.editorial.kodakTitle'),
      text: t('education.tools.editorial.kodakText'),
      variant: 'color',
      ...pink,
    },
    {
      key: 'sabbath',
      icon: 'loop',
      symbol: '🔄',
      eyebrow: t('education.sabbath.civilTitle'),
      title: t('education.sabbath.title'),
      text: t('education.sabbath.conclusion'),
      variant: 'color',
      ...purple,
    },
    {
      key: 'equal-months',
      icon: 'calendar_view_month',
      symbol: '📅',
      eyebrow: t('education.idea.eyebrow'),
      title: ideaFacts[0]?.title || t('education.idea.title'),
      text: ideaFacts[0]?.text || t('education.idea.description'),
      variant: 'color',
      ...green,
    },
    {
      key: 'solar-year',
      icon: 'light_mode',
      symbol: '🌞',
      eyebrow: t('education.tools.astronomy.eyebrow'),
      title: t('education.tools.astronomy.title'),
      text: t('education.tools.astronomy.description'),
      variant: 'light',
      ...amber,
    },
    {
      key: 'moon-instant',
      icon: 'schedule',
      symbol: '🕒',
      eyebrow: t('education.moon.eyebrow'),
      title: t('education.moon.exactTitle'),
      text: t('education.moon.exactText'),
      variant: 'light',
      ...pink,
    },
    {
      key: 'civil-weekdays',
      icon: 'event_available',
      symbol: '📆',
      eyebrow: t('education.sabbath.title'),
      title: t('education.sabbath.civilTitle'),
      text: t('education.sabbath.civilText'),
      variant: 'light',
      ...purple,
    },
    {
      key: 'astronomy-health',
      icon: 'health_and_safety',
      symbol: '🛡️',
      eyebrow: t('education.moon.eyebrow'),
      title: t('education.moon.claimsTitle'),
      text: t('education.moon.claimsText'),
      variant: 'light',
      ...green,
    },
    {
      key: 'sunrise-sunset',
      icon: 'wb_twilight',
      symbol: '🌅',
      eyebrow: t('education.tools.astronomy.eyebrow'),
      title: t('education.tools.astronomy.locationTitle'),
      text: t('education.tools.astronomy.locationText'),
      variant: 'dark',
      ...amber,
    },
    {
      key: 'moon-cycle',
      icon: 'nights_stay',
      symbol: '🌙',
      eyebrow: t('education.tools.editorial.moonEyebrow'),
      title: t('education.tools.editorial.moonTitle'),
      text: t('education.tools.editorial.moonText'),
      variant: 'dark',
      ...pink,
    },
    {
      key: 'continuous-week',
      icon: 'sync',
      symbol: '♻️',
      eyebrow: t('education.sabbath.title'),
      title: t('education.sabbath.continuousTitle'),
      text: t('education.sabbath.continuousText'),
      variant: 'dark',
      ...purple,
    },
    {
      key: 'predictable-dates',
      icon: 'event_repeat',
      symbol: '🔁',
      eyebrow: t('education.converter.eyebrow'),
      title: t('education.converter.sharedEngine'),
      text: t('education.converter.fact'),
      variant: 'dark',
      ...green,
    },
  ];
});

const carouselFacts = computed(() =>
  Array.from({ length: loopCopies }, (_, copyIndex) =>
    facts.value.map((fact) => ({
      ...fact,
      renderKey: `${copyIndex}-${fact.key}`,
    })),
  ).flat(),
);

const viewportStyle = computed(() => ({
  '--editorial-peek': `${peekWidth.value}px`,
}));

const trackStyle = computed(() => {
  const baseOffset = physicalIndex.value * (cardWidth.value + cardGap);

  return {
    '--editorial-card-width': `${cardWidth.value}px`,
    transform: `translate3d(${dragOffset.value - baseOffset}px, 0, 0)`,
  };
});

function showPrevious() {
  enqueueMovement(-1);
}

function showNext() {
  enqueueMovement(1);
}

function beginPointerNavigation(event) {
  if (
    !event.isPrimary ||
    event.button > 0 ||
    moving.value ||
    !motionEnabled.value ||
    event.target.closest('.q-btn')
  ) {
    return;
  }

  activePointerId = event.pointerId;
  pointerStartX = event.clientX;
  pointerStartY = event.clientY;
  pointerStartTime = performance.now();
  pointerAxis = null;
}

function movePointerNavigation(event) {
  if (activePointerId !== event.pointerId) return;

  const horizontalDistance = event.clientX - pointerStartX;
  const verticalDistance = event.clientY - pointerStartY;

  if (!pointerAxis) {
    if (Math.max(Math.abs(horizontalDistance), Math.abs(verticalDistance)) < 8) return;

    pointerAxis =
      Math.abs(horizontalDistance) > Math.abs(verticalDistance) * 1.1 ? 'horizontal' : 'vertical';

    if (pointerAxis === 'vertical') {
      activePointerId = null;
      return;
    }

    dragging.value = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  if (pointerAxis !== 'horizontal') return;

  const maximumDrag = (cardWidth.value + cardGap) * maximumGestureSteps();
  dragOffset.value = Math.max(-maximumDrag, Math.min(maximumDrag, horizontalDistance));
  event.preventDefault();
}

function endPointerNavigation(event) {
  if (activePointerId !== event.pointerId) return;

  const horizontalDistance = dragOffset.value;
  const elapsed = Math.max(performance.now() - pointerStartTime, 1);
  const velocity = horizontalDistance / elapsed;
  const distanceThreshold = Math.min(84, Math.max(44, cardWidth.value * 0.16));
  const shouldMove =
    pointerAxis === 'horizontal' &&
    (Math.abs(horizontalDistance) >= distanceThreshold || Math.abs(velocity) >= 0.42);

  if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }
  activePointerId = null;
  pointerAxis = null;
  dragging.value = false;
  dragOffset.value = 0;

  if (shouldMove) {
    suppressClickUntil = performance.now() + 450;
    const stepSize = cardWidth.value + cardGap;
    const distanceSteps = Math.max(1, Math.round(Math.abs(horizontalDistance) / stepSize));
    const velocityBoost = Math.abs(velocity) >= 1.1 ? 2 : Math.abs(velocity) >= 0.52 ? 1 : 0;
    const steps = Math.min(maximumGestureSteps(), distanceSteps + velocityBoost);
    enqueueMovement((horizontalDistance < 0 ? 1 : -1) * steps);
  }
}

function maximumGestureSteps() {
  return Math.min(facts.value.length - 1, Math.max(3, visibleCount.value + 2));
}

function cancelPointerNavigation(event) {
  if (event && activePointerId !== event.pointerId) return;

  activePointerId = null;
  pointerAxis = null;
  dragging.value = false;
  dragOffset.value = 0;
}

function suppressClickAfterDrag(event) {
  if (performance.now() >= suppressClickUntil) return;

  event.preventDefault();
  event.stopPropagation();
}

function enqueueMovement(step) {
  if (!step || dragging.value || !motionEnabled.value) return;

  const now = performance.now();
  rapidMovement.value = moving.value || now - lastMovementAt < 260 || Math.abs(step) > 1;
  lastMovementAt = now;
  moving.value = true;
  physicalIndex.value += step;
  window.clearTimeout(movementFallback);
  movementFallback = window.setTimeout(completeMovement, rapidMovement.value ? 620 : 820);
}

function finishMovement(event) {
  if (event.target !== event.currentTarget || event.propertyName !== 'transform') return;

  completeMovement();
}

function completeMovement() {
  if (!moving.value) return;

  window.clearTimeout(movementFallback);

  const normalizedIndex =
    facts.value.length * middleCopy +
    ((physicalIndex.value % facts.value.length) + facts.value.length) % facts.value.length;

  if (normalizedIndex !== physicalIndex.value) {
    jumpWithoutMotion(normalizedIndex);
    return;
  }

  moving.value = false;
  rapidMovement.value = false;
}

function jumpWithoutMotion(index) {
  motionEnabled.value = false;
  physicalIndex.value = index;
  nextTick(() => {
    void carouselTrack.value?.getBoundingClientRect();
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        motionEnabled.value = true;
        moving.value = false;
        rapidMovement.value = false;
      });
    });
  });
}

function isCardVisible(index) {
  return index >= physicalIndex.value && index < physicalIndex.value + visibleCount.value;
}

function measureCarousel() {
  if (!carouselViewport.value) return;

  visibleCount.value = window.innerWidth <= 620 ? 1 : window.innerWidth <= 900 ? 2 : 3;
  peekWidth.value = window.innerWidth <= 620 ? 28 : window.innerWidth <= 900 ? 30 : 32;
  cardWidth.value =
    (carouselViewport.value.clientWidth -
      peekWidth.value * 2 -
      cardGap * (visibleCount.value - 1)) /
    visibleCount.value;
}

onMounted(() => {
  resizeObserver = new ResizeObserver(measureCarousel);
  resizeObserver.observe(carouselViewport.value);
  window.addEventListener('resize', measureCarousel);
  measureCarousel();
});

onBeforeUnmount(() => {
  window.clearTimeout(movementFallback);
  cancelPointerNavigation();
  resizeObserver?.disconnect();
  window.removeEventListener('resize', measureCarousel);
});

function wrapText(context, text, x, y, maxWidth, lineHeight, maxLines = 5) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  lines
    .slice(0, maxLines)
    .forEach((item, index) => context.fillText(item, x, y + index * lineHeight));
}

async function downloadFact(fact) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, 1080, 1080);
  const palette = downloadPalette(fact);
  gradient.addColorStop(0, palette.start);
  gradient.addColorStop(1, palette.end);
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1080, 1080);
  if (fact.variant === 'dark') {
    context.strokeStyle = fact.accent;
    context.lineWidth = 12;
    context.strokeRect(34, 34, 1012, 1012);
  }
  context.direction = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
  context.textAlign = 'start';
  context.font = '64px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
  context.fillText(fact.symbol, 90, 125, 900);
  context.fillStyle = palette.eyebrow;
  context.font = '800 28px Inter, Arial, sans-serif';
  context.fillText(fact.eyebrow.toUpperCase(), 90, 185, 900);
  context.fillStyle = palette.foreground;
  context.font = '850 62px Inter, Arial, sans-serif';
  wrapText(context, fact.title, 90, 285, 900, 74, 4);
  context.fillStyle = palette.muted;
  context.font = '500 34px Inter, Arial, sans-serif';
  wrapText(context, fact.text, 90, 620, 900, 50, 5);
  context.fillStyle = palette.foreground;
  context.font = '750 28px Inter, Arial, sans-serif';
  context.fillText('13 Calendar · 13calendar.pages.dev/learn', 90, 990, 900);

  const blob = await canvasToBlob(canvas);
  downloadBlob(blob, `13-calendar-${fact.key}.png`);
  statusMessage.value = t('education.tools.editorial.downloaded');
}

function downloadPalette(fact) {
  if (fact.variant === 'light') {
    return {
      start: '#ffffff',
      end: fact.soft,
      foreground: '#0f172a',
      muted: '#475569',
      eyebrow: fact.accent,
    };
  }

  if (fact.variant === 'dark') {
    return {
      start: '#020617',
      end: fact.dark,
      foreground: '#ffffff',
      muted: 'rgba(255,255,255,.72)',
      eyebrow: fact.soft,
    };
  }

  return {
    start: '#0f172a',
    end: fact.accent,
    foreground: '#ffffff',
    muted: 'rgba(255,255,255,.78)',
    eyebrow: fact.soft,
  };
}
</script>

<style scoped>
.editorial-carousel {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 44px;
  align-items: center;
  gap: 14px;
  max-width: 1244px;
  margin: 0 auto;
  outline: none;
}

.editorial-carousel__navigation {
  z-index: 2;
  width: 44px;
  min-width: 44px;
  height: 44px;
  min-height: 44px;
  padding: 0 !important;
  color: var(--app-text-muted);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 50% !important;
  box-shadow: 0 10px 28px rgb(15 23 42 / 12%);
  aspect-ratio: 1;
  justify-self: center;
}

.editorial-carousel:focus-visible .editorial-carousel__navigation {
  border-color: var(--app-accent-purple-border);
}

.editorial-carousel__viewport {
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;
  margin-block: -18px;
  padding: 18px var(--editorial-peek);
  cursor: grab;
  touch-action: pan-y;
  mask-image: linear-gradient(
    90deg,
    transparent 0,
    black var(--editorial-peek),
    black calc(100% - var(--editorial-peek)),
    transparent 100%
  );
}

.editorial-carousel__viewport--dragging {
  cursor: grabbing;
  user-select: none;
}

.editorial-cards {
  display: flex;
  align-items: stretch;
  gap: 14px;
  width: max-content;
  transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.editorial-cards--without-motion {
  transition: none;
}

.editorial-cards--dragging {
  transition: none;
}

.editorial-cards--rapid:not(.editorial-cards--without-motion) {
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.2, 0.72, 0.22, 1);
}

.editorial-cards article {
  width: var(--editorial-card-width);
  min-height: 414px;
  display: flex;
  flex: 0 0 var(--editorial-card-width);
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  overflow: hidden;
  padding: clamp(22px, 2.2vw, 26px);
  border: 1px solid transparent;
  border-radius: 22px;
  box-shadow:
    0 26px 54px rgb(15 23 42 / 18%),
    0 8px 20px rgb(15 23 42 / 10%);
  transition:
    box-shadow 220ms ease,
    transform 220ms ease;
}

.editorial-cards article:hover {
  box-shadow:
    0 32px 64px rgb(15 23 42 / 24%),
    0 12px 26px rgb(15 23 42 / 14%);
  transform: translateY(-5px);
}

.editorial-card--color {
  color: white;
  background: linear-gradient(145deg, #0f172a, var(--editorial-accent));
}

.editorial-card--light {
  color: #0f172a;
  background: linear-gradient(145deg, #fff, var(--editorial-soft));
  border-color: color-mix(in srgb, var(--editorial-accent) 42%, transparent);
}

.editorial-card--dark {
  color: white;
  background: linear-gradient(145deg, #020617 24%, var(--editorial-dark));
  border-color: color-mix(in srgb, var(--editorial-accent) 24%, #334155);
}

.editorial-card__icon {
  width: 38px;
  height: 38px;
  display: grid;
  flex: 0 0 38px;
  place-items: start;
}

.editorial-card__icon .q-icon {
  color: var(--editorial-soft);
  font-size: 32px;
}

.editorial-card--light .editorial-card__icon .q-icon {
  color: var(--editorial-accent) !important;
}

.editorial-cards article > span {
  min-height: 13px;
  margin-top: 16px;
  color: var(--editorial-soft);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.editorial-card--light > span {
  color: var(--editorial-accent) !important;
}

.editorial-cards h3 {
  width: 100%;
  height: calc(3 * 1.18em + 2px);
  display: -webkit-box;
  flex: 0 0 auto;
  overflow: hidden;
  margin: 8px 0 10px;
  padding-bottom: 2px;
  font-size: clamp(20px, 2.05vw, 27px);
  line-height: 1.18;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.editorial-cards p {
  width: 100%;
  min-height: calc(5 * 1.6em + 2px);
  display: block;
  flex: 0 0 auto;
  overflow: visible;
  margin: 0 0 16px;
  padding-bottom: 2px;
  color: rgb(255 255 255 / 72%);
  font-size: 13px;
  line-height: 1.6;
}

.editorial-card--light > p {
  color: #475569 !important;
}

.editorial-cards .q-btn {
  margin-top: auto;
}

.editorial-card--color .app-action--primary {
  color: white !important;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--editorial-accent) 72%, white),
    var(--editorial-accent)
  ) !important;
  border-color: color-mix(in srgb, white 24%, var(--editorial-accent)) !important;
  box-shadow: 0 12px 28px color-mix(in srgb, var(--editorial-accent) 32%, transparent);
}

.editorial-card--light .app-action--tertiary {
  color: var(--editorial-accent) !important;
  background: color-mix(in srgb, var(--editorial-soft) 48%, transparent) !important;
  border-color: color-mix(in srgb, var(--editorial-accent) 45%, transparent);
}

.editorial-card--dark .app-action--secondary {
  color: white !important;
  background: rgb(255 255 255 / 8%) !important;
  border-color: rgb(255 255 255 / 16%) !important;
}

.editorial-card--dark .app-action--secondary:not(.disabled):hover,
.editorial-card--dark .app-action--secondary:not(.disabled):focus-visible {
  background: rgb(255 255 255 / 13%) !important;
  border-color: color-mix(in srgb, var(--editorial-accent) 32%, rgb(255 255 255 / 18%)) !important;
}

.editorial-cards__status {
  margin: 18px 0 0;
  color: #059669;
  font-size: 13px;
  text-align: center;
}

@media (max-width: 620px) {
  .editorial-carousel {
    grid-template-columns: 38px minmax(0, 1fr) 38px;
    gap: 8px;
  }

  .editorial-carousel__navigation {
    width: 38px;
    min-width: 38px;
    height: 38px;
    min-height: 38px;
  }

}
</style>
