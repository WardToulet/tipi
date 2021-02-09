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

export default class Pipeline<ReqBody, URLParameters, QueryParameters, ResBody> {
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
     const reqBody = undefined;

     const urlParameters: URLParameters = this.urlParameterDecoder(path);
     const queryParameters: QueryParameters = this.queryParameterDecoder(path);
  
     const resBody: ResBody = this.handleFunc({ reqBody, urlParameters, queryParameters });
  
     return this.resBodyEncoder(resBody);
   }
}

export function createPipeline(module: any): Pipeline<any, any, any, any> {
  if(!module.handle)
     throw 'No handle func';

   const hasUrlParameters = module.path?.includes('@');

  return new Pipeline(
    module.reqBodyDecoder         || reqBodyDecoder.noBody,
    module.decodeUrlParameters    || hasUrlParameters ? urlParameterDecoder.fromPathDef(module.path) : urlParameterDecoder.noParameters,
    module.queryParameterDecoder  || queryParameterDecoder.extract,
    module.handle,
    module.encodeResponseBody     || resBodyEncoder.string,
  );
}
