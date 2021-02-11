/**
 * Add property to a module
 */
// TODO: check if the types can be nicer
export const addProperty = (name: string, value: any,) => (module: any): any => {
  module[name] = value;
  return module;
}
