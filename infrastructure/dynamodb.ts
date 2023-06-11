import * as aws from '@pulumi/aws';

export const taskTable = new aws.dynamodb.Table('Task', {
  attributes: [
    { name: 'id', type: 'S' },
    { name: 'userId', type: 'S' },
    { name: 'createdAt', type: 'S' },
    { name: 'updatedAt', type: 'S' },
    { name: 'completed', type: 'N' },
  ],
  hashKey: 'userId',
  rangeKey: 'id',
  localSecondaryIndexes: [
    {
      name: 'createdAtIndex',
      projectionType: 'ALL',
      rangeKey: 'createdAt',
    },
    {
      name: 'completed',
      projectionType: 'ALL',
      rangeKey: 'completed',
    },
    {
      name: 'updatedAtIndex',
      projectionType: 'ALL',
      rangeKey: 'updatedAt',
    },
  ],
  readCapacity: 1,
  writeCapacity: 1,
});
