import { BadRequest } from '@curveball/http-errors';
import { taskTable } from '@infrastructure/dynamodb';

import { Event, Context } from '@app/helpers';
import DynamoDB from '@app/helpers/dynamodb';

export async function deleteTask(ev: Event, ctx: Context, userId: string) {
  if (!ev.pathParameters?.id) {
    throw new BadRequest('Missing id');
  }

  const { id } = ev.pathParameters;

  return DynamoDB.delete(taskTable.name.get(), { id, userId });
}
