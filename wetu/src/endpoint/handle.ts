import Request from './request';

/**
 * A function to incapsulate all the bussinis logic of an endopint
 */
export default interface HandleFunc<ReqBody, URLParameters, QueryParameters, ResBody, Context> {
  (req: Request<ReqBody, URLParameters, QueryParameters, Context>): Promise<ResBody>
}
