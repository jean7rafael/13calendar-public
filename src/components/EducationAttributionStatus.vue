<template>
  <div class="education-attribution-status" :class="`education-attribution-status--${mode}`">
    <q-icon :name="mode === 'community' ? 'verified' : 'visibility_off'" aria-hidden="true" />
    <span>
      <strong v-if="mode === 'community' && linkedProfileName">
        {{ t('education.feedback.linkedProfile', { name: linkedProfileName }) }}
      </strong>
      <strong v-else>{{ t('education.feedback.anonymous') }}</strong>
      <small>
        {{
          mode === 'community'
            ? t('education.feedback.identifiedDescription')
            : t('education.feedback.anonymousDescription')
        }}
      </small>
    </span>
    <q-btn
      no-caps
      unelevated
      class="app-action app-action--tertiary"
      icon="badge"
      :label="
        mode === 'community'
          ? t('education.feedback.changeLink')
          : t('education.feedback.identified')
      "
      @click="emit('edit')"
    />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  mode: { type: String, default: 'anonymous' },
  linkedProfileName: { type: String, default: '' },
});
const emit = defineEmits(['edit']);
const { t } = useI18n({ useScope: 'global' });
</script>

<style scoped>
.education-attribution-status {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  padding: 14px;
  color: var(--app-text-muted);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 16px;
  text-align: start;
}

.education-attribution-status > .q-icon {
  color: var(--app-accent-purple-text);
  font-size: 24px;
}

.education-attribution-status--community {
  background: color-mix(in srgb, var(--app-accent-green-soft) 68%, var(--app-surface));
  border-color: var(--app-accent-green-border);
}

.education-attribution-status--community > .q-icon {
  color: var(--app-accent-green-strong);
}

.education-attribution-status span,
.education-attribution-status small {
  display: block;
}

.education-attribution-status strong {
  color: var(--app-text);
  font-size: 12px;
}

.education-attribution-status small {
  margin-top: 2px;
  font-size: 10px;
  line-height: 1.4;
}

@media (max-width: 620px) {
  .education-attribution-status {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .education-attribution-status .q-btn {
    grid-column: 1 / -1;
    width: 100%;
  }
}
</style>
