import http from 'http';
import { loadEndpoints } from './Router';
import { urlParameterDecoder, queryParameterDecoder } from './Endpoint';

async function start() {
  const router = await loadEndpoints({
    path: `${__dirname}/example`,
    transformers: [
      (endpoint: any) => {
        // If a URLParameters class is exposed and it extends AutoEncoder
        // the decode decodeURLParemeters funcion get generated using this AutoEncoder
        if(endpoint.URLParameters?.__proto__.name === 'AutoEncoder') {
          endpoint.decodeURLParameters = (path: string) => {
            const parameters = urlParameterDecoder.fromPathDef(endpoint.path)(path);
            // TODO: catch error and translate to http error
            return endpoint.URLParameters.create(parameters);
          }
        }

        // Generate decodeQueryParameters
        if(endpoint.QueryParameters?.__proto__.name == 'AutoEncoder') {
          endpoint.decodeQueryParameters = (path: string) => {
            const parameters = queryParameterDecoder.extract(path);
            // TODO: catch error and translate to http error
            return endpoint.QueryParameters.create(parameters);
          }
        }

        // Generate decodeRequestBody
        if(endpoint.RequestBody?.__proto__.name == 'AutoEncoder') {
          endpoint.decodeRequestBody = (raw: string) => {
            // TODO: catch json formating errors and translat into http
            const json = JSON.parse(raw);
            // TODO: catch error and tranlate into http
            return endpoint.QueryParameters.create(json);
          }
        }

        // Generate encode ResponseBody
        if(endpoint.ResponseBody instanceof Object) {
          endpoint.encodeResponseBody = JSON.stringify;
        }

        return endpoint;
      }
    ],
  });

  const server = http.createServer(router);
  server.listen(8090, () => console.log('Server listening on port 8090'));
}

start().catch(console.error);
