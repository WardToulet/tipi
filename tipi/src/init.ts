import http from 'http';
import Pipeline from './pipeline';
import Router from './router';

import { listFilesInDirRecrusively } from './util';

// TODO: add an option to read the endpoint directory and match 
// from tsconfig, since it must be defined there to allow passing
// options to the custom transformer, this will alow for this to be
// only declared in one place
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
}

/**
 * Initializes tipi and returns a http router
 */
export default async function init({ 
  endpoints, 
  match,
}: InitProps):
  Promise<(req: http.IncomingMessage, res: http.ServerResponse) => void>
{
  const router = new Router();

  // If no match function is provided allow all files
  const isModule = match || (() => true);

  const modules = (await listFilesInDirRecrusively(endpoints))
    // Check if the file is a .js file, this is not .ts since we are loading modules 
    // at runtime
    .filter(x => x.endsWith('.js'))
    // Use the provided match method to check if the file is an endpoint, this is
    // to allow the users to have none endpoint files in the endopoint directory
    // (e.g. test files)
    .filter(x => isModule(x.split('/').pop() as string))
    // Load the module dynamically, this returns a promise 
    // so we wrap the loaded module and the path in another promise that and wait
    // for everything to resolve
    .map(module => Promise.all([import(module), Promise.resolve(module)]));

    // TODO: load the module
    (await Promise.all(modules)).forEach(([ module ]) => {
        router.mount(new Pipeline(module.default));
    });

  return router.handler.bind(router);
}
