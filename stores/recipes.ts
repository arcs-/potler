import type { Selectable } from 'kysely'
import type { Ingredient, Recipe } from '~/types/kysely'

export const useRecipesStore = defineStore('recipes', {

  persist: true,

  state: () => ({
    recipes: [] as Selectable<Recipe>[],
    progress: 0,
    suggestions: [] as Selectable<Recipe & { ingredients: Selectable<Ingredient>[] }>[],
    potentialMatches: [] as number[],
  }),

  actions: {
    async fetchAll() {
      const { recipes } = await $fetch('/api/recipe/all')
      this.recipes = recipes
    },
    async fetchSuggestions() {
      try {
        const { recipes } = await $fetch('/api/recipe/suggestions', {
          params: { position: 0 },
        })
        this.suggestions = recipes
        const { potentialMatches } = await $fetch('/api/recipe/potentialMatches')
        this.potentialMatches = potentialMatches.map(o => o.recipe_id)
      } catch (e) {
        console.error(e)
      }
    },
  },
})
