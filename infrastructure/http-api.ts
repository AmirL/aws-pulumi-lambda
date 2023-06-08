import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import taskRoutes from '@app/resources/task';
import { lambdaHandler, IResourceRoute } from '@app/helpers';

const config = new pulumi.Config();
const audience = config.require('audience');
const issuer = config.require('issuer');

const stack = pulumi.getStack();

const apigw = new aws.apigatewayv2.Api(`${stack}httpApiGateway`, {
  protocolType: 'HTTP',
});

const authorizer = new aws.apigatewayv2.Authorizer(
  'authorizer',
  {
    apiId: apigw.id,
    authorizerType: 'JWT',
    identitySources: ['$request.header.Authorization'],
    jwtConfiguration: {
      audiences: [audience],
      issuer: issuer,
    },
  },
  { dependsOn: apigw },
);

defineLambdaRole();

// create routes based on the routes defined in the resources folder
const routes = createRoutes([...taskRoutes], authorizer.id);

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

function defineLambdaRole() {
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
}

function createRoutes(defineRoutes: IResourceRoute[], authorizerId?: pulumi.Output<string>) {
  const routes = [];

  for (const route of defineRoutes) {
    // Add stack name to route name, so it will be easier to find in the AWS console
    const name = `${stack}-${route.name}`;

    // Define lambda function for each route to deploy on AWS
    const lambda = new aws.lambda.CallbackFunction(name, {
      callback: lambdaHandler(route.lambda),
    });

    const lambdaPermission = new aws.lambda.Permission(
      `${stack}-lambdaPermission-for-${name}`,
      {
        action: 'lambda:InvokeFunction',
        principal: 'apigateway.amazonaws.com',
        function: lambda.arn,
        sourceArn: pulumi.interpolate`${apigw.executionArn}/*/*`,
      },
      {
        dependsOn: [apigw, lambda],
      },
    );

    routes.push(createRouteForLambda(apigw, lambda, route.path, name, authorizerId));
  }
  return routes;
}

function createRouteForLambda(
  api: aws.apigatewayv2.Api,
  lambda: aws.lambda.Function,
  routeKey: string,
  name: string,
  authorizerId?: pulumi.Output<string>,
) {
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
    authorizationType: 'JWT',
    authorizerId,
    target: pulumi.interpolate`integrations/${integration.id}`,
  });
}
