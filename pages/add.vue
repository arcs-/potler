<template>
  <UiContainer class="flex flex-col gap-6 py-8">
    <div class="rounded-md bg-white p-4 pb-8 shadow-xl graph-paper">
      <h2 class="mb-6 text-xl font-bold">
        {{ form.id ? 'Rezept bearbeiten' : 'Neues Rezept' }}
      </h2>

      <form class="flex flex-col items-start gap-2" autocomplete="off" @submit.prevent="save">
        <UiInput v-model="form.name" placeholder="Name" required />
        <UiInput v-model="form.description" placeholder="Beschreibung" textarea />

        <h3>Zutaten</h3>
        <div v-for="ingredient, index in form.ingredients" :key="index" class="flex gap-1">
          <UiInput v-model="ingredient.name" placeholder="Name" class="!w-3/5" />
          <UiInput v-model="ingredient.amount" placeholder="Menge" class="!w-2/5" />
        </div>

        <UiInput
          v-model="form.instructions"
          placeholder="Zubereitung"
          textarea
          class="mt-4"
        />

        <UiInput v-model="form.source" placeholder="Quelle" type="url" />

        <template v-if="! form.id">
          <UiButton type="submit" class="mt-4">
            Hinzufügen <Icon name="lucide:save" size="0.9rem" />
          </UiButton>
        </template>
        <div v-else class="flex w-full justify-end gap-1">
          <UiButton class="mt-4 border-transparent !bg-transparent text-red-700" @click="trash">
            Löschen <Icon name="lucide:trash" size="0.9rem" />
          </UiButton>
          <UiButton type="submit" class="mt-4">
            Speichern <Icon name="lucide:save" size="0.9rem" />
          </UiButton>
        </div>
      </form>
    </div>
  </UiContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

const form = ref({
  id: undefined as number | undefined,
  name: '',
  description: '',
  instructions: '',
  source: '',
  ingredients: [] as {
    id: number
    name: string
    amount: string
  }[],
})

if (route.query.id) {
  try {
    const base = await $fetch('/api/recipe/one', {
      params: { id: route.query.id },
    })
    form.value.id = base.id
    form.value.name = base.name
    if (base.description)form.value.description = base.description
    if (base.instructions)form.value.instructions = base.instructions
    if (base.source)form.value.source = base.source
    form.value.ingredients = base.ingredients
  } catch {
    // ignore error
  }
}

watch(() => form.value.ingredients, () => {
  const empty = form.value.ingredients.filter(o => !o.name).length
  if (empty === 0) {
    form.value.ingredients.push({
      id: Math.random(),
      name: '',
      amount: '',
    })
  }
}, {
  deep: true,
  immediate: true,
})

async function save() {
  const body = {
    ...form.value,
    ingredients: form.value.ingredients.filter(o => o.name),
  }

  if (form.value.id) {
    await $fetch('/api/recipe/update', {
      method: 'post',
      body,
    })
  } else {
    await $fetch('/api/recipe/add', {
      method: 'post',
      body,
    })
  }

  router.push(localePath({ name: 'index' }))
}

async function trash() {
  await $fetch('/api/recipe/delete', {
    method: 'delete',
    body: {
      id: form.value.id,
    },
  })
  await router.push(localePath({ name: 'index' }))
}
</script>
