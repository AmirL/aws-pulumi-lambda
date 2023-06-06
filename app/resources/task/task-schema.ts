import { z } from 'zod';

// Validate task object and throw error if invalid, also define the type for the variable
export function validateTask(task: unknown) {
  return z
    .object({
      id: z.string().nonempty(),
      title: z.string().min(3).max(50),
      description: z.string().max(1000).default(''),
      completed: z.boolean().default(false),
    })
    .strict()
    .parse(task);
}
