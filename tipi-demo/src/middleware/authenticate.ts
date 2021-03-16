import { HTTPError, MiddlewareFunc } from 'tipi';

const authenticate: MiddlewareFunc<any, any, any> = async (req) => {

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
