<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const isOpen = ref(false)
const switcher = ref<HTMLElement | null>(null)

const currentLocale = computed(() =>
  locales.value.find(item => item.code === locale.value) ?? locales.value[0]
)

function localeLabel(code: string) {
  return code.slice(0, 3).toUpperCase()
}

async function selectLocale(code: string) {
  await setLocale(code)
  isOpen.value = false
}

function closeOnOutsideClick(event: MouseEvent) {
  if (switcher.value && !switcher.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeOnOutsideClick)
  document.addEventListener('keydown', closeOnEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnOutsideClick)
  document.removeEventListener('keydown', closeOnEscape)
})
</script>

<template>
  <div ref="switcher" class="language-switcher">
    <button
      class="language-indicator"
      type="button"
      aria-label="Change language"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      @click="isOpen = !isOpen"
    >
      <span class="language-indicator__code">{{ localeLabel(currentLocale?.code ?? locale) }}</span>
      <span class="language-indicator__name">{{ currentLocale?.name }}</span>
      <span class="language-indicator__chevron" aria-hidden="true">⌃</span>
    </button>

    <div v-if="isOpen" class="language-menu" role="menu">
      <button
        v-for="item in locales"
        :key="item.code"
        class="language-option"
        :class="{ 'language-option--selected': item.code === locale }"
        type="button"
        role="menuitemradio"
        :aria-checked="item.code === locale"
        @click="selectLocale(item.code)"
      >
        <span class="language-option__code">{{ localeLabel(item.code) }}</span>
        <span class="language-option__details">
          <span class="language-option__name">{{ item.name }}</span>
        </span>
        <span v-if="item.code === locale" class="language-option__check" aria-hidden="true">✓</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.language-switcher {
  position: relative;
  flex-shrink: 0;
}

.language-indicator,
.language-option {
  font: inherit;
}

.language-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  padding: 3px 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: #ddd;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.15s, border-color 0.15s;
}

.language-indicator:hover,
.language-indicator:focus-visible {
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.1);
  outline: none;
}

.language-indicator__code {
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.language-indicator__name {
  color: #aaa;
}

.language-indicator__chevron {
  color: #aaa;
  font-size: 14px;
  line-height: 1;
}

.language-menu {
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  width: 244px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 7px;
  background: rgba(35, 35, 35, 0.98);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  color: #eee;
  z-index: 1;
}

.language-menu__heading {
  padding: 5px 8px 7px;
  color: #999;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.language-option {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
  padding: 8px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
}

.language-option:hover,
.language-option:focus-visible,
.language-option--selected {
  background: rgba(190, 103, 190, 0.2);
  outline: none;
}

.language-option__code {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 4px;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
}

.language-option__details {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 2px;
}

.language-option__name {
  font-size: 13px;
}

.language-option__layout {
  color: #999;
  font-size: 11px;
}

.language-option__check {
  color: #d39bd3;
  font-size: 16px;
}

@media (max-width: 600px) {
  .language-indicator__name {
    display: none;
  }

  .language-menu {
    right: -4px;
  }
}
</style>
