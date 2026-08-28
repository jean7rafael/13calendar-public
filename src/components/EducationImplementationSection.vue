<template>
  <section
    id="education-implementation"
    class="education-section education-implementation"
    aria-labelledby="education-implementation-title"
  >
    <div class="education-section__heading">
      <p class="education-eyebrow">{{ t('education.feedback.barrierEyebrow') }}</p>
      <h2 id="education-implementation-title">{{ t('education.feedback.barrierTitle') }}</h2>
      <p>{{ t('education.feedback.barrierIntro') }}</p>
    </div>

    <div class="education-implementation__content">
      <div class="education-implementation__barriers">
        <article
          v-for="(barrier, index) in feedbackBarriers"
          :key="barrier"
          :class="`education-implementation__barrier--${barrierStyles[index].tone}`"
        >
          <q-icon :name="barrierStyles[index].icon" aria-hidden="true" />
          <p>{{ barrier }}</p>
        </article>
      </div>

      <div class="education-implementation__response">
        <div class="education-implementation__response-heading">
          <q-icon name="forum" aria-hidden="true" />
          <div>
            <h3>{{ t('education.feedback.responseHeading') }}</h3>
            <p>{{ t('education.feedback.suggestionHint') }}</p>
          </div>
        </div>

        <div class="education-implementation__fields">
          <q-input
            v-model="responseTitle"
            outlined
            maxlength="100"
            :label="t('education.feedback.responseTitleLabel')"
            :hint="t('education.feedback.responseTitleHint')"
            :disable="loading || submitting || !feedbackUrl"
          />
          <q-input
            v-model="suggestion"
            outlined
            type="textarea"
            autogrow
            counter
            maxlength="1200"
            :label="t('education.feedback.suggestionLabel')"
            :disable="loading || submitting || !feedbackUrl"
          />
        </div>

        <q-btn
          no-caps
          unelevated
          class="app-action app-action--primary education-implementation__submit"
          icon-right="arrow_forward"
          :label="t('education.feedback.submit')"
          :loading="submitting"
          :disable="loading || submitting || !feedbackUrl"
          @click="openResponseAttribution"
        />

        <div class="education-implementation__message" aria-live="polite">
          <q-spinner v-if="loading" color="primary" size="18px" />
          <span v-else-if="message" :class="`education-implementation__message--${message.type}`">
            {{ message.text }}
          </span>
        </div>

        <EducationAttributionStatus
          v-if="hasSavedResponse"
          :mode="responseAttributionMode"
          :linked-profile-name="responseLinkedProfileName"
          @edit="openResponseAttribution"
        />
      </div>
    </div>

    <EducationAttributionDialog
      v-model="identityDialogOpen"
      :question="t('education.feedback.responseIdentityQuestion')"
      :initial-mode="responseAttributionMode"
      :linked-profile-name="responseLinkedProfileName"
      :submitting="submitting"
      :error="dialogError"
      @clear-error="dialogError = ''"
      @confirm="submitResponse"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import EducationAttributionDialog from 'src/components/EducationAttributionDialog.vue';
import EducationAttributionStatus from 'src/components/EducationAttributionStatus.vue';
import { useEducationFeedbackStore } from 'src/composables/useEducationFeedbackStore';

const { t, tm, locale } = useI18n({ useScope: 'global' });
const {
  feedbackUrl,
  responseTitle,
  suggestion,
  responseAttributionMode,
  responseLinkedProfileName,
  hasSavedResponse,
  loadState,
  loading,
  loadFeedback,
  saveFeedback,
} = useEducationFeedbackStore();
const submitting = ref(false);
const message = ref(null);
const identityDialogOpen = ref(false);
const dialogError = ref('');
const barrierStyles = [
  { icon: 'public', tone: 'purple' },
  { icon: 'sync_alt', tone: 'green' },
  { icon: 'event_repeat', tone: 'amber' },
  { icon: 'diversity_3', tone: 'pink' },
];
const feedbackBarriers = computed(() => {
  const barriers = tm('education.feedback.barriers');
  return Array.isArray(barriers) ? barriers : [];
});

watch(
  loadState,
  (state) => {
    if (state === 'unavailable') {
      message.value = { type: 'warning', text: t('education.feedback.responseUnavailable') };
    } else if (state === 'error') {
      message.value = { type: 'error', text: t('education.feedback.responseLoadError') };
    }
  },
  { immediate: true },
);

function openResponseAttribution() {
  if (!suggestion.value.trim()) {
    message.value = { type: 'warning', text: t('education.feedback.responseRequired') };
    return;
  }

  dialogError.value = '';
  identityDialogOpen.value = true;
}

