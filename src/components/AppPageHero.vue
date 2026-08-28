<template>
  <section class="app-page-hero">
    <div class="app-page-hero__orbit" aria-hidden="true">
      <q-icon :name="icon" />
    </div>

    <p class="app-page-hero__eyebrow">{{ eyebrow }}</p>
    <h1>{{ title }}</h1>
    <p class="app-page-hero__description">{{ description }}</p>

    <slot></slot>
  </section>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  eyebrow: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
/* Abertura compartilhada de Calendários, Notícias e Comunidade. */
.app-page-hero {
  width: min(100%, 760px);
  margin: 20px auto 32px;
  text-align: center;
}

.app-page-hero__orbit {
  width: 78px;
  height: 78px;
  display: grid;
  place-items: center;
  margin: 0 auto 18px;
  color: white;
  background:
    radial-gradient(circle at 32% 24%, rgb(255 255 255 / 28%), transparent 28%),
    linear-gradient(
      135deg,
      var(--app-accent-purple-strong),
      var(--app-accent-purple)
    );
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 50%;
  box-shadow: 0 18px 44px rgb(79 70 229 / 26%);
  font-size: 34px;
}

.app-page-hero__eyebrow {
  margin: 0 0 10px;
  color: var(--app-accent-purple);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.app-page-hero h1 {
  margin: 0;
  color: var(--app-text);
  font-size: clamp(28px, 5vw, 48px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.04em;
}

.app-page-hero__description {
  max-width: 620px;
  margin: 18px auto 0;
  color: var(--app-text-muted);
  font-size: 16px;
  line-height: 1.65;
}

@media (max-width: 700px) {
  .app-page-hero {
    margin-top: 8px;
  }

  .app-page-hero__description {
    font-size: 14px;
  }
}
</style>
