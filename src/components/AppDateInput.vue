<template>
  <q-input
    v-model="typedValue"
    outlined
    hide-bottom-space
    inputmode="numeric"
    autocomplete="off"
    :dense="dense"
    :label="label"
    :placeholder="inputPlaceholder"
    :error="Boolean(errorMessage)"
    :error-message="errorMessage"
    @blur="commitTypedValue"
    @keyup.enter="commitTypedValue"
  >
    <template #append>
      <span
        class="app-date-input__trigger cursor-pointer"
        role="button"
        tabindex="0"
        :aria-label="t('datePicker.openCalendar')"
        @keyup.enter.stop="openPicker"
        @keyup.space.prevent.stop="openPicker"
      >
        <q-icon name="calendar_month" aria-hidden="true" />
        <q-popup-proxy
          ref="popupRef"
          class="app-picker-popup-shell"
          cover
          transition-show="scale"
          transition-hide="scale"
          @before-show="preparePicker"
        >
          <q-card class="app-date-input__popup">
            <q-date
              v-model="pickerValue"
              minimal
              :today-btn="!monthDayOnly"
              :class="{ 'app-date-input__date--month-day': monthDayOnly }"
              mask="YYYY/MM/DD"
              :first-day-of-week="0"
              :default-year-month="pickerDefaultYearMonth"
              :years-in-month-view="!monthDayOnly"
              :navigation-min-year-month="navigationMinYearMonth"
              :navigation-max-year-month="navigationMaxYearMonth"
              :options="dateIsAllowed"
              @update:model-value="selectPickerDate"
            />

            <q-card-actions align="right">
              <q-btn
                v-close-popup
                no-caps
                unelevated
                class="app-action app-action--primary"
                :label="t('datePicker.done')"
              />
            </q-card-actions>
          </q-card>
        </q-popup-proxy>
      </span>
    </template>
  </q-input>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  gregorianPartsToIso,
  isoToGregorianParts,
  localDateToIso,
} from 'src/utils/calendarTools';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
  dense: {
    type: Boolean,
    default: false,
  },
  monthDayOnly: {
    type: Boolean,
    default: false,
  },
  referenceYear: {
    type: Number,
    default: null,
  },
  minYear: {
    type: Number,
    default: 1,
  },
  maxYear: {
    type: Number,
    default: 9999,
  },
});

const emit = defineEmits(['update:modelValue']);
const { t, locale } = useI18n({ useScope: 'global' });
const popupRef = ref(null);
const monthComesFirst = computed(() => {
  const parts = new Intl.DateTimeFormat(locale.value, {
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  }).formatToParts(new Date(Date.UTC(2000, 7, 12)));
  return (
    parts.findIndex((part) => part.type === 'month') <
    parts.findIndex((part) => part.type === 'day')
  );
});
const effectiveReferenceYear = computed(() => {
  const requestedYear = Number(props.referenceYear);
  if (
    Number.isInteger(requestedYear) &&
    requestedYear >= props.minYear &&
    requestedYear <= props.maxYear
  ) {
    return requestedYear;
  }
  return new Date().getFullYear();
});
const inputPlaceholder = computed(() =>
  props.monthDayOnly ? (monthComesFirst.value ? 'MM/DD' : 'DD/MM') : 'YYYY/MM/DD',
);
const navigationMinYearMonth = computed(() =>
  props.monthDayOnly
    ? `${String(effectiveReferenceYear.value).padStart(4, '0')}/01`
    : `${String(props.minYear).padStart(4, '0')}/01`,
);
const navigationMaxYearMonth = computed(() =>
  props.monthDayOnly
    ? `${String(effectiveReferenceYear.value).padStart(4, '0')}/12`
    : `${String(props.maxYear).padStart(4, '0')}/12`,
);
const pickerDefaultYearMonth = computed(() => {
  const parts = isoToGregorianParts(props.modelValue);
  const year = props.monthDayOnly ? effectiveReferenceYear.value : parts?.year;
  const month = parts?.month || new Date().getMonth() + 1;
  return year
    ? `${String(year).padStart(4, '0')}/${String(month).padStart(2, '0')}`
    : undefined;
});
const typedValue = ref(isoToDisplay(props.modelValue));
const pickerValue = ref(toPickerValue(props.modelValue));
const errorMessage = ref('');

