import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import taskRoutes from '@app/resource/task';

const stack = pulumi.getStack();

const apigw = new aws.apigatewayv2.Api('httpApiGateway', {
  protocolType: 'HTTP',
});

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

const lambdaRoleAttachment = new aws.iam.RolePolicyAttachment('lambdaRoleAttachment', {
  role: lambdaRole,
  policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
});

const defineRoutes = [...taskRoutes];

const routes = [];

for (const route of defineRoutes) {
  const lambdaPermission = new aws.lambda.Permission(
    `lambdaPermission-for-${route.name}`,
    {
      action: 'lambda:InvokeFunction',
      principal: 'apigateway.amazonaws.com',
      function: route.lambda.arn,
      sourceArn: pulumi.interpolate`${apigw.executionArn}/*/*`,
    },
    {
      dependsOn: [apigw, route.lambda],
    },
  );

  routes.push(createRouteForLambda(apigw, route.lambda, route.path, route.name));
}

// // Create an integration, which connects a route to an AWS Lambda function.
// const integration = new aws.apigatewayv2.Integration('lambdaIntegration', {
//   apiId: apigw.id,
//   integrationType: 'AWS_PROXY',
//   integrationUri: getTaskHandler.arn,
//   integrationMethod: 'POST',
//   payloadFormatVersion: '2.0',
//   // WHEN_NO_MATCH - pass through unmapped query parameters to the integration backend without transformation.
//   passthroughBehavior: 'WHEN_NO_MATCH',
// });

// const route = new aws.apigatewayv2.Route('apiRoute', {
//   apiId: apigw.id,
//   // routeKey: '$default',
//   routeKey: 'GET /task/{id}',
//   target: pulumi.interpolate`integrations/${integration.id}`,
// });

// const route2 = createRouteForLambda(apigw, getTaskHandler, 'GET /task2/{id}', 'get-task2');

const stage = new aws.apigatewayv2.Stage(
  'apiStage',
  {
    apiId: apigw.id,
    name: stack,
    routeSettings: routes.map((route) => ({
      routeKey: route.routeKey,
      throttlingBurstLimit: 5000,
      throttlingRateLimit: 10000,
    })),
    autoDeploy: true,
  },
  { dependsOn: routes },
);

export const endpoint = pulumi.interpolate`${apigw.apiEndpoint}/${stage.name}`;

function createRouteForLambda(api: aws.apigatewayv2.Api, lambda: aws.lambda.Function, routeKey: string, name: string) {
  const integration = new aws.apigatewayv2.Integration(`${name}-integration`, {
    apiId: api.id,
    integrationType: 'AWS_PROXY',
    integrationUri: lambda.arn,
    integrationMethod: 'POST',
    payloadFormatVersion: '2.0',
    // WHEN_NO_MATCH - pass through unmapped query parameters to the integration backend without transformation.
    passthroughBehavior: 'WHEN_NO_MATCH',
  });

  return new aws.apigatewayv2.Route(`${name}-route`, {
    apiId: api.id,
    routeKey,
    target: pulumi.interpolate`integrations/${integration.id}`,
  });
}
