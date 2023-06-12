import { BadRequest, NotFound, Unauthorized } from '@curveball/http-errors';
import { taskTable } from '@infrastructure/dynamodb';

import { Event, Context } from '@app/helpers';
import DynamoDB from '@app/helpers/dynamodb';
import { validateTask } from './task-schema';

export async function getAllTasks(ev: Event, ctx: Context, userId: string) {
  const record = await DynamoDB.query(taskTable.name.get(), 'userId = :userId', { ':userId': userId });

  const items = record.Items ?? [];

  const tasks = items.map((item) => validateTask(item));

  return tasks;
}
