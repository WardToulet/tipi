import { 
  ReqBodyDecoder,
  URLParameterDecoder,
  QueryParameterDecoder,
} from './endpoint';

type RequestParams<ReqBody, URLParams, QueryParams> = {
  reqBodyDecoder?: ReqBodyDecoder<ReqBody>,
  urlParameterDecoder?: URLParameterDecoder<URLParams>,
  queryParameterDecoder?: QueryParameterDecoder<QueryParams>,
  path: string,
  rawBody?: string,
  headers: { [key: string]: string },
}

export default class Request<ReqBody, URLParams, QueryParams> {
  private _body?: ReqBody;
  private _urlParams?: URLParams;
  private _queryParams?: QueryParams;

  private reqBodyDecoder: ReqBodyDecoder<ReqBody>;
  private urlParameterDecoder: URLParameterDecoder<URLParams>;
  private queryParameterDecoder: QueryParameterDecoder<QueryParams>;

  readonly path: string;
  private rawBody: string;
  readonly headers: { [key: string]: string };

  constructor({
    reqBodyDecoder,
    urlParameterDecoder,
    queryParameterDecoder,
    path,
    rawBody,
    headers,
  }: RequestParams<ReqBody, URLParams, QueryParams>) {
    this.reqBodyDecoder = reqBodyDecoder;
    this.urlParameterDecoder = urlParameterDecoder;
    this.queryParameterDecoder = queryParameterDecoder;
    this.path = path;
    this.rawBody = rawBody;
    this.headers = headers;
  }

  get body(): ReqBody {
    if(!this._body) {
      if(!this.reqBodyDecoder) {
        throw 'Error: tried to acces body no decoder defined';
      }
      this._body = this.reqBodyDecoder(this.rawBody);
    } 
    return this._body as ReqBody;
  }

  get urlParameters(): URLParams {
    if(!this._urlParams) {
      if(!this.urlParameterDecoder) {
        throw 'Error: tried to access url parameters no decoder defined';
      }
      this._urlParams = this.urlParameterDecoder(this.path);
    }
    return this._urlParams;
  }

  get queryParameters(): QueryParams {
    if(!this._queryParams) {
      if(!this.queryParameterDecoder) {
        throw 'Error: tried to access query parameters no decoder defined';
      }
      this._queryParams = this.queryParameterDecoder(this.path);
    }
    return this._queryParams;
  }
}
