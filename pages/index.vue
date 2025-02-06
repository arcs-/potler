<template>
  <UiContainer>
    <h2 class="text-4xl font-bold">
      Heute
    </h2>

    <ul class="flex grow items-center justify-center">
      <li
        v-for="entry, index in cards"
        :key="index"
        ref="cardsElements"
        class="absolute w-[90%] max-w-[25rem]"
        :style="{ zIndex: size - entry.index.value }"
      >
        <UiRecipe
          :recipe="entry.recipe"
          :class="{
            'transition': !fullscreen,
            'pointer-events-none': entry.index.value !== 0,
            'translate-x-[-4px] rotate-1': entry.index.value === 2,
            'translate-x-[4px] -rotate-2': entry.index.value === 1,
            '!border-green-500': state === 'match' && entry.index.value === 0,
          }"
          @fullscreen="full => toggleFullscreen(full, index)"
        />
        <div
          v-if="state && entry.index.value === 0"
          class="absolute left-0 top-0 flex size-full items-center justify-center"
        >
          <div
            class="absolute left-0 top-0 size-full rounded"
            :class="{
              'bg-red-300': state === 'throw',
              'bg-green-300': state === 'like',
            }"
            :style="{ opacity: stateConfidence * .8 }"
          />
          <Icon
            v-if="state === 'like'"
            name="lucide:cooking-pot"
            size="5rem"
            class="text-green-500"
            :style="{ opacity: stateConfidence }"
          />
          <Icon
            v-else-if="state === 'throw'"
            name="lucide:x"
            size="5rem"
            class="text-red-500"
            :style="{ opacity: stateConfidence }"
          />
        </div>
      </li>
    </ul>
  </UiContainer>
</template>

<script setup lang="ts">
// @ts-expect-error lib has no types
import Swing from '@brugarolas/swing'
import JSConfetti from 'js-confetti'

const store = useRecipesStore()
await store.fetchSuggestions()

let swing: Swing.Stack
let confetti: JSConfetti

const size = 3

const cards = store.suggestions
  .slice(store.progress, store.progress + size)
  .map((recipe, index) => ({
    recipe: ref(recipe),
    index: ref(index),
  }))

const fullscreen = ref(false)
const cardsElements = ref<HTMLAnchorElement[]>([])
const state = ref<null | 'like' | 'throw' | 'match'>(null)
const stateConfidence = ref(0)

onMounted(() => {
  swing = Swing.Stack({
    throwOutConfidence: (xOffset: number, yOffset: number, element: HTMLElement) => {
      const boost = 3
      const xConfidence = Math.min((Math.abs(xOffset) / element.offsetWidth) * boost, 1)
      const yConfidence = Math.min((Math.abs(yOffset) / element.offsetHeight) * boost, 1)
      return Math.max(xConfidence, yConfidence)
    },
  })
  cardsElements.value.forEach(el => swing.createCard(el))
  swing.on('dragmove', onDragMove)
  swing.on('dragend', onDragEnd)
  swing.on('throwout', onThrowOut)

  confetti = new JSConfetti()
})

function onDragMove(event: any) {
  stateConfidence.value = event.throwOutConfidence
  if (event.throwDirection === Swing.Direction.RIGHT) state.value = 'like'
  else if (event.throwDirection === Swing.Direction.LEFT) state.value = 'throw'
  else state.value = null
}

function onDragEnd() {
  if (state.value === 'match') return
  state.value = null
}

function onThrowOut(event: any) {
  // on like
  if (event.throwDirection === Swing.Direction.RIGHT) {
    const liked = cards.find(o => o.index.value === 0)!
    $fetch('/api/recipe/like', {
      method: 'post',
      body: { ids: [liked.recipe.value.id] },
    })

    // yay, match!
    if (store.potentialMatches.includes(liked.recipe.value.id)) {
      confetti.addConfetti({ confettiColors: ['#FCC954', '#A24522', '#6B9139', '#3E6529', '#B67830'] })
      state.value = 'match'
      const style = window.getComputedStyle(event.target)
      const matrix = new WebKitCSSMatrix(style.transform)
      swing.getCard(event.target).throwIn(matrix.m41, matrix.m42)
      return
    }
  }

  store.progress = (store.progress + 1) % store.suggestions.length
  const next = store.suggestions[(store.progress + size - 1) % store.suggestions.length]
  cards.forEach((entry) => {
    entry.index.value = (size + (entry.index.value - 1)) % size
    if (entry.index.value === 2) entry.recipe.value = next
  })
  swing.getCard(event.target).throwIn(0, 0)
}

function toggleFullscreen(state: boolean, index: number) {
  fullscreen.value = state
  const current = cardsElements.value[index]
  if (state) {
    const card = swing.getCard(current)
    card.destroy()
    current.style.transform = ''
  } else {
    swing.createCard(current)
  }
}

onUnmounted(() => {
  swing.destroyAll()
  confetti.destroyCanvas()
})
</script>
