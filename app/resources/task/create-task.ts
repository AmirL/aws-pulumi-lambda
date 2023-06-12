import { taskTable } from '@infrastructure/dynamodb';

import { Event, Context, parseBodyJson } from '@app/helpers';
import DynamoDB from '@app/helpers/dynamodb';

import { validateInput, validateTask } from './task-schema';

export async function createTask(ev: Event, ctx: Context, userId: string) {
  // parse the body json to an object
  const json = parseBodyJson(ev);

  // validate the input
  const input = validateInput(json);

  // shape the data to the full task and validate it (with defaults if needed)
  const task = validateTask({
    ...input,
    id: DynamoDB.generateId(),
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // write the task to the database
  await DynamoDB.create(taskTable.name.get(), task);

  // return the created with the id
  return task;
}
