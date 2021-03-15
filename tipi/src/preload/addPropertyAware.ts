/**
 * Add property to a module, with a function that knows the module
 */
export const addPropertyAware = (name: string, func: (module: any) => any) => (module: any): any => {
  module[name] = func(module);
  return module;
}
