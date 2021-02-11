// Head and Options are not supported for creating endpoints and thus not incuded in this type.
export type HTTPMethod = 'GET'
                       | 'POST'
                       | 'DELETE'
                       | 'PUT'
                       | 'PATCH';

export function isHttpMethod(method: string) {
  return [ 'GET', 'POST', 'DELETE', 'PUT', 'PATCH' ].includes(method);
}
