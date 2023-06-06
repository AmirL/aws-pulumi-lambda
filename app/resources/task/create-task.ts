import { taskTable } from '@infrastructure/dynamodb';

import { Event, Context } from '@app/helpers';
import { DynamoDB } from '@app/database';
import { Task } from '@app/entities';

import { parseTaskInputJson } from './task-dto';

export default {
  path: 'POST /task',
  name: 'create-task',
  lambda,
};

async function lambda(ev: Event, ctx: Context) {
  const task = {
    id: DynamoDB.generateId(),
    ...parseTaskInputJson(ev),
  };

  const result = await DynamoDB.put<Task>(taskTable.name.get(), task);
  return task;
}
