import { taskTable } from '@infrastructure/dynamodb';

import { Event, Context, parseBodyJson } from '@app/helpers';
import { DynamoDB } from '@app/database';

import { validateTask } from './task-schema';

export default {
  path: 'POST /task',
  name: 'create-task',
  lambda,
};

async function lambda(ev: Event, ctx: Context) {
  // parse the body json to an object
  const json = parseBodyJson(ev);

  // shape the data and validate it
  const task = validateTask({
    id: DynamoDB.generateId(),
    ...json,
  });

  // write the task to the database
  await DynamoDB.put(taskTable.name.get(), task);

  // return the created with the id
  return task;
}
