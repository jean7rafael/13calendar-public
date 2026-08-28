<template>
  <section
    class="app-notice-panel"
    :class="[
      `app-notice-panel--${tone}`,
      { 'app-notice-panel--with-action': $slots.action },
    ]"
  >
    <q-icon class="app-notice-panel__icon" :name="icon" size="26px" aria-hidden="true" />

    <div class="app-notice-panel__content">
      <h2 v-if="title">{{ title }}</h2>
      <slot></slot>
    </div>

    <div v-if="$slots.action" class="app-notice-panel__action">
      <slot name="action"></slot>
    </div>
  </section>
</template>

<script setup>
defineProps({
  tone: {
    type: String,
    default: 'purple',
    validator: (value) => ['purple', 'green', 'amber'].includes(value),
  },
  icon: {
    type: String,
    default: 'info',
  },
  title: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
/*
 * Um único componente sustenta avisos informativos, de
 * transparência e de atenção. O conteúdo pode variar; geometria,
 * espaçamento e contraste permanecem iguais em todo o produto.
 */
.app-notice-panel {
  --notice-color: var(--app-accent-purple-text);
  --notice-background: var(--app-accent-purple-soft);
  --notice-border: var(--app-accent-purple-border);

  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 22px;
  color: var(--notice-color);
  background: var(--notice-background);
  border: 1px solid var(--notice-border);
  border-radius: 18px;
}

.app-notice-panel--purple {
  --notice-color: var(--app-accent-purple-text);
  --notice-background: var(--app-accent-purple-soft);
  --notice-border: var(--app-accent-purple-border);
}

.app-notice-panel--green {
  --notice-color: var(--app-accent-green-text);
  --notice-background: var(--app-accent-green-soft);
  --notice-border: var(--app-accent-green-border);
}

.app-notice-panel--amber {
  --notice-color: var(--app-accent-amber-text);
  --notice-background: var(--app-accent-amber-soft);
  --notice-border: var(--app-accent-amber-border);
}

.app-notice-panel--with-action {
  padding-inline-end: 64px;
}

.app-notice-panel__icon {
  flex: 0 0 auto;
  color: var(--notice-color);
}

.app-notice-panel__content {
  min-width: 0;
  flex: 1 1 auto;
}

.app-notice-panel__content h2 {
  margin: 0 0 5px;
  color: var(--app-text);
  font-size: 14px;
  font-weight: 750;
  line-height: 1.4;
}

.app-notice-panel__content :deep(p) {
  margin: 0;
  color: var(--app-text-muted);
  font-size: 12px;
  line-height: 1.55;
}

.app-notice-panel__content :deep(p + p) {
  margin-top: 3px;
}

.app-notice-panel__content :deep(small) {
  display: block;
  margin-top: 7px;
  color: var(--app-text-faint);
  font-size: 10px;
  line-height: 1.5;
}

.app-notice-panel__action {
  position: absolute;
  right: 14px;
  bottom: 14px;
}

[dir='rtl'] .app-notice-panel__action {
  right: auto;
  left: 14px;
}

@media (max-width: 520px) {
  .app-notice-panel {
    gap: 12px;
    padding: 17px;
  }

  .app-notice-panel--with-action {
    padding-inline-end: 54px;
  }

  .app-notice-panel__action {
    right: 9px;
    bottom: 9px;
  }

  [dir='rtl'] .app-notice-panel__action {
    right: auto;
    left: 9px;
  }
}
</style>
