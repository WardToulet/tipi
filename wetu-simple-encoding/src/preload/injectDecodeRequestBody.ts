import { 
  PreloadFunc, 

  mapProperty,
  conditional,

  mapHTTPError,
  RequestBodyDecoder,
  HTTPError,
} from 'wetu';


/**
 * Injects a decodeRequestBody function if a RequestBody export exists 
 * and it implements AutoEncoder from simple-encoding.
 */
const injectDecodeRequestBody: PreloadFunc = conditional(
  ({ RequestBody }: any) => {
    // Check if the module exports a member RequestBody of type object 
    // that extends AutoEncoder from simple-encoding
    return RequestBody?.__proto__.name === 'AutoEncoder';
  },

  // Map the RequestBody property to a decodeRequestBody function to the 
  // RequestBody class
  mapProperty(
    'RequestBody', 
    'decodeRequestBody', 
    (RequestBody): RequestBodyDecoder<typeof RequestBody> => {
      // Return the middleware function
      return (raw: string, contentType: string) => {
        if(contentType !== 'application/json') {
          throw new HTTPError({
            status: 415,
          });
        }
        try {
          // Extract the paramaters to a plane object
          const rawObj = JSON.parse(raw);

          // Return the created object
          return RequestBody.create(rawObj);
        } catch(error) {
          // Catch errors and translate them into a http error
          throw mapHTTPError(400, error);
        }
      }
    },
  )
);

export default injectDecodeRequestBody;
