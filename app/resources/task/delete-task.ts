import { BadRequest } from '@curveball/http-errors';
import { taskTable } from '@infrastructure/dynamodb';

import { Event, Context } from '@app/helpers';
import { DynamoDB } from '@app/database';

export default {
  path: 'DELETE /task/{id}',
  name: 'delete-task',
  lambda,
};

async function lambda(ev: Event, ctx: Context) {
  if (!ev.pathParameters?.id) {
    throw new BadRequest('Missing id');
  }

  const { id } = ev.pathParameters;

  return DynamoDB.delete(taskTable.name.get(), id);
}
