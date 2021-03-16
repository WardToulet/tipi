import http from 'http';
import tipi from 'tipi';
import { 
  injectDecodeURLParameters, 
  injectDecodeQueryParameters, 
  injectDecodeRequestBody, 
  injectEncodeResponseBody 
} from 'tipi-simple-encoding';

(async () => {
  const router = await tipi({
    endpoints: `${__dirname}/endpoints`,
    preload: [ 
      // Inject simple-encoding encoders and decoders
      injectDecodeURLParameters,
      injectDecodeQueryParameters,
      injectDecodeRequestBody,
      injectEncodeResponseBody,
    ]
  });

  const server = http.createServer(router);
  server.listen(8090, () => console.log('Server listening on port 8090'));
})();
