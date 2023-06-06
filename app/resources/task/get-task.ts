import { plainToClass } from 'class-transformer';
import { BadRequest, NotFound } from '@curveball/http-errors';
import { taskTable } from '@infrastructure/dynamodb';

import { Event, Context } from '@app/helpers';
import { DynamoDB } from '@app/database';
import { Task } from '@app/entities';

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

  return getTask(id);
}

async function getTask(id: string) {
  // use class to define all fields, including optional ones, with default values
  const task = plainToClass(Task, await DynamoDB.get(taskTable.name.get(), id));

  if (!task) {
    throw new NotFound('Task not found');
  }

  return task;
}
