import * as aws from '@pulumi/aws';
import { createTask } from '@app/database/task-repository';

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { BadRequest, NotFound } from '@curveball/http-errors';
import { lambdaHandler } from '@app/helpers';

const path = 'POST /task';
const name = 'create-task';

/**
 * Lambda handler
 **/
const lambda = new aws.lambda.CallbackFunction('create-task', {
  callback: lambdaHandler(async function callback(ev: APIGatewayProxyEvent, ctx: Context) {
    const input = getParams(ev);
    const task = await createTask(input);

    return { task };
  }),
});

/**
 * Validates and returns the params from the event
 */
function getParams(ev: APIGatewayProxyEvent) {
  let input;

  try {
    input = JSON.parse(ev.body ?? '');
  } catch (err) {}

  // todo use dto to validate input
  if (!input || !input.title || !input.description || typeof input.completed !== 'boolean') {
    throw new BadRequest('Please provide correct input');
  }
  return {
    title: input.title,
    description: input.description,
    completed: input.completed,
  };
}

export default {
  path,
  name,
  lambda,
};
