import { HandleFunc } from '../Endpoint';
import { AutoEncoder, field, StringDecoder, NumberDecoder } from '@simonbackx/simple-encoding';

export const path = '/stamhoofd/group/@id';
export const method = 'GET';

export class URLParameters extends AutoEncoder {
  @field({ decoder: NumberDecoder })
  id: number; 
}

export class ResponseBody extends AutoEncoder {
  @field({ decoder: NumberDecoder })
  id: number;

  @field({ decoder: StringDecoder })
  name: string;
}

export class QueryParameters extends AutoEncoder {
  @field({ decoder: NumberDecoder, optional: true })
  flag?: string;
} 

export const handle: HandleFunc<undefined, URLParameters, QueryParameters, ResponseBody> = (req) => {
  return ResponseBody.create({ id: req.urlParameters.id, name: 'Thila Coloma' });
}
