import { taskTable } from '@infrastructure/dynamodb';
import { DynamoDB } from './dynamodb';
import { Task } from '@app/entities/task';

import { plainToClass } from 'class-transformer';

type CreateTaskInput = {
  title: string;
  description: string;
  completed: boolean;
};

export async function findTaskById(id: string) {
  return plainToClass(Task, DynamoDB.get(taskTable.name.get(), id));
}

export async function createTask(input: CreateTaskInput) {
  const id = DynamoDB.generateId();
  const task = plainToClass(Task, { id, ...input });
  const result = await DynamoDB.put(taskTable.name.get(), task);
  return task;
}
