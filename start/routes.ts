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
router.post('/login', '#controllers/http/auth/request_tokens_controller.handleRequestToken')

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
router.post('/register', '#controllers/http/auth/registers_controller.handleRegister')

router.group(() => {
  router.post('/create-todo', '#controllers/http/crud/todos_controller.create')
  router.get('/read-todo/:id', '#controllers/http/crud/todos_controller.readById')
  router.get('/browse-todo', '#controllers/http/crud/todos_controller.readAll')
  router.put('/update-todo/:id', '#controllers/http/crud/todos_controller.update')
  router.delete('/delete-todo/:id', '#controllers/http/crud/todos_controller.delete')
}).prefix('/todos').use(
  middleware.auth({
    guards: ['api'],
  })
)
