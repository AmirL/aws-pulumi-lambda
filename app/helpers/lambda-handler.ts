import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { isHttpError } from '@curveball/http-errors';

export function lambdaHandler(target: Function) {
  return async function (ev: APIGatewayProxyEvent, ctx: Context): Promise<APIGatewayProxyResult> {
    let body;
    let statusCode;
    try {
      body = JSON.stringify(await target(ev, ctx));
      statusCode = 200;
    } catch (err) {
      statusCode = isHttpError(err) ? err.httpStatus : 500;
      body = JSON.stringify({ error: err });
    }

    return {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode,
      body,
    };
  };
}
