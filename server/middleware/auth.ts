import { getSessionUser } from '~/server/utils/auth'

const WHITELIST = [
  '/api/user/me',
  '/api/user/login',
  '/api/user/register',
  '/api/recipe/suggestions',
]

export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  if (!url.pathname.startsWith('/api/')) return

  const user = getSessionUser(event)
  event.context.auth = user

  if (WHITELIST.includes(url.pathname)) {
    return
  }

  if (!user) {
    throw new Error('Not authenticated')
  }
})
