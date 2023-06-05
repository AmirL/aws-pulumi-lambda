import * as aws from '@pulumi/aws';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export interface IResourceRoute {
  path: string;
  name: string;
  lambda: aws.lambda.CallbackFunction<APIGatewayProxyEvent, APIGatewayProxyResult>;
}
