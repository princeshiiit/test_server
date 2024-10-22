// app/Exceptions/TodoHandler.ts
import { HttpContext } from '@adonisjs/core/http';
import { Exception } from '@adonisjs/core/exceptions';

export default class TodoHandlerException extends Exception {
  public async handle(error: this, ctx: HttpContext) {
    // Handle validation errors
    console.log(JSON.stringify(error.message));

    // Handle model not found errors
    if (error.status === 404) {
      return ctx.response.status(404).json({
        errors: error,
        message: error.message,
      });
    }

    // Handle other exceptions
    return ctx.response.status(500).json({
      errors: error,
      message: error.message,
    });
  }
}
