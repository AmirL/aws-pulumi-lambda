import * as aws from '@pulumi/aws';
import { TaskRepository } from '@app/database/task-repository';

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { BadRequest, NotFound } from '@curveball/http-errors';
import { lambdaHandler } from '@app/helpers/lambdaHandler';

export const getTaskHandler = new aws.lambda.CallbackFunction('get-task', {
  callback: lambdaHandler(async function callback(ev: APIGatewayProxyEvent, ctx: Context) {
    const { id } = getParams(ev);

    const taskRepository = new TaskRepository();
    const task = await taskRepository.findById(id);

    if (!task) {
      throw new NotFound('Task not found');
    }

    return task;
  }),
});

// TODO Create repository for the project
function getParams(ev: APIGatewayProxyEvent) {
  if (!ev.pathParameters?.id) {
    throw new BadRequest('Missing id');
  }

  return { id: ev.pathParameters.id };
}
