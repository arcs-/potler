<template>
  <div v-if="alternates.length > 1" class="relative flex items-start">
    <select
      class="flex appearance-none bg-transparent pr-4 text-sm uppercase outline-none ring-offset-0"
      :aria-label="$t('switch_language')"
      :value="currentLocale"
      @input="switchLanguage"
    >
      <option
        v-for="{ locale, url } in alternates"
        :key="url"
        class="uppercase"
      >
        {{ locale }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
const switchLocalePath = useSwitchLocalePath()
const { locale: currentLocale, locales } = useI18n()
const entry = inject(EntryInjectionKey)

type Alternate = {
  locale: string
  url?: string
}
const alternates = computed<Alternate[]>(() => {
  if (Array.isArray(entry?.value?.alternates)) {
    // We have an entry from statamic
    return entry.value.alternates.filter(e => !!e) as Alternate[]
  } else {
    // We do not have an entry from statamic, likely using nuxt pages instead, so we offer all available locales
    return locales.value.map((l) => {
      return {
        locale: l.code,
      }
    })
  }
})

const switchLanguage = (event: any) => {
  const selectedLocale = event.target.value

  if (Array.isArray(alternates.value) && alternates.value.length) {
    const url = alternates.value.find(a => a.locale === selectedLocale)?.url
    if (url) {
      return navigateTo(url)
    }
  }

  navigateTo(switchLocalePath(selectedLocale))
}
</script>
