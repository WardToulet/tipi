import {
  RequestBodyDecoder,
  URLParameterDecoder,
  QueryParameterDecoder,
  HandleFunc,
  MiddlewareFunc,
  ResponseBodyEncoder,
  Request,
} from './endpoint';

import { PipelineError } from './errors';

type PipelineArgs<ReqBody, URLParameters, QueryParameters, ResBody> = {
    name: string,
    requestBodyDecoder?: RequestBodyDecoder<ReqBody>,
    urlParameterDecoder?: URLParameterDecoder<URLParameters>,
    queryParameterDecoder?: QueryParameterDecoder<QueryParameters>,
    handleFunc: HandleFunc<ReqBody, URLParameters, QueryParameters, ResBody>,
    middleware?: MiddlewareFunc<ReqBody, URLParameters, QueryParameters>[],
    resBodyEncoder?: ResponseBodyEncoder<ResBody>,
}

export default class Pipeline<ReqBody, URLParameters, QueryParameters, ResBody> {
  readonly name: string;
  readonly requestBodyDecoder?: RequestBodyDecoder<ReqBody>;
  readonly urlParameterDecoder?: URLParameterDecoder<URLParameters>;
  readonly queryParameterDecoder?: QueryParameterDecoder<QueryParameters>;
  readonly middleware?: MiddlewareFunc<ReqBody, URLParameters, QueryParameters>[];
  readonly handleFunc: HandleFunc<ReqBody, URLParameters, QueryParameters, ResBody>;
  readonly responseBodyEncoder?: ResponseBodyEncoder<ResBody>;
  public context: { [key: string]: any } = {};

  constructor({
    requestBodyDecoder,
    urlParameterDecoder,
    queryParameterDecoder,
    handleFunc,
    resBodyEncoder,
    middleware,
    name,
  }: PipelineArgs<ReqBody, URLParameters, QueryParameters, ResBody>) {
    this.requestBodyDecoder = requestBodyDecoder;
    this.urlParameterDecoder = urlParameterDecoder;
    this.queryParameterDecoder = queryParameterDecoder;
    this.handleFunc = handleFunc;
    this.responseBodyEncoder = resBodyEncoder;
    this.middleware = middleware;
    this.name = name;
  }

   async run(path: string, rawBody: string, headers: { [key: string]: string}): Promise<string> {
     console.log(headers);
     let request = new Request<ReqBody, URLParameters, QueryParameters>({
        path,
        rawBody,
        headers,
        requestBodyDecoder: this.requestBodyDecoder,
        urlParameterDecoder: this.urlParameterDecoder,
        queryParameterDecoder: this.queryParameterDecoder,
     });

     for(const middleware of this.middleware || [] ) {
        // Await on each middleware function because it must run in order
        request = await middleware(request);
     }

     const result: ResBody = await this.handleFunc(request);
  
     return this.responseBodyEncoder?.(result) || result.toString();
   }
}

export function createPipeline(module: any, filename: string): Pipeline<any, any, any, any> {
  // If a name is defined use the defined name otherwise use the filename
  const name = module.name || filename?.split('/').pop();

  if(!module.handle) {
     throw new PipelineError({
       pipeline: name,
       message: 'No handle func',
     });
  }

  if(!module.method) {
    throw new PipelineError({
      pipeline: name,
      message: 'No method defined',
    });
  }

  if(!module.path) {
    throw new PipelineError({
      pipeline: name, 
      message: 'No path defined',
    });
  }

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
