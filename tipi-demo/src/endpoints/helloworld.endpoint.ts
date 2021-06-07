import { Endpoint, Variables, variablesExtractor, Query, queryExtractor } from '@wardtoulet/tipi';
 
const endpoint: Endpoint<
  Variables<{ name: string }> & Query<{ lang: string }>,
  string
> = async ({ variables: { name }, query }) => {
  console.log(query)
  return `${query.lang === 'be' ? 'Hallo' : 'Hello' } ${name}`;
}

endpoint.method = 'GET';
endpoint.path = '/hello/@name';
endpoint.variablesExtractor = variablesExtractor;
endpoint.queryExtractor = queryExtractor;

export default endpoint;
