import { destroySession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  destroySession(event)
})
