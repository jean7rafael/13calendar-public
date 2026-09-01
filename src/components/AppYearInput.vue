<template>
  <q-input
    v-model="typedValue"
    outlined
    hide-bottom-space
    inputmode="numeric"
    autocomplete="off"
    :dense="dense"
    :label="label"
    :error="Boolean(errorMessage)"
    :error-message="errorMessage"
    @blur="commitTypedValue"
    @keyup.enter="commitTypedValue"
  >
    <template #append>
      <span
        class="app-year-input__trigger cursor-pointer"
        role="button"
        tabindex="0"
        :aria-label="t('datePicker.openYear')"
        @keyup.enter.stop="openPicker"
        @keyup.space.prevent.stop="openPicker"
      >
        <q-icon name="calendar_view_month" aria-hidden="true" />
        <q-popup-proxy
          ref="popupRef"
          class="app-picker-popup-shell"
          cover
          transition-show="scale"
          transition-hide="scale"
          @before-show="prepareYearPage"
        >
          <q-card class="app-year-input__popup app-no-double-tap" @dblclick.prevent>
            <header class="app-year-input__header">
              <q-btn
                flat
                round
                dense
                icon="chevron_left"
                :disable="!canShowPreviousPage"
                :aria-label="t('datePicker.previousYears')"
                @click="changePage(-YEAR_PAGE_INTERVAL)"
              />
              <strong>{{ visibleYears[0] }} – {{ visibleYears[visibleYears.length - 1] }}</strong>
              <q-btn
                flat
                round
                dense
                icon="chevron_right"
                :disable="!canShowNextPage"
                :aria-label="t('datePicker.nextYears')"
                @click="changePage(YEAR_PAGE_INTERVAL)"
              />
            </header>

            <div class="app-year-input__grid">
              <q-btn
                v-for="yearOption in visibleYears"
                :key="yearOption"
                v-close-popup
                flat
                no-caps
                class="year-selector-option"
                :class="{ 'app-year-input__option--selected': yearOption === numericValue }"
                :label="String(yearOption)"
                @click="selectYear(yearOption)"
              />
            </div>
          </q-card>
        </q-popup-proxy>
      </span>
    </template>
  </q-input>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const YEAR_PAGE_INTERVAL = 20;
const YEARS_PER_PAGE = YEAR_PAGE_INTERVAL + 1;

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  dense: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
    default: 1,
  },
  max: {
    type: Number,
    default: 9999,
  },
});

const emit = defineEmits(['update:modelValue']);
const { t } = useI18n({ useScope: 'global' });
const popupRef = ref(null);
const typedValue = ref(String(props.modelValue));
const pageStart = ref(getPageStart(props.modelValue));
const errorMessage = ref('');

const numericValue = computed(() => Number(props.modelValue));
const visibleYears = computed(() =>
  Array.from({ length: YEARS_PER_PAGE }, (_, index) => pageStart.value + index).filter(
    (year) => year >= props.min && year <= props.max,
  ),
);
const canShowPreviousPage = computed(() => pageStart.value > props.min);
const canShowNextPage = computed(
  () => pageStart.value + YEAR_PAGE_INTERVAL < props.max,
);

watch(
  () => props.modelValue,
  (value) => {
    typedValue.value = String(value);
    errorMessage.value = '';
  },
);

function getPageStart(value) {
  const numericYear = Number(value);
  const safeYear = Number.isInteger(numericYear) ? numericYear : new Date().getFullYear();
  const alignedYear = safeYear - (safeYear % YEAR_PAGE_INTERVAL);
  return Math.max(props.min, Math.min(alignedYear, Math.max(props.min, props.max - YEAR_PAGE_INTERVAL)));
}

function prepareYearPage() {
  pageStart.value = getPageStart(props.modelValue);
}

function openPicker() {
  popupRef.value?.show();
}

function commitTypedValue() {
  const numericYear = Number(typedValue.value);
  if (!Number.isInteger(numericYear) || numericYear < props.min || numericYear > props.max) {
    errorMessage.value = t('datePicker.invalidYear');
    return;
  }

  errorMessage.value = '';
  emit('update:modelValue', numericYear);
}

function changePage(offset) {
  pageStart.value = Math.max(
    props.min,
    Math.min(pageStart.value + offset, Math.max(props.min, props.max - YEAR_PAGE_INTERVAL)),
  );
}

function selectYear(year) {
  typedValue.value = String(year);
  errorMessage.value = '';
  emit('update:modelValue', year);
}
</script>

<style scoped>
.app-year-input__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--app-text-muted);
}

.app-year-input__popup {
  width: min(360px, calc(100vw - 24px));
  padding: 12px;
  border: 1px solid var(--app-border);
  border-radius: 20px;
  box-shadow: var(--app-card-shadow);
}

.app-year-input__header {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  margin-bottom: 8px;
  color: var(--app-text-muted);
  text-align: center;
}

.app-year-input__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
}

.app-year-input__grid .q-btn:not(.app-action) {
  min-height: 42px;
  border-radius: 8px;
  color: var(--app-text);
}

.app-year-input__grid .q-btn:hover {
  background: var(--calendar-cell-hover);
}

.app-year-input__grid .app-year-input__option--selected {
  color: white;
  background: var(--app-accent-purple-strong) !important;
}
</style>
