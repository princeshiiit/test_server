import type { HttpContext } from '@adonisjs/core/http';
import Todo from '#models/todo';
import RedisService from '#services/redis_service';
import { createTodoValidator, updateTodoValidator } from '#validators/todo/todo_validator';

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
    
    let todo = await redisService.get(cacheKey);
    if (todo) {
      return response.status(200).json(JSON.parse(todo));
    }

    todo = await Todo.find(params.id);
    if (!todo) {
      return response.status(404).json({ message: 'Todo not found' });
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
      return response.status(404).json({ message: 'Todo not found' });
    }

    // Validate input
    const { title, description } = request.body();
    await updateTodoValidator.validate({ title, description });

    if (title) todo.title = title;
    if (description) todo.description = description;
    await todo.save();
    await redisService.set(`todo:${todo.id}`, JSON.stringify(todo));
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
      return response.status(404).json({ message: 'Todo not found' });
    }
    await todo.delete();
    await redisService.del(`todo:${todo.id}`);
    return response.status(200).json({ message: 'Todo deleted successfully' });
  }
}
