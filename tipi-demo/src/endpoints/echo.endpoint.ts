import { Endpoint, Body, bodyDecoder } from '@wardtoulet/tipi';

const endpoint: Endpoint<
  Body<Object>,
  Object
> = async ({ body }) => {
  return body; 
}

endpoint.method = 'POST';
endpoint.path = '/echo';
endpoint.bodyDecoder = bodyDecoder;

export default endpoint;
