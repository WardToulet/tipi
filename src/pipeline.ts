import {
  ReqBodyDecoder,
  URLParameterDecoder,
  QueryParameterDecoder,
  HandleFunc,
  ResBodyEncoder,
} from './endpoint';

type PipelineArgs<ReqBody, URLParameters, QueryParameters, ResBody> = {
    reqBodyDecoder: ReqBodyDecoder<ReqBody>,
    urlParameterDecoder: URLParameterDecoder<URLParameters>,
    queryParameterDecoder: QueryParameterDecoder<QueryParameters>,
    handleFunc: HandleFunc<ReqBody, URLParameters, QueryParameters, ResBody>,
    resBodyEncoder: ResBodyEncoder<ResBody>,
}

export default class Pipeline<ReqBody, URLParameters, QueryParameters, ResBody> {
  readonly reqBodyDecoder?: ReqBodyDecoder<ReqBody>;
  readonly urlParameterDecoder?: URLParameterDecoder<URLParameters>;
  readonly queryParameterDecoder?: QueryParameterDecoder<QueryParameters>;
  readonly handleFunc: HandleFunc<ReqBody, URLParameters, QueryParameters, ResBody>;
  readonly resBodyEncoder?: ResBodyEncoder<ResBody>;

  constructor({
    reqBodyDecoder,
    urlParameterDecoder,
    queryParameterDecoder,
    handleFunc,
    resBodyEncoder,
  }: PipelineArgs<ReqBody, URLParameters, QueryParameters, ResBody>) {
    this.reqBodyDecoder = reqBodyDecoder;
    this.urlParameterDecoder = urlParameterDecoder;
    this.queryParameterDecoder = queryParameterDecoder;
    this.handleFunc = handleFunc;
    this.resBodyEncoder = resBodyEncoder;
  }

   run(path: string, rawBody: string, headers: { [key: string]: string}) {
     console.log(headers);
     const reqBody = undefined;

     const urlParameters: URLParameters = this.urlParameterDecoder?.(path);
     const queryParameters: QueryParameters = this.queryParameterDecoder?.(path);
  
     const resBody: ResBody = this.handleFunc({ reqBody, urlParameters, queryParameters, headers });
  
     return this.resBodyEncoder?.(resBody);
   }
}

export function createPipeline(module: any): Pipeline<any, any, any, any> {
  if(!module.handle) {
     throw 'No handle func';
  }

  return new Pipeline({
    reqBodyDecoder: module.decodeRequestBody,
    urlParameterDecoder: module.decodeURLParameters,
    queryParameterDecoder: module.decodeQueryParameters,
    handleFunc: module.handle,
    resBodyEncoder: module.encodeResponseBody, 
  });
}
