import http from 'http';
import { PreloadFunc } from './preload';
import { Router } from './router';
import { listFilesInDirRecrusively } from './util';
import { HTTPMethod } from './httpHelpers';

import { createPipeline } from './pipeline';

import preCheck from './endpoint/preCheck';
import postCheck from './endpoint/postCheck';

type InitProps = {
  /**
   * Path to the folder contining the endpoints to load.
   */
  endpoints: string,

  /**
   * Takes the filename of a file inside the `endpoints` directory, 
   * if it returns false this file will be ignored by tipi
   *
   * Note: all valid endpoints must be .js files, this is checked before 
   *       the match function is ran
   */
  match?: (filename: string) => boolean,

  /**
   * List of preload functions that are ran before an endpoint is moutned in the 
   * routing tree
   */
  preload?: PreloadFunc[]
}

/**
 * Initializes tipi and returns a http router
 */
export default async function init({ 
  endpoints, 
  preload = [],
  match,
}: InitProps):
  Promise<(req: http.IncomingMessage, res: http.ServerResponse) => void>
{
  const router = new Router();

  // If no match function is provided allow all files
  const isModule = match || (() => true);

  const modules = (await listFilesInDirRecrusively(endpoints))
    // Check if the file is a .js file
    .filter(x => x.endsWith('.js'))
    // Use the provided match method to check if the file is an endpoint
    .filter(x => isModule(x.split('/').pop() as string))
    // Load the module dynamically because this returns a promise 
    // we wrap the loaded module and the path in another promise
    .map(module => Promise.all([import(module), Promise.resolve(module)]));

    // If a preloadFunction throws the loading of the endpoint is canceled
    for(let [ module, filename ] of await Promise.all(modules)) {
      try {
        // If the module has no `name` export derive this from the filename
        if(!module['name']) {
          module.name = filename.split('/').pop()?.split('.')[0];
        }

        // Do prechecks: check if the module exports the minimal exports
        // method, path and handle
        preCheck(module);

        // Do the precheck to modify the endpoints
        for(const preloadFunction of preload) {
          module = preloadFunction(module); 
        }

        // Do post checks: to check how if all the required exports are present
        // and if no nonstandard exports are still present as these may sugest
        // that some preload functionality was exptecte when it didn't run
        postCheck(module);

        // Add the endpoint to the router
        router.addEndpoint(module.path as string, module.method as HTTPMethod, createPipeline(module));

        // TODO: propper logging
        console.log(`Mounted at ${(Array.isArray(module.path) ? module.path : [ module.path ]).map((x: string) => `"${x}"`).join(', ')}`);
      } catch(error) {
          console.error(error);
      }
    }

  return router.handler.bind(router);
}