watch(
  [() => props.modelValue, monthComesFirst, effectiveReferenceYear],
  ([value]) => {
    const nextDisplay = isoToDisplay(value);
    if (typedValue.value !== nextDisplay) typedValue.value = nextDisplay;
    pickerValue.value = toPickerValue(value);
    errorMessage.value = '';
  },
);

function isoToDisplay(value) {
  const parts = isoToGregorianParts(value);
  if (!parts) return String(value || '');
  if (!props.monthDayOnly) return String(value).replace(/-/g, '/');

  const month = String(parts.month).padStart(2, '0');
  const day = String(parts.day).padStart(2, '0');
  return monthComesFirst.value ? `${month}/${day}` : `${day}/${month}`;
}

function toPickerValue(value) {
  const validValue = isoToGregorianParts(value) ? value : localDateToIso();
  const parts = isoToGregorianParts(validValue);
  const normalizedValue = props.monthDayOnly
    ? gregorianPartsToIso({
        year: effectiveReferenceYear.value,
        month: parts.month,
        day: parts.day,
      })
    : validValue;
  return normalizedValue ? String(normalizedValue).replace(/-/g, '/') : null;
}

function parseTypedDate(value) {
  if (props.monthDayOnly) {
    const match = /^(\d{1,2})[/-](\d{1,2})$/.exec(String(value || '').trim());
    if (!match) return null;

    const firstPart = Number(match[1]);
    const secondPart = Number(match[2]);
    const isoValue = gregorianPartsToIso({
      year: 2000,
      month: monthComesFirst.value ? firstPart : secondPart,
      day: monthComesFirst.value ? secondPart : firstPart,
    });
    return isoToGregorianParts(isoValue) ? isoValue : null;
  }

  const match = /^(\d{1,4})[/-](\d{1,2})[/-](\d{1,2})$/.exec(String(value || '').trim());
  if (!match) return null;

  const parts = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
  const isoValue = gregorianPartsToIso(parts);
  const validatedParts = isoToGregorianParts(isoValue);

  if (
    !validatedParts ||
    parts.year < props.minYear ||
    parts.year > props.maxYear
  ) {
    return null;
  }

  return isoValue;
}

function commitTypedValue() {
  const trimmedValue = typedValue.value.trim();
  if (!trimmedValue) {
    errorMessage.value = '';
    emit('update:modelValue', '');
    return;
  }

  const isoValue = parseTypedDate(trimmedValue);
  if (!isoValue) {
    errorMessage.value = props.monthDayOnly
      ? t('education.converter.invalid')
      : t('datePicker.invalidDate');
    return;
  }

  errorMessage.value = '';
  typedValue.value = isoToDisplay(isoValue);
  pickerValue.value = toPickerValue(isoValue);
  emit('update:modelValue', isoValue);
}

function preparePicker() {
  const typedIsoValue = parseTypedDate(typedValue.value);
  pickerValue.value = toPickerValue(typedIsoValue || props.modelValue);
}

function openPicker() {
  popupRef.value?.show();
}

function dateIsAllowed(date) {
  const year = Number(String(date).slice(0, 4));
  if (props.monthDayOnly) return year === effectiveReferenceYear.value;
  return year >= props.minYear && year <= props.maxYear;
}

function selectPickerDate(value) {
  const isoValue = String(value).replace(/\//g, '-');
  const selectedParts = isoToGregorianParts(isoValue);
  if (!selectedParts) return;

  const emittedValue = props.monthDayOnly
    ? gregorianPartsToIso({
        year: 2000,
        month: selectedParts.month,
        day: selectedParts.day,
      })
    : isoValue;

  typedValue.value = isoToDisplay(emittedValue);
  errorMessage.value = '';
  emit('update:modelValue', emittedValue);
}
</script>

<style scoped>
.app-date-input__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--app-text-muted);
}

.app-date-input__popup {
  width: min(360px, calc(100vw - 24px));
  overflow: hidden;
  border: 1px solid var(--app-border);
  border-radius: 20px;
  box-shadow: var(--app-card-shadow);
}

.app-date-input__popup .q-date {
  width: 100%;
  max-width: none;
  color: var(--app-text);
  background: var(--app-surface);
}

.app-date-input__date--month-day :deep(.q-date__navigation > :nth-child(n + 4)) {
  display: none;
}

.app-date-input__popup .q-card__actions {
  padding: 8px 14px 14px;
  border-top: 1px solid var(--app-border);
}
</style>
