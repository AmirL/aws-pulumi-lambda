import * as aws from '@pulumi/aws';

export const taskTable = new aws.dynamodb.Table('Task', {
  attributes: [{ name: 'id', type: 'S' }],
  hashKey: 'id',
  readCapacity: 1,
  writeCapacity: 1,
});
