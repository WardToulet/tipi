import { HandleFunc, urlParameterDecoder } from '../Endpoint';

type ReqBody = undefined;
type URLParams = {
  name: string,
};
type QueryParams = undefined;
type ResBody = string;

export const path = '/hello/@name';
export const method = 'GET';

export const handle: HandleFunc<ReqBody, URLParams, QueryParams, ResBody> = (req): ResBody => {
  return `Hello ${req.urlParameters?.name}`;
}

export const decodeUrlParameters = urlParameterDecoder.fromPathDef(path);
