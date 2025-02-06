<template>
  <UiContainer
    tag="nav"
    class="relative flex w-full justify-between p-4 pb-0"
    role="navigation"
  >
    <NuxtLinkLocale
      :to="{ name: 'index' }"
      class="
        -ml-2 flex h-9 items-center gap-2 rounded-xl border-3 border-lime-200 bg-lime-50 px-3 text-lg
        font-medium tracking-wider text-black drop-shadow-md
      "
    >
      Swish <Icon name="lucide:utensils" size="1rem" />
    </NuxtLinkLocale>

    <div v-if="!auth.user">
      <NuxtLinkLocale
        class="
          flex size-12 items-center justify-center rounded-full border-2 border-black bg-white p-[5px] text-xl
          font-extrabold drop-shadow-md graph-paper
        "
        :to="{ name: 'login' }"
      >
        <Icon name="lucide:chef-hat" size="2.2rem" />
      </NuxtLinkLocale>
    </div>
    <div v-else>
      <NuxtLinkLocale
        :to="{ name: 'account' }"
        class="
          flex size-11 items-center justify-center rounded-full border-3 border-black bg-gray-200 p-[4px]
          text-xl font-extrabold drop-shadow-md transition graph-paper
        "
        active-class="bg-white scale-110"
      >
        <Icon name="lucide:chef-hat" size="2.2rem" />
        <span class="absolute top-[10px] text-xs">{{ auth.user.name[0] }}</span>
      </nuxtlinklocale>
    </div>
  </UiContainer>
</template>

<script lang="ts" setup>
const auth = useAuthStore()
</script>
