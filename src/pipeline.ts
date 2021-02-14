import {
  RequestBodyDecoder,
  URLParameterDecoder,
  QueryParameterDecoder,
  HandleFunc,
  MiddlewareFunc,
  ResBodyEncoder,
  Request,
} from './endpoint';

import { PipelineError } from './errors';

type PipelineArgs<ReqBody, URLParameters, QueryParameters, ResBody> = {
    name: string,
    reqBodyDecoder?: RequestBodyDecoder<ReqBody>,
    urlParameterDecoder?: URLParameterDecoder<URLParameters>,
    queryParameterDecoder?: QueryParameterDecoder<QueryParameters>,
    handleFunc: HandleFunc<ReqBody, URLParameters, QueryParameters, ResBody>,
    middleware?: MiddlewareFunc<ReqBody, URLParameters, QueryParameters>[],
    resBodyEncoder?: ResBodyEncoder<ResBody>,
}

export default class Pipeline<ReqBody, URLParameters, QueryParameters, ResBody> {
  readonly name: string;
  readonly reqBodyDecoder?: RequestBodyDecoder<ReqBody>;
  readonly urlParameterDecoder?: URLParameterDecoder<URLParameters>;
  readonly queryParameterDecoder?: QueryParameterDecoder<QueryParameters>;
  readonly middleware?: MiddlewareFunc<ReqBody, URLParameters, QueryParameters>[];
  readonly handleFunc: HandleFunc<ReqBody, URLParameters, QueryParameters, ResBody>;
  readonly resBodyEncoder?: ResBodyEncoder<ResBody>;
  public context: { [key: string]: any } = {};

  constructor({
    reqBodyDecoder,
    urlParameterDecoder,
    queryParameterDecoder,
    handleFunc,
    resBodyEncoder,
    middleware,
    name,
  }: PipelineArgs<ReqBody, URLParameters, QueryParameters, ResBody>) {
    this.reqBodyDecoder = reqBodyDecoder;
    this.urlParameterDecoder = urlParameterDecoder;
    this.queryParameterDecoder = queryParameterDecoder;
    this.handleFunc = handleFunc;
    this.resBodyEncoder = resBodyEncoder;
    this.middleware = middleware;
    this.name = name;
  }

   async run(path: string, rawBody: string, headers: { [key: string]: string}): Promise<string> {
     let request = new Request<ReqBody, URLParameters, QueryParameters>({
        path,
        rawBody,
        headers,
        reqBodyDecoder: this.reqBodyDecoder,
        urlParameterDecoder: this.urlParameterDecoder,
        queryParameterDecoder: this.queryParameterDecoder,
     });

     for(const middleware of this.middleware || [] ) {
        // Await on each middleware function because it must run in order
        request = await middleware(request);
     }

     const result: ResBody = await this.handleFunc(request);
  
     return this.resBodyEncoder?.(result) || result.toString();
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
    reqBodyDecoder: module.decodeRequestBody,
    urlParameterDecoder: module.decodeURLParameters,
    queryParameterDecoder: module.decodeQueryParameters,
    handleFunc: module.handle,
    resBodyEncoder: module.encodeResponseBody, 
    middleware: module.middleware,
  });
}
