import { HandleFunc, ResBodyEncoder, resBodyEncoder } from '../Endpoint';

type ReqBody = undefined;
type URLParams = undefined;
type QueryParams = undefined;
type ResBody = string;

export const path = '/hello-world';
export const method = 'GET';

export const handle: HandleFunc<ReqBody, URLParams, QueryParams, ResBody> = (_req): ResBody => {
  return "Hello world";
}
