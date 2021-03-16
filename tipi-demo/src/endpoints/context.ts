import { HandleFunc } from 'tipi';
import authenticate from '../middleware/authenticate';

export const method = 'GET';
export const path = '/context';

export const middleware = [
  authenticate
];

// The context data will be insert by the middleware
// I am still looking for a machanism to infer if a middlewaer function must 
// be run an an endpoint based on the context defenition
type Context = {
  username: string;
}

export const handle: HandleFunc<undefined, undefined, undefined, Context, string> = async (req) => {
  return `Helo ${req.context.username}`;
}
