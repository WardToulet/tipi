/**
 * Extract the paramters from the uri
 */
export default interface URLParameterDecoder<URLParameters> {
  (uri: string, matched: string): URLParameters,
}

export const urlParameterDecoder: URLParameterDecoder<{[key: string]: any}> = (uri, route) => {
  const routeParts = route.split('/').filter(x => x !== '');
  const uriParts = uri.split('/').filter(x => x !== '');

  // Create object from tuple array
  return Object.fromEntries(
    routeParts
      // Zip the parts
      .map((rp, i) => [ rp, uriParts[i] ])
      // Check which parts are variables
      .filter(([r, _]) => r.startsWith('@'))
      // Remove the @
      .map(([k, v]) => [ k.slice(1), v ])
  );
}
