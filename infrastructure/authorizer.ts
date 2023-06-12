import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { n } from './helper';
import { apiGateway } from './api-gateway';

const config = new pulumi.Config();
const audience = config.require('audience');
const issuer = config.require('issuer');

const authorizer = new aws.apigatewayv2.Authorizer(
  n('authorizer'),
  {
    apiId: apiGateway.id,
    authorizerType: 'JWT',
    identitySources: ['$request.header.Authorization'],
    jwtConfiguration: {
      audiences: [audience],
      issuer: issuer,
    },
  },
  { dependsOn: apiGateway },
);

export { authorizer };
