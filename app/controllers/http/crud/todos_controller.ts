import type { HttpContext } from '@adonisjs/core/http';
import Todo from '#models/todo';
import RedisService from '#services/redis_service';

const redisService = new RedisService();

export default class TodosController {

  /**
   * Creates a new todo item in the database and in the Redis cache.
   * Returns the newly created todo item in JSON format with a 201 status.
   *
   * @param request - The HTTP request
   * @param response - The HTTP response
   *
   * @returns {Promise<void>} - A promise that resolves with no value
   */
  public async create({ request, response }: HttpContext) {
    const { title, description } = request.body();
    const todo = new Todo();
    todo.title = title;
    todo.description = description;
    await todo.save();
    await redisService.set(`todo:${todo.id}`, JSON.stringify(todo));
    return response.status(201).json(todo);
  }

  /**
   * Retrieves a single todo item by its ID from the Redis cache or from
   * the database if it doesn't exist in the cache. If the todo item doesn't
   * exist, returns a 404 status with a message. Otherwise, returns the
   * todo item in JSON format.
   *
   * @param params - The parameters containing the todo ID
   * @param response - The HTTP response
   *
   * @returns {Promise<void>} - A promise that resolves with no value
   */
  public async readById({ params, response }: HttpContext) {
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
   * Retrieves all todo items from the database. If they exist in the
   * Redis cache, return them from the cache. Otherwise, retrieve them
   * from the database and cache them.
   *
   * @param response - The HTTP response
   *
   * @returns {Promise<void>} - A promise that resolves with no value
   */
  public async readAll({ response }: HttpContext) {
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
   * Updates a todo item with the provided title and description.
   * If the todo item is not found, returns a 404 status with a message.
   * 
   * @param params - The parameters containing the todo ID
   * @param request - The HTTP request containing the new title and description
   * @param response - The HTTP response
   */
  public async update({ params, request, response }: HttpContext) {
    const todo = await Todo.find(params.id);
    if (!todo) {
      return response.status(404).json({ message: 'Todo not found' });
    }
    const { title, description } = request.body();
    todo.title = title;
    todo.description = description;
    await todo.save();
    await redisService.set(`todo:${todo.id}`, JSON.stringify(todo));
    return response.status(200).json(todo);
  }

  /**
   * Delete a todo item with the given id.
   *
   * @remarks
   * If the todo item does not exist, the response will be a 404 status code.
   * Otherwise, the response will be a 200 status code with a JSON message
   * indicating that the todo item was deleted successfully.
   */
  public async delete({ params, response }: HttpContext) {
    const todo = await Todo.find(params.id);
    if (!todo) {
      return response.status(404).json({ message: 'Todo not found' });
    }
    await todo.delete();
    await redisService.del(`todo:${todo.id}`);
    return response.status(200).json({ message: 'Todo deleted successfully' });
  }
}
