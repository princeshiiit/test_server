import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { requestTokenValidator } from '#validators/request_token_validator'

@inject()
export default class RequestTokenController {

  /**
   * Issues a signed JWT token for a user given their email and password.
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
  async handleRequestToken({ request, response }: HttpContext): Promise<void> {
    const { email, password } = await request.validateUsing(requestTokenValidator)
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    response.status(200).json({
      status: 'success',
      message: 'token issued successfully',
      data: token,
      meta: null,
    })
  }
}
