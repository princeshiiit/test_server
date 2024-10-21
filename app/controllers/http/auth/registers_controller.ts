import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import { registerValidator } from '#validators/auth/register_validator'

export default class RegisterController {
  /**
   * Registers a new user with the given email and password.
   *
   * @remarks
   * The route is protected by the `auth_middleware` middleware, which
   * verifies the user credentials before allowing the request to
   * proceed.
   *
   * @param request - The HTTP request
   * @param response - The HTTP response
   *
   * @returns {Promise<void>} - A promise that resolves with no value
   */
  async handleRegister({ request, response }: HttpContext): Promise<void> {
    const payload = await request.validateUsing(registerValidator)

    const user = new User()

    user.fullName = payload.fullName
    user.email = payload.email
    user.password = payload.password

    await user.save()

    return response.status(200).json({
      status: 'success',
      message: 'user registered successfully',
      data: user,
      meta: null,
    })
  }
}

