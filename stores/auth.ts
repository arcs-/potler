import type { Selectable } from 'kysely'
import type { User } from '~/types/kysely'

export const useAuthStore = defineStore('user', {

  persist: true,

  state: () => ({
    user: null as null | Selectable<User>,
    family: null as null | Pick<Selectable<User>, 'id' | 'email' | 'name'>[],
  }),

  actions: {
    async update() {
      const req = await $fetch('/api/user/me')
      if (req?.user) {
        this.user = req.user
        this.family = req.family
      } else {
        this.user = null
        this.family = null
      }
    },
    async login(email: string, password: string) {
      const req = await $fetch('/api/user/login', {
        method: 'post',
        body: {
          email,
          password,
        },
      })
      if (req?.user) this.user = req.user
      else this.user = null
    },
    async logout() {
      await $fetch('/api/user/logout', { method: 'post' })
      this.user = null
      this.family = null
    },
  },
})
