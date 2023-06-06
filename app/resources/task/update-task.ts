import { BadRequest } from '@curveball/http-errors';

import { taskTable } from '@infrastructure/dynamodb';

import { Event, Context, parseBodyJson } from '@app/helpers';
import { DynamoDB } from '@app/database';

import { validateTask } from './task-schema';

export default {
  path: 'PUT /task/{id}',
  name: 'update-task',
  lambda,
};

async function lambda(ev: Event, ctx: Context) {
  if (!ev.pathParameters?.id) {
    throw new BadRequest('Missing id');
  }

  // parse the body json to an object
  const json = parseBodyJson(ev);

  // shape the data and validate it
  const task = validateTask({
    id: ev.pathParameters.id,
    ...json,
  });

  // write the task to the database
  await DynamoDB.put(taskTable.name.get(), task);

  // return the updated task
  return task;
}
