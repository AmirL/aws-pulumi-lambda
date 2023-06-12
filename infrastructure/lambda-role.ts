import * as aws from '@pulumi/aws';

const lambdaRole = new aws.iam.Role('lambdaRole', {
  assumeRolePolicy: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'sts:AssumeRole',
        Principal: {
          Service: 'lambda.amazonaws.com',
        },
        Effect: 'Allow',
        Sid: '',
      },
    ],
  },
});

const policies = [
  aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
  aws.iam.ManagedPolicy.CloudWatchFullAccess,
  aws.iam.ManagedPolicy.AmazonS3FullAccess,
  aws.iam.ManagedPolicies.AmazonDynamoDBFullAccess,
];

for (const policy of policies) {
  new aws.iam.RolePolicyAttachment(`${policy}-attachment`, {
    role: lambdaRole,
    policyArn: policy,
  });
}

export { lambdaRole };
