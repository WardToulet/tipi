import { HandleFunc, ResBodyEncoder, resBodyEncoder } from '../Endpoint';

type ReqBody = undefined;
type URLParams = undefined;
type QueryParams = undefined;
type ResBody = string;

export const path = '/test';
export const method = 'GET';

export const handle: HandleFunc<ReqBody, URLParams, QueryParams, ResBody> = (_req): ResBody => {
  return 'This is returned from an example endpoint';
}

export const encodeResboseBody: ResBodyEncoder<string> = resBodyEncoder.string;
