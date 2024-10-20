import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { requestTokenValidator } from '#validators/request_token_validator'

@inject()
export default class RequestTokenController {
  /**
   * The `handleRequestToken` method is used to issue a signed JWT token
   * for a user. The method verifies the user credentials using the
   * `User.verifyCredentials` method and then creates a new token using
   * `User.accessTokens.create` method.
   *
   * The response is a JSON response with the signed token and a success
   * status code.
   *
   * @remarks
   * The route is protected by the `auth_middleware` middleware, which
   * verifies the user credentials before allowing the request to
   * proceed.
   *
   * @param request - The HTTP request
   * @param response - The HTTP response
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
