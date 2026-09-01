<template>
  <!-- O card mede a própria largura e sempre deixa o conteúdo definir a altura.
       Assim Safari, PWA instalada e navegadores comuns seguem o mesmo contrato. -->
  <article
    class="education-content-card"
    :class="[
      `education-content-card--${tone}`,
      `education-content-card--${variant}`,
    ]"
  >
    <div class="education-content-card__layout">
      <q-icon :name="icon" aria-hidden="true" />
      <div class="education-content-card__body">
        <h3 v-if="title">{{ title }}</h3>
        <p>{{ text }}</p>
        <strong v-if="detail">{{ detail }}</strong>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  tone: {
    type: String,
    default: 'purple',
    validator: (value) => ['purple', 'green', 'pink', 'amber'].includes(value),
  },
  variant: {
    type: String,
    default: 'stacked',
    validator: (value) => ['compact', 'stacked', 'inline'].includes(value),
  },
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.education-content-card {
  --content-card-color: var(--app-accent-purple-text);
  --content-card-soft: var(--app-accent-purple-soft);
  --content-card-border: var(--app-accent-purple-border);
  --content-card-padding: clamp(22px, 3vw, 30px);
  --content-card-soft-weight: 78%;

  container: education-content-card / inline-size;
  box-sizing: border-box;
  min-width: 0;
  min-height: var(--content-card-min-height, 0px);
  height: auto !important;
  max-height: none;
  display: flex;
  align-self: stretch;
  padding: var(--content-card-padding);
  color: var(--content-card-color);
  background: color-mix(
    in srgb,
    var(--content-card-soft) var(--content-card-soft-weight),
    var(--app-surface)
  );
  border: 1px solid var(--content-card-border);
  border-radius: 20px;
  overflow: visible;
}

.education-content-card--green {
  --content-card-color: var(--app-accent-green-text);
  --content-card-soft: var(--app-accent-green-soft);
  --content-card-border: var(--app-accent-green-border);
}

.education-content-card--pink {
  --content-card-color: var(--calendar-sunday-text);
  --content-card-soft: var(--calendar-sunday-cell);
  --content-card-border: color-mix(in srgb, var(--calendar-sunday-text) 34%, transparent);
}

.education-content-card--amber {
  --content-card-color: var(--app-accent-amber-text);
  --content-card-soft: var(--app-accent-amber-soft);
  --content-card-border: var(--app-accent-amber-border);
}

.education-content-card__layout,
.education-content-card__body {
  min-width: 0;
}

.education-content-card__layout {
  width: 100%;
  flex: 1 1 auto;
}

.education-content-card__body {
  display: flex;
  flex-direction: column;
}

.education-content-card :is(h3, p, strong) {
  overflow-wrap: break-word;
  word-break: normal;
}

.education-content-card h3 {
  margin: 0 0 9px;
  color: var(--content-card-color);
  font-size: 22px;
  line-height: 1.2;
}

.education-content-card p {
  margin: 0;
  color: var(--app-text-muted);
  font-size: 14px;
  line-height: 1.65;
}

.education-content-card strong {
  margin-top: auto;
  padding-top: 18px;
  color: var(--content-card-color);
  font-size: 12px;
  line-height: 1.45;
}

.education-content-card--compact {
  --content-card-padding: 22px;
  --content-card-soft-weight: 72%;
}

.education-content-card--compact .education-content-card__layout,
.education-content-card--stacked .education-content-card__layout {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.education-content-card--stacked .education-content-card__body {
  flex: 1 1 auto;
}

.education-content-card--compact .q-icon,
.education-content-card--stacked .q-icon {
  flex: none;
  color: var(--content-card-color);
  font-size: 28px;
}

.education-content-card--compact p {
  font-size: 13px;
  line-height: 1.6;
}

.education-content-card--inline {
  --content-card-padding: clamp(22px, 3vw, 28px);
}

.education-content-card--inline .education-content-card__layout {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: 16px;
}

.education-content-card--inline .q-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  color: var(--content-card-color);
  background: color-mix(in srgb, var(--content-card-soft) 80%, transparent);
  border: 1px solid var(--content-card-border);
  border-radius: 13px;
  font-size: 23px;
}

.education-content-card--inline h3 {
  margin-top: 1px;
  font-size: 21px;
}

/* O breakpoint pertence ao card, não à janela. Isso cobre inclusive a PWA
   instalada quando sua largura visual diverge do viewport informado pelo WebKit. */
@container education-content-card (max-width: 330px) {
  .education-content-card--inline .education-content-card__layout {
    grid-template-columns: 1fr;
  }
}
</style>
