import { StringDecoder } from '@simonbackx/simple-encoding';
import { AutoEncoder, field } from '@simonbackx/simple-encoding';
import { HandleFunc } from '@wardtoulet/tipi';

export const path = '/beer';
export const method = 'POST';

export class URLParameters extends AutoEncoder {
  @field({ optional: false, decoder: StringDecoder})
  name: string;
}

export const handle: HandleFunc<undefined, URLParameters, undefined, undefined, string> = async (req) => {
  return `Hello ${req.urlParameters.name}`;
}
