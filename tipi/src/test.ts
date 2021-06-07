import { Endpoint, Variables, Query } from './endpoint';

const endpoint: Endpoint<
  Variables<{ name: string }> & Query<{ greeting?: string }>,
  string
> = async req => {
  return `${req.query.greeting || 'Hello'} ${req.variables.name}!`;
}

endpoint.method = 'GET';
endpoint.path = [ '/greet/@name', '/hello/@name' ];

export default endpoint;
