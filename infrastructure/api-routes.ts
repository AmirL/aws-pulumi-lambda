import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { lambdaHandler } from '@app/helpers';
import { lambdaRole } from './lambda-role';
import { n } from './helper';
import { apiGateway } from './api-gateway';
import { authorizer } from './authorizer';
import { Route } from '@pulumi/aws/apigatewayv2/route';
import { routesSchema } from './routes-schema';

const routes: Route[] = [];

for (const { path, name, target } of routesSchema) {
  // Define lambda function for each route to deploy on AWS
  const lambda = new aws.lambda.CallbackFunction(n(name), {
    callback: lambdaHandler(target),
    role: lambdaRole.arn,
  });

  // Define lambda permission to allow API Gateway to invoke the lambda function
  new aws.lambda.Permission(
    n(`lambdaPermission-for-${name}`),
    {
      action: 'lambda:InvokeFunction',
      principal: 'apigateway.amazonaws.com',
      function: lambda.arn,
      sourceArn: pulumi.interpolate`${apiGateway.executionArn}/*/*`,
    },
    {
      dependsOn: [apiGateway, lambda],
    },
  );

  // Define API Gateway integration for the lambda function
  const integration = new aws.apigatewayv2.Integration(n(`${name}-integration`), {
    apiId: apiGateway.id,
    integrationType: 'AWS_PROXY',
    integrationUri: lambda.arn,
    integrationMethod: 'POST',
    payloadFormatVersion: '2.0',
    // WHEN_NO_MATCH - pass through unmapped query parameters to the integration backend without transformation.
    passthroughBehavior: 'WHEN_NO_MATCH',
  });

  // Define API Gateway route for the lambda function
  const route = new aws.apigatewayv2.Route(n(`${name}-route`), {
    apiId: apiGateway.id,
    routeKey: path,
    authorizationType: 'JWT',
    authorizerId: authorizer.id,
    target: pulumi.interpolate`integrations/${integration.id}`,
  });

  routes.push(route);
}

// Define API Gateway stage to deploy the routes
const stage = new aws.apigatewayv2.Stage(
  `apiStage`,
  {
    apiId: apiGateway.id,
    name: pulumi.getStack(),
    routeSettings: routes.map((route) => ({
      routeKey: route.routeKey,
      throttlingBurstLimit: 1000,
      throttlingRateLimit: 100,
    })),
    autoDeploy: true,
  },
  { dependsOn: routes },
);

export { stage };
