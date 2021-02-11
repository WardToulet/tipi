import HandleFunc from './handleFunc';
import QueryParameterDecoder from './queryParameterDecoder';
import ReqBodyDecoder from './reqBodyDecoder';
import URLParameterDecoder from './urlParameterDecoder';

export default interface Endpoint<ReqBody, URLParameters, QueryParameters, ResBody> {
  reqBodyDecoder: ReqBodyDecoder<ReqBody>,
  urlParameterDecoder: URLParameterDecoder<URLParameters>,
  queryParametersDecoder: QueryParameterDecoder<QueryParameters>,
  handle: HandleFunc<ReqBody, URLParameters, QueryParameters, ResBody>,
}
