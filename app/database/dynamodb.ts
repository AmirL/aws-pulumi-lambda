import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

export class DynamoDB {
  static async get(tableName: string, id: string) {
    const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

    const command = new GetCommand({
      TableName: tableName,
      Key: {
        id: id,
      },
    });

    const result = await docClient.send(command).catch((err) => {
      // log error
      throw err;
    });

    return result.Item;
  }
}
