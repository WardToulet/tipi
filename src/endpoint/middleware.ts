import { TipiRequest } from './endpoint';

export interface MiddlewareFunc<ReqBody, URLParameters, QueryParameters> {
  (req: TipiRequest<ReqBody, URLParameters, QueryParameters>): TipiRequest<ReqBody, URLParameters, QueryParameters>
}
