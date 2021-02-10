import { HandleFunc } from '../endpoint';
import { AutoEncoder, field, StringDecoder, NumberDecoder } from '@simonbackx/simple-encoding';

export class URLParameters extends AutoEncoder {
  @field({ decoder: StringDecoder })
  name: string;
};

export class QueryParameters extends AutoEncoder {
  @field({ decoder: StringDecoder, optional: true })
  caps?: string;
};

type ResBody = string;

export const path = '/hello/@name';
export const method = 'GET';

export const handle: HandleFunc<undefined, URLParameters, QueryParameters, ResBody> = (req): ResBody => {
  console.log(req);

  if(req.queryParameters.caps == 'all') {
    return `Hello ${req.urlParameters?.name.toUpperCase()}`;
  } else if(req.queryParameters.caps == 'first') {
    return `Hello ${req.urlParameters?.name.slice(0,1).toUpperCase()}${req.urlParameters?.name.slice(1).toLowerCase()}`;
  } else {
    return `Hello ${req.urlParameters?.name}`;
  }
}
