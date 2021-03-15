import Request from './request';

/**
 * Handlefunc contains all the bussines logic needed for an endpoint, 
 * it is the function that is eventually executed when the endpoint gets called.
 *
 * @param req {Request} Incapsulates the request made by the client
 * @throws If a HandleFunc throws the request is canceled an an error code gets send to the client
 * @returns {Promise<ResBody>} The data that can be send to the client that made the request (unmarchalled)
 *
 */
export default interface HandleFunc<ReqBody, URLParameters, QueryParameters, ResBody> {
  (req: Request<ReqBody, URLParameters, QueryParameters>): Promise<ResBody>
}
