import { 
  PreloadFunc, 
  conditional,
  mapProperty,
} from 'wetu';


/**
 * Uses JSON.stringify to encode responses to string if the ResponseBody is exported 
 * and of type Object
 */
const injectEncodeResponseBody: PreloadFunc = conditional(
  ({ ResponseBody }) => ResponseBody instanceof Object,
  mapProperty('ResponseBody', 'encodeResponseBody', (_) => (responseBody: {}) => ({
    body: JSON.stringify(responseBody),
    headers: { 'content-type': 'application/json' },
  }))
);

export default injectEncodeResponseBody;
