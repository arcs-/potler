<!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<template>
  <a
    ref="container"
    class="flex flex-col rounded border-5 bg-white graph-paper border-white p-2 shadow-2xl"
    :class="{
      'relative h-[max(65vh,25rem)] overflow-hidden': !fullscreen,
      'fixed inset-2 z-30 overflow-auto': fullscreen,
    }"
    @click="toggleFullscreen"
  >

    <h2 class="mb-8 text-2xl font-bold">
      <button type="button" class="float-right" @click="like">
        <Icon name="lucide:heart" size="1.5rem" />
      </button>
      {{ recipe.name }}
    </h2>

    <table class="w-full">
      <tbody>
        <tr
          v-for="ingrediant in recipe.ingredients"
          :key="ingrediant.id"
          class="text-lg odd:bg-slate-300/50"
        >
          <td class="pl-2">
            {{ ingrediant.name }}
          </td>
          <td class="whitespace-nowrap px-2 text-right">
            {{ ingrediant.amount }}
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="recipe.description" class="mt-8">
      {{ recipe.description }}
    </p>

    <div v-if="recipe.source" class="mt-8">
      <a :href="recipe.source" aria-label="Rezept" target="_blank">
        <UiButton class="inline-flex items-center gap-3">
          Rezept <Icon name="lucide:external-link" size="0.9rem" />
        </UiButton>
      </a>
    </div>

    <Transition name="fade">
      <div v-if="fullscreen" class="mt-auto">
        <NuxtLinkLocale :to="{ name: 'add', query: { id: recipe.id } }" @click.stop>
          <UiButton class="flex items-center gap-3">
            Bearbeiten <Icon name="lucide:pencil" size="0.9rem" />
          </UiButton>
        </NuxtLinkLocale>
      </div>
    </Transition>
  </a>
</template>

<script setup lang="ts">
import type { Selectable } from 'kysely'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import type { Ingredient, Recipe } from '~/types/kysely'

gsap.registerPlugin(Flip)

const props = defineProps<{
  recipe: Ref<Selectable<Recipe> & { ingredients: Selectable<Ingredient>[] }>
}>()
const emit = defineEmits<{
  like: []
  fullscreen: [boolean]
}>()

const fullscreen = ref(false)
const container = ref<HTMLElement>()
const recipe = computed(() => props.recipe.value)

async function toggleFullscreen() {
  const state = Flip.getState(container.value!)
  fullscreen.value = !fullscreen.value
  if (fullscreen.value) emit('fullscreen', true)
  await nextTick()
  Flip.from(state, {
    absolute: true,
    zIndex: 30,
    duration: 0.2,
    ease: 'power1.inOut',
    onComplete: () => {
      if (!fullscreen.value) setTimeout(() => emit('fullscreen', false), 10)
    },
  })
}

async function like() {
  await $fetch('/api/recipe/like', {
    method: 'post',
    body: {
      ids: [recipe.value.id],
    },
  })
  emit('like')
}
</script>
