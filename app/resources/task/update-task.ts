import { BadRequest } from '@curveball/http-errors';

import { taskTable } from '@infrastructure/dynamodb';

import { Event, Context } from '@app/helpers';
import { DynamoDB } from '@app/database';
import { Task } from '@app/entities';

import { parseTaskInputJson } from './task-dto';

export default {
  path: 'PUT /task/{id}',
  name: 'update-task',
  lambda,
};

async function lambda(ev: Event, ctx: Context) {
  if (!ev.pathParameters?.id) {
    throw new BadRequest('Missing id');
  }

  const task = {
    id: ev.pathParameters.id,
    ...parseTaskInputJson(ev),
  };

  await DynamoDB.put<Task>(taskTable.name.get(), task);
  return task;
}
