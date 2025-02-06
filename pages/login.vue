<template>
  <UiContainer class="flex flex-col justify-center gap-6 pb-20">
    <div>
      <div class="mb-6 flex justify-between">
        <h2 class="mb-4 text-2xl font-bold">
          Anmelden
        </h2>
        <NuxtLinkLocale :to="{ name: 'register' }">
          <UiButton>
            Neu?
          </UiButton>
        </NuxtLinkLocale>
      </div>

      <form class="flex flex-col items-start gap-3" @submit.prevent="login">
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
          Login
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
  email: 'patrick@stillh.art',
  password: 'test',
})

async function login() {
  await auth.login(form.value.email, form.value.password)
  await router.push(localePath({ name: 'index' }))
}
</script>
