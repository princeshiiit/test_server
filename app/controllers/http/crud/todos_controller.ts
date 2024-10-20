import type { HttpContext } from '@adonisjs/core/http'
import Todo from '#models/todo'

export default class TodosController {
  public async create({ request, response }: HttpContext) {
    const { title, description } = request.body()
    const todo = new Todo()
    todo.title = title
    todo.description = description
    await todo.save()
    return response.status(201).json(todo)
  }

  public async readById({ params, response }: HttpContext) {
    const todo = await Todo.find(params.id)
    if (!todo) {
      return response.status(404).json({ message: 'Todo not found' })
    }
    return response.status(200).json(todo)
  }

  public async readAll({ response }: HttpContext) {
    const todos = await Todo.all()
    return response.status(200).json(todos)
  }

  public async update({ params, request, response }: HttpContext) {
    const todo = await Todo.find(params.id)
    if (!todo) {
      return response.status(404).json({ message: 'Todo not found' })
    }
    const { title, description } = request.body()
    todo.title = title
    todo.description = description
    await todo.save()
    return response.status(200).json(todo)
  }

  public async delete({ params, response }: HttpContext) {
    const todo = await Todo.find(params.id)
    if (!todo) {
      return response.status(404).json({ message: 'Todo not found' })
    }
    await todo.delete()
    return response.status(200).json({ message: 'Todo deleted successfully' })
  }
}
