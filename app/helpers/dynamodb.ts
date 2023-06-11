import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { ulid } from 'ulid';

async function get(tableName: string, Key: Record<string, any>) {
  const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

  const command = new GetCommand({
    TableName: tableName,
    Key,
  });

  const result = await docClient.send(command);

  return result.Item;
}

async function create(tableName: string, item: any) {
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

/**
 * Query the database
 *
 * @example
 * const result = await DynamoDB.query(taskTable.name.get(), 'userId = :userId', { ':userId': userId });
 */
async function query(tableName: string, KeyCondition: string, values: Record<string, any>) {
  const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: KeyCondition,
    ExpressionAttributeValues: values,
  });

  const result = await docClient.send(command);

  return result;
}

/**
 * Update only the fields that are passed in the item object
 */
async function update(tableName: string, item: object, Key: Record<string, any>) {
  const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

  const { UpdateExpression, ExpressionAttributeValues } = objectToUpdateExpression(item);

  const command = new UpdateCommand({
    TableName: tableName,
    Key,
    ExpressionAttributeValues,
    UpdateExpression,
    ReturnValues: 'ALL_NEW',
  });

  const result = await docClient.send(command);

  return result;
}

async function deleteItem(tableName: string, Key: Record<string, any>) {
  const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

  const command = new DeleteCommand({
    TableName: tableName,
    Key,
  });

  const result = await docClient.send(command);

  return result;
}

function generateId() {
  return ulid();
}

/**
 * Convert an object to an expression string and values
 * that can be used in a DynamoDB query or update
 */
function objectToUpdateExpression(item: object) {
  const updateExpressionParts: string[] = [];
  const ExpressionAttributeValues: { [key: string]: any } = {};

  Object.entries(item).forEach(([key, value]) => {
    ExpressionAttributeValues[`:${key}`] = value;
    updateExpressionParts.push(`${key} = :${key}`);
  });

  const UpdateExpression = `set ${updateExpressionParts.join(', ')}`;

  return {
    UpdateExpression,
    ExpressionAttributeValues,
  };
}

export default {
  get,
  create,
  query,
  update,
  delete: deleteItem,
  generateId,
};
