<template>
  <div class="relative z-0 flex min-h-screen w-full flex-col overflow-hidden bg-repeat" :style="`background-image: url(${bg})`">
    <div class="absolute -left-32 -top-12 -z-10 h-32 w-[30rem] rotate-[-20deg] checkered shadow-md" />
    <StructNavigation />

    <NuxtPage class="flex grow flex-col" />

    <StructMenu v-if="auth.user" />
  </div>
</template>

<script setup lang="ts">
import bg from '~/assets/images/wood.png'

const auth = useAuthStore()
await auth.update()

useHead({
  title: 'Swish',
  link: [
    {
      rel: 'icon',
      href: '/favicon.png',
    },
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    },
  ],
})
</script>

<style lang="postcss" scoped>
.checkered {
  background-color: #FFE1D5;
  background-size: 64px 64px;
  background-position: 0 0, 32px 32px;
  background-image: linear-gradient(45deg, #E39879 25%, transparent 26%, transparent 75%, #E39879 75%, #E39879),
                    linear-gradient(45deg, #E39879 25%, transparent 26%, transparent 75%, #E39879 75%, #E39879);

}
</style>
