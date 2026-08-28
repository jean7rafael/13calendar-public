<template>
  <section
    id="education-feedback"
    class="education-section education-feedback"
    aria-labelledby="education-feedback-title"
  >
    <div class="education-section__heading">
      <p class="education-eyebrow">{{ t('education.feedback.voteEyebrow') }}</p>
      <h2 id="education-feedback-title">{{ t('education.feedback.title') }}</h2>
      <p>{{ t('education.feedback.question') }}</p>
    </div>

    <div class="education-feedback__panel">
      <div
        class="education-feedback__options"
        role="radiogroup"
        :aria-label="t('education.feedback.question')"
      >
        <button
          v-for="(option, index) in options"
          :key="option.tone"
          type="button"
          role="radio"
          :aria-checked="draftVote === index"
          :aria-label="option.label"
          :disabled="loading || submitting || !feedbackUrl"
          class="education-feedback__option"
          :class="[
            `education-feedback__option--${option.tone}`,
            { 'education-feedback__option--selected': draftVote === index },
          ]"
          @click="selectVote(index)"
        >
          <span aria-hidden="true"><q-icon :name="option.icon" /></span>
          <small>{{ option.label }}</small>
        </button>
      </div>

      <q-btn
        no-caps
        unelevated
        class="app-action app-action--primary education-feedback__submit"
        icon-right="how_to_vote"
        :label="t('education.feedback.voteSubmit')"
        :loading="submitting"
        :disable="loading || submitting || !feedbackUrl"
        @click="openVoteAttribution"
      />

      <div class="education-feedback__message" aria-live="polite">
        <q-spinner v-if="loading" color="primary" size="18px" />
        <span v-else-if="message" :class="`education-feedback__message--${message.type}`">
          {{ message.text }}
        </span>
      </div>

      <EducationAttributionStatus
        v-if="Number.isInteger(userVote)"
        :mode="voteAttributionMode"
        :linked-profile-name="voteLinkedProfileName"
        @edit="openVoteAttribution"
      />

      <div class="education-feedback__brand" aria-hidden="true">13 ● MONTHS ● CALENDAR</div>
    </div>

    <q-card
      v-if="Number.isInteger(userVote) && !loading"
      flat
      bordered
      class="education-feedback__results"
    >
      <q-card-section>
        <div class="education-feedback__results-title">
          <strong>{{ t('education.feedback.results') }}</strong>
          <span>{{ t('education.feedback.voteCount', totalVotes, { count: totalVotes }) }}</span>
        </div>

        <div
          v-for="(option, index) in options"
          :key="option.tone"
          class="education-feedback__result"
        >
          <q-icon :name="option.icon" :class="`education-feedback__result-icon--${option.tone}`" />
          <div class="education-feedback__track">
            <i
              :class="`education-feedback__track-fill--${option.tone}`"
              :style="{ width: `${votePercentage(index)}%` }"
            ></i>
            <small>{{ votes[index] || 0 }} ({{ votePercentage(index) }}%)</small>
          </div>
          <q-icon
            v-if="userVote === index"
            name="check_circle"
            color="primary"
            :aria-label="t('education.feedback.selected')"
          />
        </div>

        <div class="education-feedback__share">
          <q-btn
            no-caps
            unelevated
            class="app-action app-action--secondary"
            icon="share"
            :label="t('education.tools.share.native')"
            @click="shareResults"
          />
          <q-btn
            no-caps
            unelevated
            class="app-action app-action--tertiary"
            icon="link"
            :label="t('education.tools.share.copy')"
            @click="copyResultsLink"
          />
        </div>

        <p v-if="shareStatus" class="education-feedback__share-status" aria-live="polite">
          {{ shareStatus }}
        </p>
      </q-card-section>
    </q-card>

    <EducationAttributionDialog
      v-model="identityDialogOpen"
      :question="t('education.feedback.voteIdentityQuestion')"
      :initial-mode="voteAttributionMode"
      :linked-profile-name="voteLinkedProfileName"
      :submitting="submitting"
      :error="dialogError"
      @clear-error="dialogError = ''"
      @confirm="submitVote"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import EducationAttributionDialog from 'src/components/EducationAttributionDialog.vue';
import EducationAttributionStatus from 'src/components/EducationAttributionStatus.vue';
import { useEducationFeedbackStore } from 'src/composables/useEducationFeedbackStore';
import { copyText, createAbsoluteRouteUrl } from 'src/utils/calendarTools';

