import * as aws from '@pulumi/aws';
import { findTaskById } from '@app/database/task-repository';

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { BadRequest, NotFound } from '@curveball/http-errors';
import { lambdaHandler } from '@app/helpers';

const path = 'GET /task/{id}';
const name = 'get-task';

/**
 * Lambda handler for GET /task/{id}
 **/
const lambda = new aws.lambda.CallbackFunction(name, {
  callback: lambdaHandler(async function callback(ev: APIGatewayProxyEvent, ctx: Context) {
    const { id } = getParams(ev);

    const task = await findTaskById(id);

    if (!task) {
      throw new NotFound('Task not found');
    }

    return task;
  }),
});

/**
 * Validates and returns the params from the event
 */
function getParams(ev: APIGatewayProxyEvent) {
  if (!ev.pathParameters?.id) {
    throw new BadRequest('Missing id');
  }

  return { id: ev.pathParameters.id };
}

export default {
  path,
  name,
  lambda,
};
