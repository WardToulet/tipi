import { 
  PreloadFunc, 

  mapProperty,
  conditional,

  QueryParameterDecoder,
  queryParameterDecoder,

  mapHTTPError,
  PreloadError,
} from 'wetu';


/**
 * Injects a decodeQueryParameters function if a QueryParameters export exists 
 * and it implements AutoEncoder from simple-encoding.
 *
 * If there are non optional fields in the QueryParameters object the preload will fail
 * and the endpoint won't get mounted.
 */
const injectDecodeQueryParameters: PreloadFunc = conditional(
  ({ QueryParameters }: any) => {
    // Check if the module exports a member QueryParameters of type object 
    // that extends AutoEncoder from simple-encoding
    return QueryParameters?.__proto__.name === 'AutoEncoder';
  },

  // Map the QueryParameters property to a decodeQueryParameters function to the 
  // QueryParameters class
  mapProperty(
    'QueryParameters', 
    'decodeQueryParameters', 
    (QueryParameters): QueryParameterDecoder<typeof QueryParameters> => {
      // Check if all the fields are optional because when cannot inforce that a
      // query variable '?ident=val' is present
      const required = QueryParameters?.fields.filter(({ optional }) => !optional).map(({ field }) => field);
      if(required.length !== 0) {
        throw new PreloadError({ 
          preloadName: 'wetu-simple-encoding/InjectDecodeQueryParameters',
          message: `QueryParameters cannot include required field${ required.length > 1 ? 's' : ''} "${ required.join(', ')}"`,
        });
      }

      // Return the middleware function
      return (path: string) => {
        try {
          // Extract the paramaters to a plane object
          const rawParameters = queryParameterDecoder.extract(path);

          // Return the created object
          return QueryParameters.create(rawParameters);
        } catch(error) {
          // Catch errors and translate them into a http error
          throw mapHTTPError(400, error);
        }
      }
    },
  )
);

export default injectDecodeQueryParameters;