async function submitResponse({ attributionMode, communityCode }) {
  if (submitting.value || !suggestion.value.trim()) return;
  if (attributionMode === 'community' && !responseLinkedProfileName.value && !communityCode) {
    dialogError.value = t('education.feedback.communityCodeRequired');
    return;
  }

  submitting.value = true;
  dialogError.value = '';
  const result = await saveFeedback({
    kind: 'response',
    title: responseTitle.value.trim(),
    suggestion: suggestion.value.trim(),
    attributionMode,
    communityCode,
    locale: locale.value,
  });
  submitting.value = false;

  if (!result.ok) {
    dialogError.value =
      result.error === 'invalid_community_code'
        ? t('education.feedback.communityCodeInvalid')
        : t('education.feedback.responseSaveError');
    return;
  }

  identityDialogOpen.value = false;
  message.value = { type: 'success', text: t('education.feedback.sent') };
}

onMounted(loadFeedback);
</script>

<style scoped>
.education-implementation {
  border-top: 1px solid color-mix(in srgb, var(--app-accent-green-border) 60%, transparent);
}

.education-implementation .education-eyebrow {
  color: var(--app-accent-green-strong);
}

.education-implementation__content {
  max-width: 1080px;
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(420px, 1.08fr);
  align-items: stretch;
  gap: 24px;
  margin: 0 auto;
}

.education-implementation__barriers {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.education-implementation__barriers article {
  --barrier-color: var(--app-accent-purple-text);
  --barrier-soft: var(--app-accent-purple-soft);
  --barrier-border: var(--app-accent-purple-border);

  min-height: 178px;
  padding: 22px;
  background: color-mix(in srgb, var(--barrier-soft) 72%, var(--app-surface));
  border: 1px solid var(--barrier-border);
  border-radius: 20px;
}

.education-implementation__barrier--green {
  --barrier-color: var(--app-accent-green-text) !important;
  --barrier-soft: var(--app-accent-green-soft) !important;
  --barrier-border: var(--app-accent-green-border) !important;
}

.education-implementation__barrier--amber {
  --barrier-color: var(--app-accent-amber-text) !important;
  --barrier-soft: var(--app-accent-amber-soft) !important;
  --barrier-border: var(--app-accent-amber-border) !important;
}

.education-implementation__barrier--pink {
  --barrier-color: var(--calendar-sunday-text) !important;
  --barrier-soft: var(--calendar-sunday-cell) !important;
  --barrier-border: color-mix(in srgb, var(--calendar-sunday-text) 34%, transparent) !important;
}

.education-implementation__barriers .q-icon {
  color: var(--barrier-color);
  font-size: 28px;
}

.education-implementation__barriers p {
  margin: 16px 0 0;
  color: var(--app-text-muted);
  font-size: 13px;
  line-height: 1.6;
}

.education-implementation__response {
  height: 100%;
  padding: clamp(24px, 4vw, 36px);
  background:
    radial-gradient(circle at 100% 0%, var(--app-accent-purple-soft), transparent 42%),
    var(--app-surface-raised);
  border: 1px solid var(--app-accent-purple-border);
  border-radius: 24px;
  box-shadow: var(--app-card-shadow);
}

.education-implementation__response-heading {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 24px;
}

.education-implementation__response-heading > .q-icon {
  width: 44px;
  height: 44px;
  flex: none;
  display: grid;
  place-items: center;
  color: var(--app-accent-purple-text);
  background: var(--app-accent-purple-soft);
  border: 1px solid var(--app-accent-purple-border);
  border-radius: 14px;
  font-size: 24px;
}

.education-implementation__response-heading h3 {
  margin: 0;
  color: var(--app-text);
  font-size: 22px;
}

.education-implementation__response-heading p {
  margin: 6px 0 0;
  color: var(--app-text-muted);
  font-size: 12px;
  line-height: 1.55;
}

.education-implementation__fields {
  display: grid;
  gap: 16px;
}

.education-implementation__submit {
  min-width: min(100%, 250px);
  margin-top: 22px;
}

.education-implementation__message {
  min-height: 30px;
  display: grid;
  place-items: center;
  margin-top: 10px;
  font-size: 12px;
}

.education-implementation__message--success { color: var(--app-accent-green-text); }
.education-implementation__message--error { color: #ef4444; }
.education-implementation__message--warning { color: var(--app-accent-amber-text); }

@media (max-width: 900px) {
  .education-implementation__content {
    grid-template-columns: 1fr;
  }

  .education-implementation__barriers {
    height: auto;
    grid-template-rows: auto;
  }

  .education-implementation__response {
    height: auto;
  }
}

@media (max-width: 620px) {
  .education-implementation__barriers {
    grid-template-columns: 1fr;
  }

  .education-implementation__barriers article {
    min-height: 0;
  }

  .education-implementation__response {
    padding: 22px 16px;
  }
}
</style>
