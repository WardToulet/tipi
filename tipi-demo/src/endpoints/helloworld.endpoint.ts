import { Endpoint, Variables } from '@wardtoulet/tipi';
 
const endpoint: Endpoint<
  Variables<{ name: string }>,
  string
> = async (req) => {
  console.log(req);
  console.log(req.variables);
  return `Hello ${req.variables.name}`;
}

endpoint.method = 'GET';
endpoint.path = '/hello/@name';

export default endpoint;
