import {IncomingHttpHeaders, OutgoingHttpHeaders} from 'http';

import {
  RequestBodyDecoder,
  URLParameterDecoder,
  QueryParameterDecoder,
  HandleFunc,
  MiddlewareFunc,
  ResponseBodyEncoder,
  Request,
} from './endpoint';


type PipelineArgs<ReqBody, URLParameters, QueryParameters, Context, ResBody> = {
    name: string,
    requestBodyDecoder?: RequestBodyDecoder<ReqBody>,
    urlParameterDecoder?: URLParameterDecoder<URLParameters>,
    queryParameterDecoder?: QueryParameterDecoder<QueryParameters>,
    handleFunc: HandleFunc<ReqBody, URLParameters, QueryParameters, Context, ResBody>,
    middleware?: MiddlewareFunc<ReqBody, URLParameters, QueryParameters, Context>[],
    resBodyEncoder?: ResponseBodyEncoder<ResBody>,
}

/**
 * Pipeline encapsulates all the logic for handeling a request of an endpoint
 */
export default class Pipeline<ReqBody, URLParameters, QueryParameters, Context, ResBody> {
  readonly name: string;
  readonly requestBodyDecoder?: RequestBodyDecoder<ReqBody>;
  readonly urlParameterDecoder?: URLParameterDecoder<URLParameters>;
  readonly queryParameterDecoder?: QueryParameterDecoder<QueryParameters>;
  readonly middleware?: MiddlewareFunc<ReqBody, URLParameters, QueryParameters, Context>[];
  readonly handleFunc: HandleFunc<ReqBody, URLParameters, QueryParameters, Context, ResBody>;
  readonly responseBodyEncoder?: ResponseBodyEncoder<ResBody>; 

  constructor({
    requestBodyDecoder,
    urlParameterDecoder,
    queryParameterDecoder,
    handleFunc,
    resBodyEncoder,
    middleware,
    name,
  }: PipelineArgs<ReqBody, URLParameters, QueryParameters, Context,ResBody>) {
    this.requestBodyDecoder = requestBodyDecoder;
    this.urlParameterDecoder = urlParameterDecoder;
    this.queryParameterDecoder = queryParameterDecoder;
    this.handleFunc = handleFunc;
    this.responseBodyEncoder = resBodyEncoder;
    this.middleware = middleware;
    this.name = name;
  }
  
  /**
   * Run the middleware, handler and response encoder, the decoders for the requestBody,
   * queryParameters and URLParameters are ran lazaly the frist time they are requested.
   */
  async run(path: string, rawBody: string, headers: IncomingHttpHeaders)
     : Promise<{ body: string, headers: OutgoingHttpHeaders}>
  {
    let request = new Request<ReqBody, URLParameters, QueryParameters, Context>({
      path,
      rawBody,
      headers,
      requestBodyDecoder: this.requestBodyDecoder,
      urlParameterDecoder: this.urlParameterDecoder,
      queryParameterDecoder: this.queryParameterDecoder,
    });

    // Run the middleware functions
    for(const middleware of this.middleware || [] ) {
      // Await on each middleware function because it must run in order
      request = await middleware(request);
    }

    // Run the handler function
    const result: ResBody = await this.handleFunc(request);

    // If there is not responseBodyEncoder specified, 
    // the body will be encoded using the toString method
    if(this.responseBodyEncoder) {
      const { headers, body } = this.responseBodyEncoder(result);
      return { body, headers: headers || {} }; } 
    else {
      return { body: String(result), headers: { 'content-type': 'text/plain;CHARSET=utf-8' }};
    }
  }
}


export function createPipeline(module: any, filename: string): Pipeline<any, any, any, any, any> {
  // If a name is defined use the defined name otherwise use the filename
  const name = module.name || filename?.split('/').pop();

  return new Pipeline({
    name,
    requestBodyDecoder: module.decodeRequestBody,
    urlParameterDecoder: module.decodeURLParameters,
    queryParameterDecoder: module.decodeQueryParameters,
    handleFunc: module.handle,
    resBodyEncoder: module.encodeResponseBody, 
    middleware: module.middleware,
  });
}