const { t, tm, locale } = useI18n({ useScope: 'global' });
const {
  feedbackUrl,
  votes,
  userVote,
  voteAttributionMode,
  voteLinkedProfileName,
  loadState,
  loading,
  totalVotes,
  loadFeedback,
  saveFeedback,
} = useEducationFeedbackStore();
const draftVote = ref(null);
const submitting = ref(false);
const message = ref(null);
const shareStatus = ref('');
const identityDialogOpen = ref(false);
const dialogError = ref('');

const options = computed(() => {
  const labels = tm('education.feedback.options');
  const translatedLabels = Array.isArray(labels) ? labels : [];

  return [
    { icon: 'sentiment_very_satisfied', tone: 'green' },
    { icon: 'sentiment_satisfied', tone: 'purple' },
    { icon: 'sentiment_dissatisfied', tone: 'amber' },
    { icon: 'sentiment_very_dissatisfied', tone: 'pink' },
  ].map((option, index) => ({ ...option, label: translatedLabels[index] || '' }));
});

watch(
  userVote,
  (value) => {
    if (Number.isInteger(value)) draftVote.value = value;
  },
  { immediate: true },
);

watch(
  loadState,
  (state) => {
    if (state === 'unavailable') {
      message.value = { type: 'warning', text: t('education.feedback.unavailable') };
    } else if (state === 'error') {
      message.value = { type: 'error', text: t('education.feedback.loadError') };
    }
  },
  { immediate: true },
);

function selectVote(index) {
  draftVote.value = index;
  message.value = null;
}

function openVoteAttribution() {
  if (!Number.isInteger(draftVote.value)) {
    message.value = { type: 'warning', text: t('education.feedback.voteRequired') };
    return;
  }

  dialogError.value = '';
  identityDialogOpen.value = true;
}

async function submitVote({ attributionMode, communityCode }) {
  if (submitting.value || !Number.isInteger(draftVote.value)) return;
  if (attributionMode === 'community' && !voteLinkedProfileName.value && !communityCode) {
    dialogError.value = t('education.feedback.communityCodeRequired');
    return;
  }

  submitting.value = true;
  dialogError.value = '';
  const result = await saveFeedback({
    kind: 'vote',
    index: draftVote.value,
    attributionMode,
    communityCode,
    locale: locale.value,
  });
  submitting.value = false;

  if (!result.ok) {
    dialogError.value =
      result.error === 'invalid_community_code'
        ? t('education.feedback.communityCodeInvalid')
        : t('education.feedback.saveError');
    return;
  }

  identityDialogOpen.value = false;
  message.value = { type: 'success', text: t('education.feedback.success') };
}

function votePercentage(index) {
  if (!totalVotes.value) return 0;
  return Math.round(((votes.value[index] || 0) / totalVotes.value) * 100);
}

function resultsShareText() {
  const totals = options.value
    .map((option, index) => `${option.label}: ${votes.value[index] || 0}`)
    .join('\n');
  return `${t('education.feedback.question')}\n${totals}`;
}

function resultsUrl() {
  return `${createAbsoluteRouteUrl('/learn')}#education-feedback`;
}

async function copyResultsLink() {
  await copyText(resultsUrl());
  shareStatus.value = t('education.tools.share.copied');
}

async function shareResults() {
  if (!navigator.share) {
    await copyResultsLink();
    shareStatus.value = t('education.tools.share.unavailable');
    return;
  }

  try {
    await navigator.share({
      title: t('education.feedback.title'),
      text: resultsShareText(),
      url: resultsUrl(),
    });
    shareStatus.value = t('education.tools.share.shared');
  } catch (error) {
    if (error?.name !== 'AbortError') {
      await copyResultsLink();
      shareStatus.value = t('education.tools.share.unavailable');
    }
  }
}

onMounted(loadFeedback);
</script>

<style scoped>
.education-feedback__panel {
  width: min(1040px, 100%);
  margin: 0 auto;
  padding: clamp(24px, 4vw, 42px);
  color: var(--app-text);
  background:
    radial-gradient(circle at 15% 0%, var(--app-accent-green-soft), transparent 34%),
    radial-gradient(circle at 85% 0%, var(--calendar-sunday-cell), transparent 34%),
    var(--app-surface-raised);
  border: 1px solid var(--app-accent-purple-border);
  border-radius: 28px;
  box-shadow: var(--app-card-shadow);
  text-align: center;
}

.education-feedback__options {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(10px, 2vw, 18px);
}

