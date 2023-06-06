import { BadRequest, NotFound } from '@curveball/http-errors';
import { taskTable } from '@infrastructure/dynamodb';

import { Event, Context } from '@app/helpers';
import { DynamoDB } from '@app/database';
import { validateTask } from './task-schema';

export default {
  path: 'GET /task/{id}',
  name: 'get-task',
  lambda,
};

async function lambda(ev: Event, ctx: Context) {
  if (!ev.pathParameters?.id) {
    throw new BadRequest('Missing id');
  }

  const { id } = ev.pathParameters;

  // use class to define all fields, including optional ones, with default values
  const record = await DynamoDB.get(taskTable.name.get(), id);

  if (!record) {
    throw new NotFound('Task not found');
  }

  // shape the data, fill in defaults, and validate it
  return validateTask(record);
}
