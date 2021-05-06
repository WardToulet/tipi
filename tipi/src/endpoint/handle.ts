import Request from './request';

/**
 * Handlefunc contains all the bussines logic needed for an endpoint, 
 * it is the function that is eventually executed when the endpoint gets called.
 *
 * @param req {Request} Incapsulates the request made by the client
 * @throws `HTTPError` if the request could not be handled
 * @returns `Promise<ResBody>` The response
 *
 * @example
 * A simple hello world hanndle function that has no parameters, context or body 
 * and returns a string
 * ```
 * export const handle: HandleFunc<undefined, undefined, undefined, undefined, string> = async () => {
 *   return 'Hello world';
 * }
 * ```
 */

// export default interface HandleFunc<ReqBody, URLParameters, QueryParameters, Context, ResBody> {
//   (req: Request<ReqBody, URLParameters, QueryParameters, Context>): Promise<ResBody>
// }
export default interface HandleFunc<RequestTypes extends BasicRequest, ResponseType> {
  (req: Request<RequestTypes>): Promise<ResponseType>
}

export type BasicRequest = {
  body?: any,
  urlParameters?: { [key: string ]: any },
  queryParameters?: { [key: string]: any },
  context?: { [key: string]: any },
}