.education-feedback__option {
  --feedback-color: var(--app-accent-purple-strong);
  --feedback-soft: var(--app-accent-purple-soft);
  --feedback-border: var(--app-accent-purple-border);

  min-width: 0;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 18px 10px;
  color: var(--feedback-color);
  background: color-mix(in srgb, var(--feedback-soft) 72%, var(--app-surface));
  border: 1px solid var(--feedback-border);
  border-radius: 20px;
  cursor: pointer;
  transition: 160ms ease;
}

.education-feedback__option--green {
  --feedback-color: var(--app-accent-green-strong);
  --feedback-soft: var(--app-accent-green-soft);
  --feedback-border: var(--app-accent-green-border);
}

.education-feedback__option--amber {
  --feedback-color: var(--app-accent-amber-strong);
  --feedback-soft: var(--app-accent-amber-soft);
  --feedback-border: var(--app-accent-amber-border);
}

.education-feedback__option--pink {
  --feedback-color: var(--calendar-sunday-text);
  --feedback-soft: var(--calendar-sunday-cell);
  --feedback-border: color-mix(in srgb, var(--calendar-sunday-text) 38%, transparent);
}

.education-feedback__option > span {
  width: 74px;
  height: 74px;
  display: grid;
  place-items: center;
  color: white;
  background: var(--feedback-color);
  border: 1px solid var(--feedback-border);
  border-radius: 50%;
  box-shadow: 0 10px 24px color-mix(in srgb, var(--feedback-color) 24%, transparent);
  font-size: 43px;
}

.education-feedback__option:hover,
.education-feedback__option:focus-visible,
.education-feedback__option--selected {
  background: var(--feedback-soft);
  outline: none;
  transform: translateY(-3px);
}

.education-feedback__option--selected {
  box-shadow: 0 0 0 2px var(--feedback-color);
}

.education-feedback__option small {
  min-height: 34px;
  color: var(--app-text);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.4;
}

.education-feedback__option:disabled {
  cursor: not-allowed;
  opacity: 0.78;
}

.education-feedback__submit {
  min-width: min(100%, 260px);
  margin-top: 28px;
}

.education-feedback__message {
  min-height: 30px;
  display: grid;
  place-items: center;
  margin-top: 10px;
  font-size: 12px;
}

.education-feedback__message--success { color: var(--app-accent-green-text); }
.education-feedback__message--error { color: #ef4444; }
.education-feedback__message--warning { color: var(--app-accent-amber-text); }

.education-feedback__brand {
  margin-top: 16px;
  color: var(--app-text-faint);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.education-feedback__results {
  width: min(720px, 100%);
  margin: 24px auto 0;
  border-color: var(--app-border);
  border-radius: 20px;
}

.education-feedback__results-title {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  color: var(--app-text-muted);
  font-size: 11px;
  text-transform: uppercase;
}

.education-feedback__results-title strong { color: var(--app-text); }

.education-feedback__result {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) 22px;
  align-items: center;
  gap: 8px;
  min-height: 34px;
}

.education-feedback__result-icon--green { color: var(--app-accent-green-strong); }
.education-feedback__result-icon--purple { color: var(--app-accent-purple-strong); }
.education-feedback__result-icon--amber { color: var(--app-accent-amber-strong); }
.education-feedback__result-icon--pink { color: var(--calendar-sunday-text); }

.education-feedback__track {
  position: relative;
  height: 18px;
  overflow: hidden;
  background: var(--app-border);
  border-radius: 99px;
}

.education-feedback__track i {
  height: 100%;
  display: block;
  border-radius: inherit;
  transition: width 300ms ease;
}

.education-feedback__track-fill--green { background: var(--app-accent-green-strong); }
.education-feedback__track-fill--purple { background: var(--app-accent-purple-strong); }
.education-feedback__track-fill--amber { background: var(--app-accent-amber-strong); }
.education-feedback__track-fill--pink { background: var(--calendar-sunday-text); }

.education-feedback__track small {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--app-text);
  font-size: 9px;
  font-weight: 700;
}

.education-feedback__share {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
}

.education-feedback__share-status {
  margin: 10px 0 0;
  color: var(--app-text-muted);
  font-size: 11px;
  text-align: center;
}

@media (max-width: 620px) {
  .education-feedback__panel {
    padding: 20px 14px;
    border-radius: 22px;
  }

  .education-feedback__options {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .education-feedback__option {
    min-height: 132px;
  }
}
</style>
