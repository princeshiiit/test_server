import type { HttpContext } from '@adonisjs/core/http';
import Todo from '#models/todo';
import RedisService from '#services/redis_service'; // Import your RedisService

const redisService = new RedisService(); // Create an instance of RedisService

export default class TodosController {
  public async create({ request, response }: HttpContext) {
    const { title, description } = request.body();
    const todo = new Todo();
    todo.title = title;
    todo.description = description;
    await todo.save();
    
    // Optionally, set the new todo in Redis
    await redisService.set(`todo:${todo.id}`, JSON.stringify(todo));

    return response.status(201).json(todo);
  }

  public async readById({ params, response }: HttpContext) {
    const cacheKey = `todo:${params.id}`;
    
    // Check Redis cache first
    let todo = await redisService.get(cacheKey);
    if (todo) {
      return response.status(200).json(JSON.parse(todo)); // Return cached data
    }

    // If not found in cache, fetch from the database
    todo = await Todo.find(params.id);
    if (!todo) {
      return response.status(404).json({ message: 'Todo not found' });
    }

    // Cache the retrieved todo
    await redisService.set(cacheKey, JSON.stringify(todo));
    
    return response.status(200).json(todo);
  }

  public async readAll({ response }: HttpContext) {
    const cacheKey = 'todos';

    // Check Redis cache for all todos
    let todos = await redisService.get(cacheKey);
    if (todos) {
      return response.status(200).json(JSON.parse(todos)); // Return cached data
    }

    // If not found in cache, fetch from the database
    todos = await Todo.all();

    // Cache the retrieved todos
    await redisService.set(cacheKey, JSON.stringify(todos));

    return response.status(200).json(todos);
  }

  public async update({ params, request, response }: HttpContext) {
    const todo = await Todo.find(params.id);
    if (!todo) {
      return response.status(404).json({ message: 'Todo not found' });
    }
    const { title, description } = request.body();
    todo.title = title;
    todo.description = description;
    await todo.save();

    // Update the cache
    await redisService.set(`todo:${todo.id}`, JSON.stringify(todo));

    return response.status(200).json(todo);
  }

  public async delete({ params, response }: HttpContext) {
    const todo = await Todo.find(params.id);
    if (!todo) {
      return response.status(404).json({ message: 'Todo not found' });
    }
    await todo.delete();

    // Remove the todo from cache
    await redisService.del(`todo:${todo.id}`);

    return response.status(200).json({ message: 'Todo deleted successfully' });
  }
}
