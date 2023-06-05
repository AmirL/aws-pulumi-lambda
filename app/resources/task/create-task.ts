import { createTask } from '@app/database/task-repository';

import { Event, Context } from '@app/helpers';
import { BadRequest } from '@curveball/http-errors';

export default {
  path: 'POST /task',
  name: 'create-task',
  lambda,
};

async function lambda(ev: Event, ctx: Context) {
  const input = getParams(ev);
  const task = await createTask(input);

  return { task };
}

function getParams(ev: Event) {
  let input;

  try {
    input = JSON.parse(ev.body ?? '');
  } catch (err) {}

  // todo use dto to validate input
  if (!input || !input.title || !input.description || typeof input.completed !== 'boolean') {
    throw new BadRequest('Please provide correct input');
  }
  return {
    title: input.title,
    description: input.description,
    completed: input.completed,
  };
}
