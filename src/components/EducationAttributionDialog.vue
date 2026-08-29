<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="education-attribution-dialog">
      <q-card-section>
        <div class="text-h6">{{ t('education.feedback.identityTitle') }}</div>
        <p>{{ question }}</p>

        <div class="education-attribution-dialog__options" role="radiogroup">
          <button
            type="button"
            role="radio"
            :aria-checked="mode === 'anonymous'"
            :class="{ 'education-attribution-dialog__option--selected': mode === 'anonymous' }"
            @click="selectMode('anonymous')"
          >
            <q-icon name="visibility_off" aria-hidden="true" />
            <span>
              <strong>{{ t('education.feedback.anonymous') }}</strong>
              <small>{{ t('education.feedback.anonymousDescription') }}</small>
            </span>
          </button>

          <button
            type="button"
            role="radio"
            :aria-checked="mode === 'community'"
            :class="{ 'education-attribution-dialog__option--selected': mode === 'community' }"
            @click="selectMode('community')"
          >
            <q-icon name="badge" aria-hidden="true" />
            <span>
              <strong>{{ t('education.feedback.identified') }}</strong>
              <small>{{ t('education.feedback.identifiedDescription') }}</small>
            </span>
          </button>
        </div>

        <div v-if="mode === 'community'" class="education-attribution-dialog__community">
          <div v-if="linkedProfileName" class="education-attribution-dialog__linked">
            <q-icon name="verified" aria-hidden="true" />
            <span>{{ t('education.feedback.linkedProfile', { name: linkedProfileName }) }}</span>
          </div>

          <router-link
            v-if="!linkedProfileName && !communityCode"
            class="education-attribution-dialog__registration"
            :to="{ name: 'community', hash: '#community-registration' }"
            @click="emit('update:modelValue', false)"
          >
            <q-icon name="person_add" aria-hidden="true" />
            <span>
              <strong>{{ t('community.joinTitle') }}</strong>
              <small>{{ t('community.joinDescription') }}</small>
            </span>
            <q-icon
              class="education-attribution-dialog__registration-arrow"
              name="arrow_forward"
              aria-hidden="true"
            />
          </router-link>

          <q-input
            v-model.trim="communityCode"
            outlined
            type="password"
            autocomplete="off"
            :label="t('education.feedback.communityCodeLabel')"
            :hint="
              linkedProfileName
                ? t('education.feedback.communityCodeOptional')
                : t('education.feedback.communityCodeHint')
            "
          />
        </div>

        <p v-if="error" class="education-attribution-dialog__error" aria-live="polite">
          {{ error }}
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          no-caps
          unelevated
          class="app-action app-action--secondary"
          :label="t('education.feedback.cancel')"
          @click="emit('update:modelValue', false)"
        />
        <q-btn
          no-caps
          unelevated
          class="app-action app-action--primary"
          icon-right="send"
          :label="t('education.feedback.confirm')"
          :loading="submitting"
          @click="confirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { readCommunityProfileCode } from 'src/utils/communityProfileCredential';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  question: { type: String, required: true },
  initialMode: { type: String, default: 'anonymous' },
  linkedProfileName: { type: String, default: '' },
  submitting: { type: Boolean, default: false },
  error: { type: String, default: '' },
});
const emit = defineEmits(['update:modelValue', 'confirm', 'clear-error']);
const { t } = useI18n({ useScope: 'global' });
const mode = ref('anonymous');
const communityCode = ref('');

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) return;
    mode.value = props.initialMode === 'community' ? 'community' : 'anonymous';
    communityCode.value = props.linkedProfileName ? '' : readCommunityProfileCode();
    emit('clear-error');
  },
);

function selectMode(value) {
  mode.value = value;
  emit('clear-error');
}

function confirm() {
  emit('confirm', {
    attributionMode: mode.value,
    communityCode: communityCode.value.trim(),
  });
}
</script>

<style scoped>
.education-attribution-dialog {
  width: min(580px, calc(100vw - 28px));
  border: 1px solid var(--app-accent-purple-border);
  border-radius: 22px;
}

.education-attribution-dialog .q-card__section {
  padding: 26px;
}

.education-attribution-dialog .text-h6 {
  color: var(--app-text);
  font-weight: 800;
}

.education-attribution-dialog .text-h6 + p {
  margin: 6px 0 20px;
  color: var(--app-text-muted);
  line-height: 1.55;
}

.education-attribution-dialog__options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.education-attribution-dialog__options button {
  min-width: 0;
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 16px;
  color: var(--app-text);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 16px;
  text-align: start;
  cursor: pointer;
}

.education-attribution-dialog__options button > .q-icon {
  flex: none;
  color: var(--app-accent-purple-text);
  font-size: 22px;
}

.education-attribution-dialog__options span,
.education-attribution-dialog__options small {
  display: block;
}

.education-attribution-dialog__options small {
  margin-top: 4px;
  color: var(--app-text-muted);
  font-size: 11px;
  line-height: 1.45;
}

.education-attribution-dialog__options button:hover,
.education-attribution-dialog__options button:focus-visible,
.education-attribution-dialog__option--selected {
  background: var(--app-accent-purple-soft) !important;
  border-color: var(--app-accent-purple-border) !important;
  outline: none;
}

.education-attribution-dialog__community {
  display: grid;
  gap: 14px;
  margin-top: 18px;
}

.education-attribution-dialog__linked {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  color: var(--app-accent-green-text);
  background: var(--app-accent-green-soft);
  border: 1px solid var(--app-accent-green-border);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

.education-attribution-dialog__registration {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 13px 14px;
  color: var(--app-accent-purple-text);
  background: var(--app-accent-purple-soft);
  border: 1px solid var(--app-accent-purple-border);
  border-radius: 14px;
  text-decoration: none;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;
}

.education-attribution-dialog__registration:hover,
.education-attribution-dialog__registration:focus-visible {
  border-color: var(--app-accent-purple-strong);
  box-shadow: 0 10px 26px rgb(99 102 241 / 16%);
  outline: none;
  transform: translateY(-1px);
}

.education-attribution-dialog__registration > .q-icon {
  flex: none;
  margin-top: 1px;
  font-size: 22px;
}

.education-attribution-dialog__registration > .education-attribution-dialog__registration-arrow {
  align-self: center;
  margin-inline-start: auto;
  font-size: 18px;
}

.education-attribution-dialog__registration span,
.education-attribution-dialog__registration small {
  display: block;
}

.education-attribution-dialog__registration strong {
  color: var(--app-text);
  font-size: 13px;
}

.education-attribution-dialog__registration small {
  margin-top: 4px;
  color: var(--app-text-muted);
  font-size: 11px;
  line-height: 1.5;
}

.education-attribution-dialog__error {
  margin: 16px 0 0;
  color: #ef4444;
  font-size: 12px;
}

@media (max-width: 620px) {
  .education-attribution-dialog .q-card__section {
    padding: 20px;
  }

  .education-attribution-dialog__options {
    grid-template-columns: 1fr;
  }
}
</style>
