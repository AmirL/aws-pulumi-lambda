import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

export class DynamoDB {
  static async get(tableName: string, id: string) {
    const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

    const command = new GetCommand({
      TableName: tableName,
      Key: {
        id,
      },
    });

    const result = await docClient.send(command);

    return result.Item;
  }

  static async put<T extends Record<string, any> | undefined>(tableName: string, item: T) {
    const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

    const command = new PutCommand({
      TableName: tableName,
      Item: {
        ...item,
      },
    });

    const result = await docClient.send(command);

    return result;
  }

  static async delete(tableName: string, id: string) {
    const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

    const command = new DeleteCommand({
      TableName: tableName,
      Key: {
        id,
      },
    });

    const result = await docClient.send(command);

    return result;
  }

  static generateId() {
    return randomUUID();
  }
}
