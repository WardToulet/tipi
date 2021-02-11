export interface MiddlewareFunc<ReqBody, URLParameters, QueryParameters> {
  (req: Request<ReqBody, URLParameters, QueryParameters>): Request<ReqBody, URLParameters, QueryParameters>
}
