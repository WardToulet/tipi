export default function extractPathVariableNames(pathDef: string | string[]): string[] {
  // If the pathdef is multiple paths (array) we use the first of these (index 0)
  // we known the variables are the same in each step because this is garanteed before
  // the preload step is executed
  const path: string = Array.isArray(pathDef) ? pathDef[0] : pathDef;

  // Extract the variables from the string
  return path.split('/').filter(x => x.startsWith('@')).map(x => x.slice(1));
}
