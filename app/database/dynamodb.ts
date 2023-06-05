import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { it } from 'node:test';

export class DynamoDB {
  static async get(tableName: string, id: string) {
    const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

    const command = new GetCommand({
      TableName: tableName,
      Key: {
        id: id,
      },
    });

    const result = await docClient.send(command);

    return result.Item;
  }

  static async put(tableName: string, item: any) {
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

  static generateId() {
    return randomUUID();
  }
}
