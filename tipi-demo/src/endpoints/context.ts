import { HandleFunc } from '@wardtoulet/tipi';

import authenticate from '../middleware/authenticate';

export const method = 'GET';
export const path = '/context';

export const middleware = [
  authenticate
];

// The context data will be insert by the middleware
// I am still looking for a machanism to infer which middleware functions must 
// be run on an an endpoint based on the context defenition
type Context = {
  username: string;
}

export const handle: HandleFunc<
 { context: Context },
 string
 > = async (req) => {
  return `Helo ${req.context.username}`;
}
