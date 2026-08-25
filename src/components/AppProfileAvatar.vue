<template>
  <span
    class="app-profile-avatar"
    :style="{ '--app-profile-avatar-size': normalizedSize }"
    aria-hidden="true"
  >
    <img v-if="imageUrl" :src="imageUrl" alt="" />
    <span v-else>{{ initial }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue';

/* ===========================================================
   AVATAR ÚNICO DA INTERFACE

   A origem pode continuar quadrada. O recorte, a proporção e o
   fallback pertencem a este componente para nunca divergirem
   entre vitrine, moderação ou futuras telas comunitárias.
=========================================================== */

const props = defineProps({
  imageUrl: { type: String, default: '' },
  name: { type: String, default: '' },
  size: { type: [Number, String], default: 42 },
});

const normalizedSize = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : String(props.size),
);
const initial = computed(
  () => Array.from(String(props.name || '').trim())[0]?.toUpperCase() || '•',
);
</script>

<style scoped>
.app-profile-avatar {
  width: var(--app-profile-avatar-size);
  height: var(--app-profile-avatar-size);
  aspect-ratio: 1;
  flex: none;
  display: grid;
  place-items: center;
  overflow: hidden;
  color: white;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  border-radius: 50%;
  font-weight: 800;
}

.app-profile-avatar img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
  border-radius: inherit;
}
</style>
