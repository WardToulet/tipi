export default interface QueryParameterDecoder<QueryParameters> {
  (uri: string): QueryParameters,
}

export const queryParameterDecoder = {
  extract: (uri: string) => {
    const raw = uri.split('?')[1];
    if(raw) {
      return Object.fromEntries(
        raw.split('&')
          .map(kvpair => kvpair.split('='))
      );
    } else {
      return {};
    }
  },
}
