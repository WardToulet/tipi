import Request from './request';

export interface ReqBodyDecoder<ReqBody> {
  (raw: string): ReqBody,
}

export const reqBodyDecoder = {
  noBody: (_raw: string) => undefined
}

export interface URLParameterDecoder<URLParameters> {
  (uri: string): URLParameters,
}

export const urlParameterDecoder = {
  noParameters: (_uri: string) => undefined,
  fromPathDef: (pathDef: string) => {
    const keys = Object.entries(pathDef.split('/').slice(1))
      .filter(([_, p]) => p.startsWith('@'))
      .map(([i, p]) => [i, p.slice(1)]);

    return (path: string): { [key: string]: any } => {
      const parts = path.split('?')[0].split('/').splice(1);
      return Object.fromEntries(keys.map(([i, key]) => [key, decodeURI(parts[i])]));
    }
  }
}

export interface QueryParameterDecoder<QueryParameters> {
  (uri: string): QueryParameters,
}

export const queryParameterDecoder = {
  extract: (uri: string) => {
    const raw = uri.split('?')[1];
    if(raw) {
      return Object.fromEntries(
        raw.split('&')
          .map(kvpair => kvpair.split('='))
      );
    } else {
      return {};
    }
  },
}

export interface HandleFunc<ReqBody, URLParameters, QueryParameters, ResBody> {
  (req: Request<ReqBody, URLParameters, QueryParameters>): ResBody
}

export interface ResBodyEncoder<ResBody> {
  (res: ResBody): string,
}

export const resBodyEncoder = {
  string: (raw: any) => raw.toString(),
  json: (raw: any) => JSON.stringify(raw),
}

export interface Endpoint<ReqBody, URLParameters, QueryParameters, ResBody> {
  reqBodyDecoder: ReqBodyDecoder<ReqBody>,
  urlParameterDecoder: URLParameterDecoder<URLParameters>,
  queryParametersDecoder: QueryParameterDecoder<QueryParameters>,
  handle: HandleFunc<ReqBody, URLParameters, QueryParameters, ResBody>,
}
