import { HandleFunc } from "@wardtoulet/tipi";

export const path = '/hello/@name';
export const method = 'GET';

// Required parameters are path parameters
type URLParameters = {
  name: string,
};

type QueryParameters = {
  planet: string,
}

export const decodeURLParameters = (requestPath: string) => {
    // Split parts 
    const requestParts = requestPath.split('?')[0].split('/');

    return Object.fromEntries(path.split('/')
      .map((path, idx) => [ path, requestParts[idx] ])
      .filter(([path, _]) => path.startsWith('@'))
      .map(([key, val]) => [ key.slice(1), val ])
    );
}

export const decodeQueryParameters = (requestPath: string) => {
  const query = requestPath.split('?')[1];
  if(query) {
      return Object.fromEntries(query.split('&').map(kv => kv.split('='))) || {};
  } else {
    return {};
  }

}

export const handle: HandleFunc<
  undefined, 
  URLParameters, 
  QueryParameters, 
  undefined,
  string
> = async (req) => {
  return `Hello ${req.urlParameters.name} from planet ${req.queryParameters.planet ?? 'earth'} on host ${req.headers.host}`;
}
