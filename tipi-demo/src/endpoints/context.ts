import { HandleFunc } from 'tipi';
import authenticate from '../middleware/authenticate';

export const method = 'GET';
export const path = '/context';

export const middleware = [
  authenticate
];

export const handle: HandleFunc<undefined, undefined, undefined, string> = async (req) => {
  return `Helo ${req.context.username}`;
}
