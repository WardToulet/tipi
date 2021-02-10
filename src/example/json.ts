import { HandleFunc, ResBodyEncoder, resBodyEncoder } from '../endpoint';

type ReqBody = undefined;
type URLParams = undefined;
type QueryParams = undefined;
type ResBody = {
  msg: string
};

export const path = '/test/json';
export const method = 'GET';

export const handle: HandleFunc<ReqBody, URLParams, QueryParams, ResBody> = (_req): ResBody => {
  return { msg: 'This is returned from an example endpoint' };
}

export const encodeResponseBody: ResBodyEncoder<string> = resBodyEncoder.json;
