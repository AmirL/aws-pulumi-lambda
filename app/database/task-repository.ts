import { taskTable } from '@infrastructure/dynamodb';
import { DynamoDB } from './dynamodb';
import { Task } from '@app/entities/task';

import { plainToClass } from 'class-transformer';

export class TaskRepository {
  private tableName: string;

  constructor() {
    this.tableName = taskTable.name.get();
  }

  async findById(id: string) {
    return plainToClass(Task, DynamoDB.get(this.tableName, id));
  }
}
