import { BadRequest } from '@curveball/http-errors';

export { lambdaHandler } from './lambda-handler';
export { IResourceRoute } from './resource-route';

export { APIGatewayProxyEvent as Event, Context } from 'aws-lambda';

export function parseBodyJson(event: any): object {
  try {
    return JSON.parse(event.body ?? '');
  } catch (err) {
    throw new BadRequest('Error parsing JSON input');
  }
}
