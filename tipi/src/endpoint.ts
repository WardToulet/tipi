import { IncomingHttpHeaders } from 'http2';   

/**
 * The base request of a tipi endpoint. 
 */
export interface Request {
  /**
   * The http headers
   */
  headers: IncomingHttpHeaders,
}

/**
 * The type of the variables (starting with @) in the path defentition.
 *
 * The properties of this type must exactly match the '@' declarations 
 * in the path or paths of the endpoint
 *
 * @extends {Request}
 */
export interface Variables<T extends { [key: string]: string | number }> extends Request {
  variables: T,
}

/**
 * A type containing the query parameters of the endpoint. 
 *
 * @extends {Request}
 */
export interface Query<T extends { [key: string]: string | number | undefined }> extends Request {
  query: T,
}

/**
 * The body of the request
 *
 * @extends {Request}
 */
export interface Body<T> extends Request {
  body: T,
}

/**
 * The context object accessable by the endpoint.
 *
 * This the parameters of this context type will be populated by the middleware. 
 *
 * @extends {Request}
 */
export interface Ctx<T extends { [key: string]: any }> extends Request {
  ctx: T,
}

export interface VariablesExtractor {
  (path: string, matchedOn: string): { [key: string]: number | string }
}

/**
 * Simple implementation of a @link{VariablesExtractor} whitch **doesn't** check the type'
 *
 * @param {string} path
 * @param {string} matchedOn
 */
export const variablesExtractor: VariablesExtractor = (path: string, matchedOn: string) => {
  const pathParts = path.split('?')[0].split('/');
  return Object.fromEntries(
    Object.entries(matchedOn.split('/'))
      .filter(([ _, part ]) => part.startsWith('@'))
      .map(([ idx, part ]) => [ part.slice(1), pathParts[idx]] )
  );
}

export interface QueryExtractor {
  (path: string): { [key: string]: number | string | undefined } 
} 

/**
 * Extract the url encoded qeurys from the path 
 *
 * @param {string} path
 */
export const queryExtractor: QueryExtractor = (path: string) => {
  const [ _, query ] = path.split('?');
  return Object.fromEntries(
    decodeURIComponent(query)
      .split('&')
      .map(entry => entry.split('='))
  );
};

/**
 * A tipi endpoint 
 */
export interface Endpoint<Req extends Request, Res> {
  // TODO: change this type to the actual request type that includes the headers
  // url, ip and all those things
  (req: Req): Promise<Res>,

  /**
   * The http method that will be used to acces this endoint
   */
  method: string,

  /**
   * The path or list of paths used to access this endpoint
   */
  path: string | string[],

  /**
   * The list of middleware functions that are executed in the order that they are 
   * listed.
   *
   * ## Safety
   *
   * The req parameter of the middleware function must be a subset of the endpoint
   * Req excluding the `ctx`.
   *
   * The ctx part of the parameter can be a subset of the cumalative return type 
   * of the previous middleware functions. 
   * (You can't use a ctx property that is not part of the return type of one of
   * the previuous middleware functions)
   *
   * ~~Note: Middleware can be injected by the transformer.~~
   */
  // FIXME: declare a middleware function type
  middleware?: Function[],

  /**
   * Function that takes the variable out of the path and prouces a req.variables
   */
  variablesExtractor?: VariablesExtractor,

  /**
   * Function that thakes the query part of the uri and produces a req.query
   **/
  // FIXME: use proper type
  queryExtractor?: QueryExtractor,

  /**
   * Body decoder, function that takes the raw body and produces a req.body
   */
  // FIXME: use proper type
  bodyDecoder?: Function,
}
