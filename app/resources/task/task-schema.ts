import { BadRequest } from '@curveball/http-errors';
import { z } from 'zod';

// Validate task input and throw error if invalid
export function validateInput(task: unknown) {
  return z
    .object({
      title: z.string().min(3).max(50),
      description: z.string().max(1000).default(''),
      completed: z.coerce.number().min(0).max(1),
    })
    .strict()
    .parse(task);
}

// Validate task object and define the type for the variable
export function validateTask(task: unknown) {
  return z
    .object({
      id: z.string().nonempty(),
      userId: z.string().nonempty(),
      title: z.string().nonempty(),
      description: z.string().default(''),
      completed: z.number().default(0),
      createdAt: z.string().nonempty(),
      updatedAt: z.string().nonempty(),
    })
    .parse(task);
}
