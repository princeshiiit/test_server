/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'Im alive',
  }
})

/**
 * Login route
 *
 * @remarks
 * This route is used to generate a signed JWT token for a user.
 *
 * @param email - The user's email
 * @param password - The user's password
 *
 * @returns {object} - The signed JWT token
 */
router.post('/request-token', async (ctx) => {
  const { default: RequestTokenController } = await import(
    '#controllers/http/auth/request_tokens_controller'
  )
  return new RequestTokenController().handleRequestToken(ctx)
})

/**
 * Register route
 *
 * @remarks
 * This route is used to register a new user.
 *
 * @param fullName - The user's full name
 * @param email - The user's email
 * @param password - The user's password
 *
 * @returns {object} - The newly created user
 */
router.post('/register', async (ctx) => {
  const { default: RegisterController } = await import(
    '#controllers/http/auth/registers_controller'
  )
  return new RegisterController().handleRegister(ctx)
})

router.group(() => {
  router.post('/create-todo', async (ctx) => {
    const { default: TodosController } = await import(
      '#controllers/http/crud/todos_controller'
    )
    return new TodosController().create(ctx)
  })
  router.get('/read-todo/:id', async (ctx) => {
    const { default: TodosController } = await import(
      '#controllers/http/crud/todos_controller'
    )
    return new TodosController().readById(ctx)
  })
  router.get('/browse-todo', async (ctx) => {
    const { default: TodosController } = await import(
      '#controllers/http/crud/todos_controller'
    )
    return new TodosController().readAll(ctx)
  })
  router.put('/update-todo/:id', async (ctx) => {
    const { default: TodosController } = await import(
      '#controllers/http/crud/todos_controller'
    )
    return new TodosController().update(ctx)
  })
  router.delete('/delete-todo/:id', async (ctx) => {
    const { default: TodosController } = await import(
      '#controllers/http/crud/todos_controller'
    )
    return new TodosController().delete(ctx)
  })
}).prefix('/todos').use(
  middleware.auth({
    guards: ['api'],
  })
)
