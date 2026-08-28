<template>
  <section id="fact-cards" class="education-section" aria-labelledby="fact-cards-title">
    <div class="education-section__heading">
      <p class="education-eyebrow">{{ t('education.tools.editorial.eyebrow') }}</p>
      <h2 id="fact-cards-title">{{ t('education.tools.editorial.title') }}</h2>
      <p>{{ t('education.tools.editorial.description') }}</p>
    </div>

    <div class="editorial-cards">
      <article v-for="fact in facts" :key="fact.key" :class="`editorial-card--${fact.key}`">
        <q-icon :name="fact.icon" aria-hidden="true" />
        <span>{{ fact.eyebrow }}</span>
        <h3>{{ fact.title }}</h3>
        <p>{{ fact.text }}</p>
        <q-btn
          no-caps
          unelevated
          class="app-action app-action--tertiary"
          icon="download"
          :label="t('education.tools.editorial.download')"
          @click="downloadFact(fact)"
        />
      </article>
    </div>

    <p v-if="statusMessage" class="editorial-cards__status" role="status">
      {{ statusMessage }}
    </p>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { canvasToBlob, downloadBlob } from 'src/utils/calendarTools';

const { t } = useI18n({ useScope: 'global' });
const statusMessage = ref('');

const facts = computed(() => [
  {
    key: 'moon',
    icon: 'nights_stay',
    eyebrow: t('education.tools.editorial.moonEyebrow'),
    title: t('education.tools.editorial.moonTitle'),
    text: t('education.tools.editorial.moonText'),
    accent: '#7c3aed',
  },
  {
    key: 'kodak',
    icon: 'photo_camera',
    eyebrow: t('education.tools.editorial.kodakEyebrow'),
    title: t('education.tools.editorial.kodakTitle'),
    text: t('education.tools.editorial.kodakText'),
    accent: '#db2777',
  },
]);

function wrapText(context, text, x, y, maxWidth, lineHeight) {
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
  lines.slice(0, 5).forEach((item, index) => context.fillText(item, x, y + index * lineHeight));
}

async function downloadFact(fact) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, 1080, 1080);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(1, fact.accent);
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1080, 1080);
  context.direction = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
  context.textAlign = 'start';
  context.fillStyle = '#c4b5fd';
  context.font = '800 28px Inter, Arial, sans-serif';
  context.fillText(fact.eyebrow.toUpperCase(), 90, 135, 900);
  context.fillStyle = '#ffffff';
  context.font = '850 70px Inter, Arial, sans-serif';
  wrapText(context, fact.title, 90, 260, 900, 82);
  context.fillStyle = 'rgba(255,255,255,.78)';
  context.font = '500 34px Inter, Arial, sans-serif';
  wrapText(context, fact.text, 90, 600, 900, 50);
  context.fillStyle = '#ffffff';
  context.font = '750 28px Inter, Arial, sans-serif';
  context.fillText('13 Calendar · 13calendar.pages.dev/learn', 90, 990, 900);

  const blob = await canvasToBlob(canvas);
  downloadBlob(blob, `13-calendar-${fact.key}.png`);
  statusMessage.value = t('education.tools.editorial.downloaded');
}
</script>

<style scoped>
.editorial-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.editorial-cards article {
  min-height: 390px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: clamp(28px, 5vw, 48px);
  color: white;
  border-radius: 26px;
  box-shadow: var(--app-card-shadow);
}

.editorial-card--moon {
  background: linear-gradient(145deg, #0f172a, #4c1d95);
}

.editorial-card--kodak {
  background: linear-gradient(145deg, #111827, #9d174d);
}

.editorial-cards article > .q-icon {
  font-size: 36px;
}

.editorial-cards article > span {
  margin-top: 28px;
  color: #ddd6fe;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.editorial-cards h3 {
  margin: 10px 0 12px;
  font-size: clamp(27px, 4vw, 42px);
  line-height: 1.05;
}

.editorial-cards p {
  margin: 0 0 24px;
  color: rgb(255 255 255 / 72%);
  line-height: 1.65;
}

.editorial-cards .q-btn {
  margin-top: auto;
  color: white;
}

.editorial-cards__status {
  margin: 18px 0 0;
  color: #059669;
  font-size: 13px;
  text-align: center;
}

@media (max-width: 700px) {
  .editorial-cards {
    grid-template-columns: 1fr;
  }
}
</style>
