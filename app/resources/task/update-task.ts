import { BadRequest } from '@curveball/http-errors';

import { taskTable } from '@infrastructure/dynamodb';

import { Event, Context, parseBodyJson } from '@app/helpers';
import DynamoDB from '@app/helpers/dynamodb';

import { validateInput, validateTask } from './task-schema';

export default {
  path: 'PUT /task/{id}',
  name: 'update-task',
  lambda,
};

async function lambda(ev: Event, ctx: Context, userId: string) {
  if (!ev.pathParameters?.id) {
    throw new BadRequest('Missing id');
  }

  const { id } = ev.pathParameters;

  // parse the body json to an object
  const json = parseBodyJson(ev);

  // shape the data and validate it
  const input = {
    ...validateInput(json),
    updatedAt: new Date().toISOString(),
  };

  // write the task to the database
  const result = await DynamoDB.update(taskTable.name.get(), input, { id, userId });

  // return the updated task, and fill in defaults if needed
  return validateTask(result.Attributes);
}
