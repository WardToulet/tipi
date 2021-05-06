import { StringDecoder } from '@simonbackx/simple-encoding';
import { AutoEncoder, field } from '@simonbackx/simple-encoding';
import { HandleFunc } from '@wardtoulet/tipi';

export const path = [ '/aap/@name', '/@name/monkey' ];
export const method = 'GET';
export const aaazifdjklj = 'kjdfksljf';

export class URLParameters extends AutoEncoder {
  @field({ optional: false, decoder: StringDecoder})
  name: string;
}

export const handle: HandleFunc<
  { urlParameters: URLParameters },
  string
> = async (req) => {
  return `Hello ${req.urlParameters.name}`;
}
