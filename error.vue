<template>
  <div>
    <NuxtErrorBoundary>
      <main class="mt-32 flex flex-1 flex-col items-center justify-center">
        <h1 class="mx-auto text-4xl font-bold">
          {{ error.statusCode }}
        </h1>
        <h2 class="mx-auto my-4 max-w-xl">
          {{
            props.error.statusCode === 404 ? $t('error.404') : $t('error.500')
          }}
        </h2>

        <!-- LINK -->
        <button
          type="button"
          :aria-label="$t('error.backToHomepage')"
          class="rounded-full bg-[#2563eb] px-7 py-2.5 font-medium text-white"
          @click="handleError('/')"
        >
          <I18nT tag="span" keypath="error.backToHomepage" />
        </button>

        <DevOnly>
          <div v-if="error" class="mb-32 mt-20 w-full">
            <div class="relative overflow-scroll bg-white p-8">
              <p class="rounded bg-[#ffb5b5] px-6 py-3 font-[system-ui] text-xl font-semibold">
                Error
              </p>

              <div class="mt-2 rounded bg-[#e5e7eb] p-6">
                <pre wrap>{{ error.message }}</pre>

                <p class="mt-4 inline-block rounded bg-white px-3 py-1 font-[system-ui] text-sm">
                  You might want to check your console log for more
                  information.
                </p>
              </div>

              <template v-if="error.statusCode === 500">
                <p class="mt-10 rounded bg-[#ffb5b5] px-6 py-3 font-[system-ui] text-xl font-semibold">
                  Stack
                </p>
                <div class="mt-2 overflow-auto rounded bg-[#e5e7eb] p-6">
                  <pre wrap v-html="error.stack" />
                </div>
              </template>
            </div>
          </div>
        </DevOnly>
      </main>
    </NuxtErrorBoundary>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: any
}>()
</script>
