import ReqeuestBodyDecoder from './requestBodyDecoder';
import URLParameterDecoder from './urlParameterDecoder';
import QueryParameterDecoder from './queryParameterDecoder';
import { IncomingHttpHeaders } from 'http';
import { BasicRequest } from './handle';

type RequestParams<RequestTypes extends BasicRequest> = {
  requestBodyDecoder?: ReqeuestBodyDecoder<RequestTypes['body']>,
  urlParameterDecoder?: URLParameterDecoder<RequestTypes['urlParameters']>,
  queryParameterDecoder?: QueryParameterDecoder<RequestTypes['queryParameters']>,
  path: string,
  rawBody?: string,
  headers: IncomingHttpHeaders,
  route: string,
}

export default class Request<RequestTypes extends BasicRequest> {
  private _body?: RequestTypes['body'];
  private _urlParams?: RequestTypes['urlParameters'];
  private _queryParams?: RequestTypes['queryParameters'];
  private _context: RequestTypes['context'];

  private requestBodyDecoder?: ReqeuestBodyDecoder<RequestTypes['body']>;
  private urlParameterDecoder?: URLParameterDecoder<RequestTypes['urlParameters']>;
  private queryParameterDecoder?: QueryParameterDecoder<RequestTypes['queryParameters']>;

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
  }: RequestParams<RequestTypes>) {
    this._context = {} as RequestTypes['context'];
    this.requestBodyDecoder = requestBodyDecoder;
    this.urlParameterDecoder = urlParameterDecoder;
    this.queryParameterDecoder = queryParameterDecoder;
    this.path = path;
    this.rawBody = rawBody;
    this.headers = headers;
    this.route = route;
  }

  get body(): RequestTypes['body'] {
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
    return this._body as RequestTypes['body'];
  }

  get urlParameters(): RequestTypes['urlParameters'] {
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

  get queryParameters(): RequestTypes['queryParameters'] {
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

  get context(): RequestTypes['context'] {
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
    }) as RequestTypes['context'];
  }
}
