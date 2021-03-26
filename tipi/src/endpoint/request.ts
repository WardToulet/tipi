import ReqeuestBodyDecoder from './requestBodyDecoder';
import URLParameterDecoder from './urlParameterDecoder';
import QueryParameterDecoder from './queryParameterDecoder';
import { IncomingHttpHeaders } from 'http';

type RequestParams<ReqBody, URLParams, QueryParams> = {
  requestBodyDecoder?: ReqeuestBodyDecoder<ReqBody>,
  urlParameterDecoder?: URLParameterDecoder<URLParams>,
  queryParameterDecoder?: QueryParameterDecoder<QueryParams>,
  path: string,
  rawBody?: string,
  headers: IncomingHttpHeaders,
  route: string,
}

export default class Request<ReqBody, URLParams, QueryParams, Context> {
  private _body?: ReqBody;
  private _urlParams?: URLParams;
  private _queryParams?: QueryParams;
  private _context: Context;

  private requestBodyDecoder?: ReqeuestBodyDecoder<ReqBody>;
  private urlParameterDecoder?: URLParameterDecoder<URLParams>;
  private queryParameterDecoder?: QueryParameterDecoder<QueryParams>;

  readonly path: string;
  private rawBody?: string;
  readonly headers: IncomingHttpHeaders;

  /**
   * The route defenition matched by the router
   */
  readonly route: string;

  constructor({
    requestBodyDecoder,
    urlParameterDecoder,
    queryParameterDecoder,
    path,
    rawBody,
    headers,
    route,
  }: RequestParams<ReqBody, URLParams, QueryParams>) {
    this._context = {} as Context;
    this.requestBodyDecoder = requestBodyDecoder;
    this.urlParameterDecoder = urlParameterDecoder;
    this.queryParameterDecoder = queryParameterDecoder;
    this.path = path;
    this.rawBody = rawBody;
    this.headers = headers;
    this.route = route;
  }

  get body(): ReqBody {
    if(!this._body) {
      if(!this.requestBodyDecoder) {
        throw new Error(JSON.stringify({
          level: 'ERROR',
          message: 'Error: tried to acces body no decoder defined',
          tag: this.path,
        }));
      }
      this._body = this.rawBody ? this.requestBodyDecoder(this.rawBody, this.headers['content-type'] as string) : undefined;
    } 
    return this._body as ReqBody;
  }

  get urlParameters(): URLParams {
    if(!this._urlParams) {
      if(!this.urlParameterDecoder) {
        throw new Error(JSON.stringify({
          level: 'ERROR',
          message: 'Error: tried to access url parameters no decoder defined',
          tag: this.path,
        }));
      }
      this._urlParams = this.urlParameterDecoder(this.path, this.route);
    }
    return this._urlParams;
  }

  get queryParameters(): QueryParams {
    if(!this._queryParams) {
      if(!this.queryParameterDecoder) {
        throw new Error(JSON.stringify({
          level: 'ERROR',
          message: 'Error: tried to access query parameters no decoder defined',
          tag: this.path,
        }));

      }
      this._queryParams = this.queryParameterDecoder(this.path);
    }
    return this._queryParams;
  }

  get context(): Context {
    return new Proxy(this._context as Object, {
      get(target, prop) {
        if(target[String(prop)] === undefined) {
          throw new Error(JSON.stringify({
            level: 'ERROR',
            message: `Error: tried to access context property "${String(prop)}", which is undefined`,
            tag: this.path,
          }));
        } else {
          return target[String(prop)];
        }
      }
    }) as Context;
  }
}
