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

// TODO: move this outof handle
import { BasicRequest } from './endpoint/handle';

type PipelineArgs<RequestTypes extends BasicRequest, ResponseBody> = {
    name: string,
    requestBodyDecoder?: RequestBodyDecoder<RequestTypes['body']>,
    urlParameterDecoder?: URLParameterDecoder<RequestTypes['urlParameters']>,
    queryParameterDecoder?: QueryParameterDecoder<RequestTypes['queryParameters']>,
    handleFunc: HandleFunc<RequestTypes, ResponseBody>,
    middleware?: MiddlewareFunc<RequestTypes>[],
    resBodyEncoder?: ResponseBodyEncoder<ResponseBody>,
}

/**
 * Pipeline encapsulates all the logic for handeling a request of an endpoint
 */
export default class Pipeline<RequestTypes extends BasicRequest, ResponseBody> {
  readonly name: string;
  readonly requestBodyDecoder?: RequestBodyDecoder<RequestTypes['body']> 
  readonly urlParameterDecoder?: URLParameterDecoder<RequestTypes['urlParameters']>;
  readonly queryParameterDecoder?: QueryParameterDecoder<RequestTypes['queryParameters']>;
  readonly middleware?: MiddlewareFunc<RequestTypes>[];
  readonly handleFunc: HandleFunc<RequestTypes, ResponseBody>;
  readonly responseBodyEncoder?: ResponseBodyEncoder<ResponseBody>; 

  constructor({
    requestBodyDecoder,
    urlParameterDecoder,
    queryParameterDecoder,
    handleFunc,
    resBodyEncoder,
    middleware,
    name,
  }: PipelineArgs<RequestTypes, ResponseBody>) {
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
  async run({
    path,
    rawBody,
    headers,
    route,
  }: {
    path: string, 
    rawBody: string, 
    headers: IncomingHttpHeaders
    // The path defenition that was matched in th routingtree
    route: string,
  })
     : Promise<{ body: string, headers: OutgoingHttpHeaders}>
  {
    let request = new Request<RequestTypes>({
      route,
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
    const result: ResponseBody = await this.handleFunc(request);

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


export function createPipeline(module: any): Pipeline<any, any> {
  // If a name is defined use the defined name otherwise use the filename
  // this is set in the init function
  const name = module.name;

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
