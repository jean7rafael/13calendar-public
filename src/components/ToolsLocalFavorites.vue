<template>
  <section id="favorites" class="education-section" aria-labelledby="favorites-title">
    <div class="education-section__heading">
      <p class="education-eyebrow">{{ t('education.tools.favorites.eyebrow') }}</p>
      <h2 id="favorites-title">{{ t('education.tools.favorites.title') }}</h2>
      <p>{{ t('education.tools.favorites.description') }}</p>
    </div>

    <q-card flat bordered class="favorites-tool">
      <q-card-section class="favorites-tool__form">
        <AppDateInput
          v-model="favoriteDate"
          :label="t('education.tools.favorites.date')"
        />
        <q-input
          v-model.trim="favoriteLabel"
          outlined
          maxlength="80"
          :label="t('education.tools.favorites.label')"
          @keyup.enter="saveFavorite"
        />
        <q-btn
          no-caps
          unelevated
          icon="bookmark_add"
          class="app-action app-action--primary"
          :label="t('education.tools.favorites.add')"
          @click="saveFavorite"
        />
      </q-card-section>

      <p v-if="statusMessage" class="favorites-tool__status" role="status">
        {{ statusMessage }}
      </p>

      <q-separator />

      <q-list v-if="favoriteRows.length" separator>
        <q-item v-for="favorite in favoriteRows" :key="favorite.date">
          <q-item-section avatar>
            <q-icon name="event" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ favorite.label || favorite.gregorian }}</q-item-label>
            <q-item-label caption>
              {{ favorite.gregorian }} · {{ favorite.fixed }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              flat
              dense
              round
              icon="delete_outline"
              color="negative"
              :aria-label="`${t('education.tools.favorites.remove')}: ${favorite.label || favorite.gregorian}`"
              @click="removeFavorite(favorite.date)"
            >
              <q-tooltip>{{ t('education.tools.favorites.remove') }}</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>

      <q-card-section v-else class="favorites-tool__empty">
        <q-icon name="bookmark_border" aria-hidden="true" />
        <span>{{ t('education.tools.favorites.empty') }}</span>
      </q-card-section>
    </q-card>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCalendarTranslations } from 'src/composables/useCalendarTranslations';
import AppDateInput from 'src/components/AppDateInput.vue';
import {
  buildDateComparisonPresentation,
  isoToGregorianParts,
  localDateToIso,
} from 'src/utils/calendarTools';

const STORAGE_KEY = '13calendar-local-favorites';
const { t, locale } = useI18n({ useScope: 'global' });
const { months13Long, weekDaysComparison } = useCalendarTranslations();

const favoriteDate = ref(localDateToIso());
const favoriteLabel = ref('');
const favorites = ref([]);
const statusMessage = ref('');

const labels = computed(() => ({
  months: months13Long.value,
  weekdays: weekDaysComparison.value,
  yearDay: t('calendar.specialDays.yearDay'),
  leapDay: t('calendar.specialDays.leapDay'),
  specialDays: t('calendar.specialDays.title'),
  position: (month, week) => t('education.converter.position', { month, week }),
}));

const favoriteRows = computed(() =>
  favorites.value.map((favorite) => {
    const parts = isoToGregorianParts(favorite.date);
    const comparison = parts
      ? buildDateComparisonPresentation(parts, locale.value, labels.value)
      : null;
    return {
      ...favorite,
      gregorian: comparison
        ? `${comparison.gregorianTitle} · ${comparison.year}`
        : favorite.date,
      fixed: comparison
        ? `${comparison.fixedTitle} · ${comparison.year}`
        : t('education.converter.invalid'),
    };
  }),
);

function persistFavorites() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value));
  } catch {
    // A lista continua utilizável durante a sessão se o navegador bloquear o armazenamento.
  }
}

function saveFavorite() {
  statusMessage.value = '';
  if (!isoToGregorianParts(favoriteDate.value)) return;
  if (favorites.value.some((favorite) => favorite.date === favoriteDate.value)) {
    statusMessage.value = t('education.tools.favorites.duplicate');
    return;
  }

  favorites.value = [
    ...favorites.value,
    { date: favoriteDate.value, label: favoriteLabel.value },
  ].sort((left, right) => left.date.localeCompare(right.date));
  favoriteLabel.value = '';
  statusMessage.value = t('education.tools.favorites.saved');
  persistFavorites();
}

function removeFavorite(date) {
  favorites.value = favorites.value.filter((favorite) => favorite.date !== date);
  statusMessage.value = '';
  persistFavorites();
}

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(saved)) {
      favorites.value = saved.filter(
        (favorite) =>
          favorite &&
          isoToGregorianParts(favorite.date) &&
          typeof favorite.label === 'string',
      );
    }
  } catch {
    favorites.value = [];
  }
});
</script>

<style scoped>
.favorites-tool {
  max-width: 900px;
  margin: 0 auto;
  overflow: hidden;
  border-color: var(--app-border);
  border-radius: 24px;
  box-shadow: var(--app-card-shadow);
}

.favorites-tool__form {
  display: grid;
  grid-template-columns: minmax(190px, 0.65fr) minmax(220px, 1fr) auto;
  align-items: start;
  gap: 12px;
  padding: 24px;
}

.favorites-tool__form > .app-action {
  /* O formulário usa a exceção prevista pelo contrato para acompanhar a
     altura dos campos, sem substituir a regra universal de crescimento. */
  --app-action-min-height: 56px;
}

.favorites-tool__status {
  margin: 0;
  padding: 0 24px 18px;
  color: #059669;
  font-size: 13px;
  text-align: center;
}

.favorites-tool__empty {
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--app-text-muted);
}

.favorites-tool__empty .q-icon {
  font-size: 28px;
}

@media (max-width: 720px) {
  .favorites-tool__form {
    grid-template-columns: 1fr;
  }
}
</style>
