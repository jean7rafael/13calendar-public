<template>
  <q-input
    v-model="typedValue"
    outlined
    hide-bottom-space
    inputmode="numeric"
    autocomplete="off"
    :label="label"
    :placeholder="inputPlaceholder"
    :error="Boolean(errorMessage)"
    :error-message="errorMessage"
    @blur="commitTypedValue"
    @keyup.enter="commitTypedValue"
  >
    <template #append>
      <span
        class="app-fixed-date-input__trigger cursor-pointer"
        role="button"
        tabindex="0"
        :aria-label="t('datePicker.openCalendar')"
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
          @before-show="preparePicker"
        >
          <q-card class="app-fixed-date-input__popup">
            <header class="app-fixed-date-input__header">
              <q-btn
                flat
                round
                dense
                icon="chevron_left"
                :disable="pickerMonth <= 1"
                :aria-label="previousMonthLabel"
                @click="changeMonth(-1)"
              />
              <strong>{{ numberedMonthLabel }}</strong>
              <q-btn
                flat
                round
                dense
                icon="chevron_right"
                :disable="pickerMonth >= 13"
                :aria-label="nextMonthLabel"
                @click="changeMonth(1)"
              />
            </header>

            <div class="app-fixed-date-input__weekdays" role="row">
              <span v-for="weekday in weekdays" :key="weekday" role="columnheader">
                {{ weekday }}
              </span>
            </div>

            <div class="app-fixed-date-input__days" role="grid">
              <q-btn
                v-for="dayOption in 28"
                :key="dayOption"
                flat
                round
                dense
                class="selector-option"
                :class="{
                  'app-fixed-date-input__day--selected':
                    pickerMonth === selectedMonth && dayOption === selectedDay,
                }"
                :label="String(dayOption)"
                :aria-label="formatAccessibleDate(pickerMonth, dayOption)"
                @click="selectDay(dayOption)"
              />
            </div>

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

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  months: {
    type: Array,
    required: true,
  },
  weekdays: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);
const { t, locale } = useI18n({ useScope: 'global' });
const popupRef = ref(null);
const pickerMonth = ref(normalizeMonth(props.modelValue?.month));
const selectedMonth = ref(normalizeMonth(props.modelValue?.month));
const selectedDay = ref(normalizeDay(props.modelValue?.day));

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
const typedValue = ref(formatDisplay(selectedMonth.value, selectedDay.value));
const errorMessage = ref('');
const inputPlaceholder = computed(() => (monthComesFirst.value ? 'MM/DD' : 'DD/MM'));
const numberedMonthLabel = computed(
  () => `${pickerMonth.value}. ${props.months[pickerMonth.value - 1] || ''}`,
);
const previousMonthLabel = computed(
  () => props.months[pickerMonth.value - 2] || t('education.converter.month'),
);
const nextMonthLabel = computed(
  () => props.months[pickerMonth.value] || t('education.converter.month'),
);

watch(
  [() => props.modelValue?.month, () => props.modelValue?.day, monthComesFirst],
  ([month, day]) => {
    selectedMonth.value = normalizeMonth(month);
    selectedDay.value = normalizeDay(day);
    typedValue.value = formatDisplay(selectedMonth.value, selectedDay.value);
    errorMessage.value = '';
  },
);

function normalizeMonth(value) {
  const month = Number(value);
  return Number.isInteger(month) && month >= 1 && month <= 13 ? month : 1;
}

function normalizeDay(value) {
  const day = Number(value);
  return Number.isInteger(day) && day >= 1 && day <= 28 ? day : 1;
}

function formatDisplay(month, day) {
  const monthText = String(month).padStart(2, '0');
  const dayText = String(day).padStart(2, '0');
  return monthComesFirst.value ? `${monthText}/${dayText}` : `${dayText}/${monthText}`;
}

function parseTypedValue(value) {
  const match = /^(\d{1,2})[/-](\d{1,2})$/.exec(String(value || '').trim());
  if (!match) return null;

  const firstPart = Number(match[1]);
  const secondPart = Number(match[2]);
  const month = monthComesFirst.value ? firstPart : secondPart;
  const day = monthComesFirst.value ? secondPart : firstPart;

  if (month < 1 || month > 13 || day < 1 || day > 28) return null;
  return { month, day };
}

function emitDate(month, day) {
  selectedMonth.value = month;
  selectedDay.value = day;
  typedValue.value = formatDisplay(month, day);
  errorMessage.value = '';
  emit('update:modelValue', { month, day });
}

function commitTypedValue() {
  const parsed = parseTypedValue(typedValue.value);
  if (!parsed) {
    errorMessage.value = t('education.converter.invalid');
    return;
  }

  pickerMonth.value = parsed.month;
  emitDate(parsed.month, parsed.day);
}

function preparePicker() {
  const parsed = parseTypedValue(typedValue.value);
  pickerMonth.value = parsed?.month || selectedMonth.value;
}

function openPicker() {
  popupRef.value?.show();
}

function changeMonth(offset) {
  pickerMonth.value = Math.min(13, Math.max(1, pickerMonth.value + offset));
}

function selectDay(day) {
  emitDate(pickerMonth.value, day);
}

function formatAccessibleDate(month, day) {
  const monthLabel = props.months[month - 1] || String(month);
  return monthComesFirst.value ? `${monthLabel} ${day}` : `${day} ${monthLabel}`;
}
</script>

<style scoped>
.app-fixed-date-input__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--app-text-muted);
}

.app-fixed-date-input__popup {
  width: min(360px, calc(100vw - 24px));
  overflow: hidden;
  padding: 12px 12px 0;
  border: 1px solid var(--app-border);
  border-radius: 20px;
  box-shadow: var(--app-card-shadow);
}

.app-fixed-date-input__header {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 40px;
  align-items: center;
  margin-bottom: 8px;
  color: var(--app-text);
  text-align: center;
}

.app-fixed-date-input__header strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-fixed-date-input__weekdays,
.app-fixed-date-input__days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  justify-items: center;
}

.app-fixed-date-input__weekdays {
  padding: 6px 0;
  color: var(--app-text-faint);
  font-size: 11px;
  text-align: center;
}

.app-fixed-date-input__days {
  gap: 2px 0;
  padding: 4px 0 10px;
}

.app-fixed-date-input__days .q-btn {
  width: 36px;
  min-width: 36px;
  min-height: 36px;
  color: var(--app-text);
}

.app-fixed-date-input__days .q-btn:hover {
  background: var(--calendar-cell-hover);
}

.app-fixed-date-input__days .app-fixed-date-input__day--selected {
  color: white;
  background: var(--app-accent-purple-strong) !important;
}

.app-fixed-date-input__popup .q-card__actions {
  margin: 0 -12px;
  padding: 8px 14px 14px;
  border-top: 1px solid var(--app-border);
}
</style>
