<template>
  <UiContainer class="flex flex-col justify-center gap-6 pb-20">
    <div class="">
      <h2 class="mb-4 text-2xl font-bold">
        Registrieren
      </h2>

      <form class="flex flex-col items-start gap-3" @submit.prevent="register">
        <UiInput
          v-model="form.name"
          placeholder="Name"
          required
        />
        <UiInput
          v-model="form.email"
          placeholder="E-Mail"
          required
          type="email"
        />
        <UiInput
          v-model="form.password"
          placeholder="Passwort"
          type="password"
          required
        />
        <UiButton type="submit" class="ml-auto">
          Registrieren
        </UiButton>
      </form>
    </div>
  </UiContainer>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const router = useRouter()
const localePath = useLocalePath()

if (auth.user) router.push(localePath({ name: 'index' }))

const form = ref({
  name: '',
  email: '',
  password: '',
})

async function register() {
  const req = await $fetch('/api/user/register', {
    method: 'post',
    body: form.value,
  })
  auth.user = req.user
  await router.push(localePath({ name: 'index' }))
}
</script>
