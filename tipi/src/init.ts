import http from 'http';
import { PreloadFunc } from './preload';
import { Router } from './router';
import { listFilesInDirRecrusively } from './util';
import { HTTPMethod } from './httpHelpers';
import { createPipeline } from './pipeline';
import preCheck from './endpoint/preCheck';
import { postCheck } from '.';
import { Logger, simpleLogger, Log } from './log';

type InitProps = {
  endpoints: string,
  /**
   * Takes the filename of a file inside the `endpoints` directory, 
   * if it returns false this file will be ignored by tipi
   *
   * Note: all valid endpoints still are .js files
   */
  match?: (filename: string) => boolean,
  preload?: PreloadFunc[]
  logger?: Logger,
}

/**
 * Initializes tipi and returns a http router
 */
export default async function init({ 
  endpoints, 
  preload = [],
  logger = simpleLogger,
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
        // Do prechecks
        preCheck(module);

        for(const preloadFunction of preload) {
          module = preloadFunction(module); 
        }

        // Do post checks
        postCheck(module);

        router.addEndpoint(module.path as string, module.method as HTTPMethod, createPipeline(module, filename));

        logger(new Log({
          level: 'LOG',
          message: `Mounted at ${(Array.isArray(module.path) ? module.path : [ module.path ]).map((x: string) => `"${x}"`).join(', ')}`,
          tag: module.name || filename.split('/').pop(),
        }));
      } catch(error) {
        if(error instanceof Log) {
          // Add the name of the endpoint
          error.addTag(module.name || filename.split('/').pop())
          logger(error);
        } else {
          console.error(error);
        }
      }
    }

  return router.handler.bind(router);
}
