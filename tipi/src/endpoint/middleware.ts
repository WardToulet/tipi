import Request from './request';

/**
 * MiddlewareFunc gets executed beffor the HandleFunc gets executed. 
 * The can be used to perform checks, or add data to the context.
 *
 * @param req {Request} incapluated client request
 * @throws When a MiddlewareFunc throws the request is terminated and an apporiate
 * statuscode is send to the client.
 */
export default interface MiddlewareFunc<ReqBody, URLParameters, QueryParameters, Context> {
  (req: Request<ReqBody, URLParameters, QueryParameters, Context>): Promise<Request<ReqBody, URLParameters, QueryParameters, Context>>
}
