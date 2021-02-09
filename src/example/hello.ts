import { HandleFunc, urlParameterDecoder } from '../Endpoint';

type ReqBody = undefined;
type URLParams = {
  name: string,
};

type QueryParams = {
  caps: string,
};
type ResBody = string;

export const path = '/hello/@name';
export const method = 'GET';

export const handle: HandleFunc<ReqBody, URLParams, QueryParams, ResBody> = (req): ResBody => {
  if(req.queryParameters.caps == 'all') {
    return `Hello ${req.urlParameters?.name.toUpperCase()}`;
  } else if(req.queryParameters.caps == 'first') {
    return `Hello ${req.urlParameters?.name.slice(0,1).toUpperCase()}${req.urlParameters?.name.slice(1).toLowerCase()}`;
  } else {
    return `Hello ${req.urlParameters?.name}`;
  }
}
