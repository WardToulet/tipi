/**
 * Maps one property to another
 */
export const mapProperty = (from: string, to: string, map: (from: any) => any) => (module: any): any => {
  // Extract property
  const property = module[from];
  delete module[from];

  if(property) {
    module[to] = map(property);
    return module;
  } else {
    return module;
  }
}
