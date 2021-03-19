import { 
  Preload
} from 'tipi';

/**
 * Uses JSON.stringify to encode responses to string if the ResponseBody is exported 
 * and of type Object
 */
const injectEncodeResponseBody: Preload.PreloadFunc = Preload.conditional(
  ({ ResponseBody }: any) => ResponseBody instanceof Object,
  Preload.mapProperty('ResponseBody', 'encodeResponseBody', (_) => (responseBody: {}) => ({
    body: JSON.stringify(responseBody),
    headers: { 'content-type': 'application/json' },
  }))
);

export default injectEncodeResponseBody;
