import Request from './request';

export default interface HandleFunc<ReqBody, URLParameters, QueryParameters, ResBody> {
  (req: Request<ReqBody, URLParameters, QueryParameters>): Promise<ResBody>
}
