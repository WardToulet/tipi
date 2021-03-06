import { HTTPError, MiddlewareFunc } from 'tipi';

/**
 * Use Basic Auth and adds the username of the user to the context, 
 * if not authenticated throws HttpError { status: 401 }
 */
const authenticate: MiddlewareFunc<any, any, any, { username: string }> = async (req) => {
  if(req.headers.authorization?.startsWith('Basic')) {
    const [ username, _ ] = Buffer.from(req.headers.authorization.slice(6), 'base64').toString().split(':');
    req.context.username = username;
  } else {
    throw new HTTPError({
      status: 401,
    });
  }

  return req;
};

export default authenticate;
