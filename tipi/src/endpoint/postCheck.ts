import { PipelineError } from '../errors';
import preCheck from "./preCheck";

/**
 * These are the expots allowed to be present after having run the preloadFuntions
 */
const whitelist = [
  'name',

  // For routing
  'path',
  'method',

  // For pipeline
  'handle',
  'middleware',
  'encodeResponseBody',
  'decodeRequestBody',
  'decodeURLParameters',
  'decodeQueryParameters',

  // For documentation
];


/**
 * Checks the module after being ran through the preloadFunctions
 */
export default function postCheck(endpoint: any) {
  // Repeat the preChecks to make shure no sneaky progammer has changed the good exports
  preCheck(endpoint);

  const orphans = Object.keys(endpoint).filter(ex => !whitelist.includes(ex));

  if(orphans.length !== 0) {
    throw new PipelineError({
      endpoint: endpoint.name,
      message: `Found orphan exports "${orphans.join(', ')}", these should be used by by preloadFunctions or removed."`
    });
  }
}
