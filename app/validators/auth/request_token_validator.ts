import vine from '@vinejs/vine'

export const requestTokenValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(8).maxLength(32),
  })
)