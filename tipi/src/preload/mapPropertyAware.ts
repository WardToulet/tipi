export const addPropertyAware = (name: string, func: (module: any) => any) => (module: any): any => {
  module[name] = func(module);
  return module;
}

export const mapPropertyAware = (from: string, to: string, map: (property: any, module: any) => any) => (module: any): any => {
  // Extract property
  const property = module[from];
  delete module[from];

  if(property) {
    module[to] = map(property, module);
  } 

  return module;
}
