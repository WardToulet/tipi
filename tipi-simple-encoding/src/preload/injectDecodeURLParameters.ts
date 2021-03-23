import { AutoEncoder } from '@simonbackx/simple-encoding';
import { 
  Preload, 

  URLParameterDecoder,
  urlParameterDecoder,

  mapHTTPError,
  PreloadError,
} from '@wardtoulet/tipi';


/**
 * Injects a decodeURLParameters function if a URLParameters export exists 
 * and it implements AutoEncoder from simple-encoding.
 *
 * If there are optional fields in the URLParameters object the preload will fail
 *
 * If there are fields in the URLParameters object that do not match any of the  
 * variables defined with an `@` in the path the preload will fail.
 */
const injectDecodeURLParameters: Preload.PreloadFunc = Preload.conditional(
  ({ URLParameters }: any) => {
    // Check if the module exports a member URLParameters of type object 
    // that extends AutoEncoder from simple-encoding
    return URLParameters?.prototype instanceof AutoEncoder;
  },

  // Map the URLParameters property to a decodeURLParameters function to the 
  // URLParameters class
  Preload.mapProperty(
    'URLParameters', 
    'decodeURLParameters', 
    (URLParameters): URLParameterDecoder<typeof URLParameters> => {
      //Check if all the fields are required because optional fields are 
      // not supported on URLParameters
      const optionals = URLParameters?.fields.filter(({ optional }) => optional).map(({ field }) => field);
      if(optionals.length !== 0) {
        throw new PreloadError({ 
          preloadName: 'tipi-simple-encoding/InjectDecodeURLParameters',
          message: `URLParameters cannot include optional field${ optionals.length > 1 ? 's' : ''} "${ optionals.join(', ')}"`,
        });
      }
      
      // Return the middleware function
      return (url: string, matched: string) => {
        try {
          // Extract the paramaters to a plane object
          const rawParameters = urlParameterDecoder(url, matched);

          // Return the created object
          return URLParameters.create(rawParameters);
        } catch(error) {
          // Catch erros and translate them into a http error
          throw mapHTTPError(400, error);
        }
      }
    }
  )
);

export default injectDecodeURLParameters;
