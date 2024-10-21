// validators/TodoValidator.ts
import vine from '@vinejs/vine';

/**
 * Todo validation rules.
 */
export const createTodoValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(100),
    description: vine.string().trim().maxLength(100),
  })
);

export const updateTodoValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(100).optional(),
    description: vine.string().trim().maxLength(100).optional(),
  })
);
