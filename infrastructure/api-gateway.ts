import * as aws from '@pulumi/aws';
import { n } from './helper';

const apiGateway = new aws.apigatewayv2.Api(n('httpApiGateway'), {
  protocolType: 'HTTP',
});

export { apiGateway };
