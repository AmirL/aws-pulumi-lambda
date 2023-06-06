import { BadRequest } from '@curveball/http-errors';
import { plainToClass } from 'class-transformer';

import { taskTable } from '@infrastructure/dynamodb';

import { Event, Context } from '@app/helpers';
import { DynamoDB } from '@app/database';
import { Task } from '@app/entities';
import { z } from 'zod';

export default {
  path: 'POST /task',
  name: 'create-task',
  lambda,
};

type CreateTaskInput = {
  title: string;
  description: string;
  completed: boolean;
};

// TODO Write a test
async function lambda(ev: Event, ctx: Context) {
  let input;

  try {
    input = JSON.parse(ev.body ?? '');
  } catch (err) {
    throw new BadRequest('Error parsing JSON input');
  }

  // validate input and throw error if invalid
  z.object({
    title: z.string().min(3).max(50),
    description: z.string().max(1000),
    completed: z.boolean(),
  })
    .strict()
    .parse(input);

  return createTask(input);
}

export async function createTask(input: CreateTaskInput) {
  const id = DynamoDB.generateId();
  // use class to define all fields, including optional ones, with default values
  const task = plainToClass(Task, { id, ...input });
  const result = await DynamoDB.put(taskTable.name.get(), task);
  return task;
}
