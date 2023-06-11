import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Unauthorized, isHttpError } from '@curveball/http-errors';

export function lambdaHandler(target: Function) {
  return async function (ev: APIGatewayProxyEvent, ctx: Context): Promise<APIGatewayProxyResult> {
    let body;
    let statusCode;
    try {
      const userId: string = ev.requestContext.authorizer?.jwt?.claims?.sub ?? null;

      if (!userId) {
        throw new Unauthorized('Missing user id');
      }

      body = JSON.stringify(await target(ev, ctx, userId));
      statusCode = 200;
    } catch (err) {
      statusCode = isHttpError(err) ? err.httpStatus : 500;
      if (err instanceof Error) {
        body = JSON.stringify({ error: err.message, stack: err.stack });
      } else {
        body = JSON.stringify({ error: 'Unknown error occurred' });
      }

      if (!isHttpError(err)) {
        console.error(err);
      }
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
