<template>
  <UiContainer class="flex flex-col gap-6 py-8">
    <div class="rounded-md bg-white p-4 pb-8 shadow-xl graph-paper">
      <h2 class="mb-4 text-xl font-bold">
        Personalien
      </h2>

      <form
        ref="form"
        class="flex flex-col items-start gap-3"
        @submit.prevent="save"
      >
        <UiInput :model-value="auth.user!.name" name="name" />
        <UiInput :model-value="auth.user!.email" name="email" type="email" />
        <UiButton type="submit">
          Speichern
        </UiButton>
      </form>
    </div>

    <div class="rounded-md bg-white p-4 shadow-xl graph-paper">
      <h2 class="mb-4 text-xl font-bold">
        Familie
      </h2>

      <div
        v-for="member in auth.family"
        :key="member.id"
        class="mb-4 flex items-center gap-2"
      >
        <div
          class="
            flex size-10 items-center justify-center rounded-full border-2 border-black bg-white p-[5px]
            text-xl font-extrabold drop-shadow-md
          "
        >
          <Icon name="lucide:chef-hat" size="2.2rem" />
          <span class="absolute top-[8px] text-xs">{{ member.name[0] }}</span>
        </div>
        <div class="leading-4">
          {{ member.name }}<br>
          <span class="text-gray-500">{{ member.email }}</span>
        </div>
      </div>

      <UiButton class="mt-4" @click="leave()">
        Familie Verlassen
      </UiButton>
    </div>

    <div class="rounded-md bg-white p-4 shadow-xl graph-paper">
      <UiButton @click="logout">
        Abmelden
      </UiButton>
    </div>
  </UiContainer>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const router = useRouter()
const localePath = useLocalePath()

const form = ref()

async function save() {
  const formData = new FormData(form.value)
  const { user } = await $fetch('/api/user/update', {
    method: 'post',
    body: Object.fromEntries(formData),
  })
  auth.user = user
}

async function leave() {
  await $fetch('/api/user/update', {
    method: 'post',
    body: { family_id: auth.user!.id },
  })
  auth.update()
}

async function logout() {
  await auth.logout()
  await router.push(localePath({ name: 'index' }))
}
</script>
