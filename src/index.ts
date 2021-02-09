import {
  ReqBodyDecoder,
  reqBodyDecoder,

  URLParameterDecoder,
  urlParameterDecoder,

  QueryParameterDecoder,
  queryParameterDecoder,

  HandleFunc,

  ResBodyEncoder,
  resBodyEncoder,
} from './Endpoint';

import http, { ClientRequest } from 'http';

class EndpointPipeline<ReqBody, URLParameters, QueryParameters, ResBody> {
  readonly reqBodyDecoder: ReqBodyDecoder<ReqBody>;
  readonly urlParameterDecoder: URLParameterDecoder<URLParameters>;
  readonly queryParameterDecoder: QueryParameterDecoder<QueryParameters>;
  readonly handleFunc: HandleFunc<ReqBody, URLParameters, QueryParameters, ResBody>;
  readonly resBodyEncoder: ResBodyEncoder<ResBody>;

  constructor(
    reqBodyDecoder: ReqBodyDecoder<ReqBody>,
    urlParameterDecoder: URLParameterDecoder<URLParameters>,
    queryParameterDecoder: QueryParameterDecoder<QueryParameters>,
    handleFunc: HandleFunc<ReqBody, URLParameters, QueryParameters, ResBody>,
    resBodyEncoder: ResBodyEncoder<ResBody>,
  ) {
    this.reqBodyDecoder = reqBodyDecoder;
    this.urlParameterDecoder = urlParameterDecoder;
    this.queryParameterDecoder = queryParameterDecoder;
    this.handleFunc = handleFunc;
    this.resBodyEncoder = resBodyEncoder;
  }

   run(path: string, rawBody: string) {
     // TODO: decode body
     // const reqBody: ReqBody = this.reqBodyDecoder(rawReq);
     console.log(rawBody);
     const reqBody = undefined;

     const urlParameters: URLParameters = this.urlParameterDecoder(path);
     const queryParameters: QueryParameters = this.queryParameterDecoder(path);
  
     const resBody: ResBody = this.handleFunc({ reqBody, urlParameters, queryParameters });
  
     return this.resBodyEncoder(resBody);
   }
}

function createPipeline(module: any): EndpointPipeline<any, any, any, any> {
  console.log(module);

  if(!module.handle)
     throw 'No handle func';

  return new EndpointPipeline(
    module.reqBodyDecoder         || reqBodyDecoder.noBody,
    module.urlParameterDecoder    || urlParameterDecoder.noParameters,
    module.queryParameterDecoder  || queryParameterDecoder.noParameters,
    module.handle,
    module.encodeResponseBody     || resBodyEncoder.string,
  );
}

import(`${__dirname}/example/json`).then(module => {
  const pipeline = createPipeline(module);
  console.log(pipeline.resBodyEncoder.toString());

  const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    let data = '';

    req.on('data', chunk => {
      console.log(`Data chunk available: ${chunk}`);
      data += chunk;
    });

    req.on('end', () => {
      res.end(pipeline.run(req.url || '/', data));
    });
  });
  server.listen(8090, () => console.log(`Server started on port 8090`));
});
