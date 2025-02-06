<template>
  <UiContainer class="flex flex-col gap-6 py-8">
    <div class="rounded-md bg-white p-4 shadow-xl graph-paper">
      <h2 class="mb-4 text-2xl font-bold">
        Likes
      </h2>

      <ul>
        <li
          v-for="recipe, index in recipes"
          :key="recipe.id"
          class="truncate rounded px-2 py-1 text-lg odd:bg-slate-300/50"
        >
          <NuxtLinkLocale :to="{ name: 'add', query: { id: recipe.id } }">
            {{ index + 1 }}. {{ recipe.name }}
          </NuxtLinkLocale>
        </li>
      </ul>
    </div>
  </UiContainer>
</template>

<script setup lang="ts">
const auth = useAuthStore()

const recipes = asyncComputed(async () => {
  if (!auth.user) return []

  try {
    const { recipes } = await $fetch('/api/recipe/all')
    return recipes
  } catch (e) {
    console.error(e)
    return []
  }
})
</script>
