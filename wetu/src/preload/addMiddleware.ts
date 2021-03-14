import { MiddlewareFunc } from '../endpoint';
/**
 * Adds middleware to an endpoint
 */
// TODO: check if the types can be nicer
export const addMiddleware = (...middleware: MiddlewareFunc<any, any, any>[]) => (module: any): any => {
  if(!module.middleware) {
    module.middleware = middleware; 
  } else {
    module.middleware.push(...middleware);
  }
  return module;
}
