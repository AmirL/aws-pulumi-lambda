import { BadRequest } from '@curveball/http-errors';
import { z } from 'zod';

import { Event, Context } from '@app/helpers';

// Validate input and throw error if invalid, also define the type of the input
export function parseTaskInputJson(ev: Event) {
  let input: unknown;

  try {
    input = JSON.parse(ev.body ?? '');
  } catch (err) {
    throw new BadRequest('Error parsing JSON input');
  }

  // validate input and throw error if invalid
  const parsed = z
    .object({
      title: z.string().min(3).max(50),
      description: z.string().max(1000),
      completed: z.boolean(),
    })
    .strict()
    .parse(input);

  return parsed;
}
