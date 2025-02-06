<template>
  <UiContainer tag="footer" class="flex w-full justify-between pb-8">
    <menu class="flex w-full justify-between px-14 drop-shadow-md">
      <li>
        <NuxtLinkLocale
          :to="{ name: 'likes' }"
          class="flex rounded-full border-3 border-black bg-gray-200 p-2 transition graph-paper"
          active-class="bg-white scale-110"
        >
          <Icon name="lucide:library-big" size="1.8rem" />
        </NuxtLinkLocale>
      </li>
      <li>
        <NuxtLinkLocale
          :to="{ name: 'index' }"
          class="flex rounded-full border-3 border-black bg-gray-200 p-2 transition graph-paper"
          active-class="bg-white scale-110"
        >
          <Icon name="lucide:cooking-pot" size="1.8rem" />
        </NuxtLinkLocale>
      </li>
      <li>
        <NuxtLinkLocale
          :to="{ name: 'add' }"
          class="flex rounded-full border-3 border-black bg-gray-200 p-2 transition graph-paper"
          active-class="bg-white scale-110"
        >
          <Icon name="lucide:book-plus" size="1.8rem" />
        </NuxtLinkLocale>
      </li>
    </menu>
  </UiContainer>
</template>
