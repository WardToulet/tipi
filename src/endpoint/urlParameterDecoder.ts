export default interface URLParameterDecoder<URLParameters> {
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
