import { findTaskById } from '@app/database/task-repository';

import { Event, Context } from '@app/helpers';
import { BadRequest, NotFound } from '@curveball/http-errors';

const path = 'GET /task/{id}';
const name = 'get-task';

export default {
  path: 'GET /task/{id}',
  name: 'get-task',
  lambda,
};

async function lambda(ev: Event, ctx: Context) {
  const { id } = getParams(ev);

  const task = await findTaskById(id);

  if (!task) {
    throw new NotFound('Task not found');
  }

  return task;
}

/**
 * Validates and returns the params from the event
 */
function getParams(ev: Event) {
  if (!ev.pathParameters?.id) {
    throw new BadRequest('Missing id');
  }

  return { id: ev.pathParameters.id };
}
