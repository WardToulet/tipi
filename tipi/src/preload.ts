import { MiddlewareFunc } from "./endpoint";

/**
 * A preload function modifies a module by taking a module in an returning 
 * a module as its argument
 */
export interface PreloadFunc {
  (module: {}): {};
}

/**
 * A conditional preload function, wraps another preload with a predicate
 *
 * @arg: predicate: a function which takes the moduel and returns a boolean -
 * if this returns true the preload function is executed if not the preload step is abored
 *
 * @arg: preload: the preload function that will run if the predicate returns true
 **/
export const conditional = (
  predicate: (module: {}) => boolean,
  preload: PreloadFunc,
): PreloadFunc => (module: {}) => predicate(module) 
  ? preload(module) 
  : module;

/**
 * Maps a one property to another
 *
 * @arg from the original property name
 * @arg to the new peoprty name
 * @arg map the mapping function prducing the new property
 *
 * @throws When trying to overwrite a defined property
 * @throws When trying to map to middleware
 *
 * @returns PreloadFunc
 *
 * Note: this cannot be used for middelware mapping, all the middleware 
 * functions reside in a single export.
 * To map to middelware use `mapPropertyToMiddelware`
 */
export const mapProperty = (
  from: string, 
  to: string, 
  map: (from: any) => any
): PreloadFunc => (module: {}) => {
  // If the from member does not exist just return the module
  // we don't throw here to allow the use of this function without alway needing
  // to wrap it in a conditional
  if(!module[from])
    return module;
 
  // FIXME: use a better error type to propageate in which preload step the error occured 
  // The to property is defined by the user or another preload function, 
  // the mapping is canceled
  if(module[to])
    throw 'Trying to map to existing property';

  // FIXME: use a better error type to propageate in which preload step the error occured 
  // Mapping to the middelware property is not allowed
  if(to === 'middelware') 
    throw `Trying to map to property "${to}" this is not allowed`;
  
  // Set the to property
  module[to] = map(module[from])

  // Delete the old property
  delete module[from];

  return module;
}

/**
 * Map a property to a middleware function
 *
 * @arg from the property name
 * @arg map the mapping function prducing the middlewareFunc
 *
 * @throws When trying to overwrite a defined property
 *
 * @returns PreloadFunc
 */
export const mapPropertyToMiddleware = (
  from: string, 
  map: (from: any) => MiddlewareFunc<any, any, any, any>
): PreloadFunc => (module: {}) => {
  // If the from member does not exist just return the module
  // we don't throw here to allow the use of this function without alway needing
  // to wrap it in a conditional
  if(!module[from])
    return module;
  
  let property = module[from];

  // Remove the original property
  delete module[from];
      
  return addMiddleware(map(property))(module);
};

/**
 * Adds a middlewaer function to the module
 */
export const addMiddleware = (
  middleware: MiddlewareFunc<any, any, any, any>
): PreloadFunc => (module: {}) => {
  // Init middleware if needed
  if(!module['middleware'])
    module['middleware'] = [];

  (module['middleware'] as MiddlewareFunc<any, any, any, any>[]).push(middleware);

  return module;  
}


















