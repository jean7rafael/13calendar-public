<template>
  <!-- Encerramentos editoriais compartilham a mesma faixa compacta. O tom
       muda a ênfase sem alterar hierarquia, espaçamento ou tipografia. -->
  <aside class="education-closing-notice" :class="`education-closing-notice--${tone}`">
    <q-icon :name="icon" aria-hidden="true" />
    <div>
      <strong v-if="title">{{ title }}</strong>
      <p>{{ text }}</p>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  tone: {
    type: String,
    default: 'amber',
    validator: (value) => ['purple', 'green', 'pink', 'amber'].includes(value),
  },
});
</script>

<style scoped>
.education-closing-notice {
  --notice-color: var(--app-accent-amber-text);
  --notice-soft: var(--app-accent-amber-soft);
  --notice-border: var(--app-accent-amber-border);

  max-width: 1080px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: 13px;
  margin: 22px auto 0;
  padding: 17px 19px;
  color: var(--notice-color);
  background: color-mix(in srgb, var(--notice-soft) 58%, var(--app-surface));
  border: 1px solid var(--notice-border);
  border-radius: 16px;
}

.education-closing-notice--purple {
  --notice-color: var(--app-accent-purple-text);
  --notice-soft: var(--app-accent-purple-soft);
  --notice-border: var(--app-accent-purple-border);
}

.education-closing-notice--green {
  --notice-color: var(--app-accent-green-text);
  --notice-soft: var(--app-accent-green-soft);
  --notice-border: var(--app-accent-green-border);
}

.education-closing-notice--pink {
  --notice-color: var(--calendar-sunday-text);
  --notice-soft: var(--calendar-sunday-cell);
  --notice-border: color-mix(in srgb, var(--calendar-sunday-text) 30%, transparent);
}

.education-closing-notice > .q-icon {
  flex: none;
  margin-top: 2px;
  color: var(--notice-color);
  font-size: 21px;
}

.education-closing-notice strong {
  display: block;
  color: var(--notice-color);
  font-size: 12px;
  line-height: 1.45;
}

.education-closing-notice p {
  margin: 0;
  color: var(--app-text-muted);
  font-size: 12px;
  line-height: 1.55;
}

.education-closing-notice strong + p {
  margin-top: 4px;
}
</style>
