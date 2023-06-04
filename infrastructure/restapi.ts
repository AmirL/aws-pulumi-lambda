import * as apigateway from '@pulumi/aws-apigateway';

import { getTaskHandler } from '@app/lambda/task/get-task';

// Define an endpoint that invokes a lambda to handle requests
export const restApi = new apigateway.RestAPI('api', {
  routes: [
    {
      path: '/task/{id}',
      method: 'GET',
      eventHandler: getTaskHandler,
    },
  ],
});
