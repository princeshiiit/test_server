import type { HttpContext } from '@adonisjs/core/http';
import Todo from '#models/todo';
import RedisService from '#services/redis_service';
import { createTodoValidator, updateTodoValidator } from '#validators/todo/todo_validator';
import TodoHandlerException from '#exceptions/todo_handler_exception';

const redisService = new RedisService();

/**
 * Controller for managing Todo items.
 */
export default class TodosController {
  /**
   * Creates a new Todo item in the database and in the Redis cache.
   * Returns the newly created Todo item in JSON format with a 201 status.
   *
   * @param {HttpContext} context - The HTTP context containing request and response objects.
   * @returns {Promise<void>} - A promise that resolves with no value.
   */
  public async create({ request, response }: HttpContext): Promise<void> {
    const { title, description } = request.body();

    // Validate input
    await createTodoValidator.validate({ title, description });
    const todo = new Todo();
    todo.title = title;
    todo.description = description;
    await todo.save();
    await redisService.set(`todo:${todo.id}`, JSON.stringify(todo));
    // update redis for readAll
    const todos = await Todo.all();
    await redisService.set('todos', JSON.stringify(todos));
    return response.status(201).json(todo);
  }

  /**
   * Retrieves a single Todo item by its ID from the Redis cache or from
   * the database if it doesn't exist in the cache.
   *
   * @param {HttpContext} context - The HTTP context containing params and response objects.
   * @returns {Promise<void>} - A promise that resolves with no value.
   */
  public async readById({ params, response }: HttpContext): Promise<void> {
    const cacheKey = `todo:${params.id}`;
    
    let todos = await redisService.get('todos');
    if (todos) {
      todos = JSON.parse(todos);
      const todo = todos.find((todo: any) => todo.id === params.id);
      if (todo) {
        return response.status(200).json(todo);
      }
    }

    const todo = await Todo.find(params.id);
    if (!todo) {
      throw new TodoHandlerException('Todo not found', { status: 404 });
    }

    await redisService.set(cacheKey, JSON.stringify(todo));
    return response.status(200).json(todo);
  }

  /**
   * Retrieves all Todo items from the database.
   * If they exist in the Redis cache, return them from the cache.
   * Otherwise, retrieve them from the database and cache them.
   *
   * @param {HttpContext} context - The HTTP context containing response object.
   * @returns {Promise<void>} - A promise that resolves with no value.
   */
  public async readAll({ response }: HttpContext): Promise<void> {
    const cacheKey = 'todos';

    let todos = await redisService.get(cacheKey);
    if (todos) {
      return response.status(200).json(JSON.parse(todos));
    }

    todos = await Todo.all();
    await redisService.set(cacheKey, JSON.stringify(todos));
    return response.status(200).json(todos);
  }

  /**
   * Updates a Todo item with the provided title and description.
   * If the Todo item is not found, returns a 404 status with a message.
   *
   * @param {HttpContext} context - The HTTP context containing params, request, and response objects.
   * @returns {Promise<void>} - A promise that resolves with no value.
   */
  public async update({ params, request, response }: HttpContext): Promise<void> {
    const todo = await Todo.find(params.id);
    if (!todo) {
      throw new TodoHandlerException('Todo not found', { status: 404 });
    }

    // Validate input
    const { title, description } = request.body();
    await updateTodoValidator.validate({ title, description });

    if (title) todo.title = title;
    if (description) todo.description = description;
    await todo.save();
    // update redis for readAll
    let todos = await redisService.get('todos');
    if (todos) {
      todos = JSON.parse(todos);
      const todoIndex = todos.findIndex((todo: any) => todo.id === todo.id);
      if (todoIndex !== -1) {
        todos[todoIndex] = todo;
        await redisService.set('todos', JSON.stringify(todos));
      }
    }
    return response.status(200).json(todo);
  }

  /**
   * Deletes a Todo item with the given ID.
   * If the Todo item does not exist, the response will be a 404 status code.
   *
   * @param {HttpContext} context - The HTTP context containing params and response objects.
   * @returns {Promise<void>} - A promise that resolves with no value.
   */
  public async delete({ params, response }: HttpContext): Promise<void> {
    const todo = await Todo.find(params.id);
    if (!todo) {
      throw new TodoHandlerException('Todo not found', { status: 404 });
    }
    await todo.delete();
    const todosCacheKey = 'todos';
    let todos = await redisService.get(todosCacheKey);
    if (todos) {
      todos = JSON.parse(todos);
      const todoIndex = todos.findIndex((todo: any) => todo.id === params.id);
      if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        await redisService.set(todosCacheKey, JSON.stringify(todos));
      } else {
        await redisService.del(todosCacheKey);
      }
    }
    return response.status(200).json({ message: 'Todo deleted successfully' });
  }
}
