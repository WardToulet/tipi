import http from 'http';
import Pipeline, { createPipeline } from '../pipeline';
import { listFilesInDirRecrusively } from '../util';
import RoutingTree from './routingTree';
import { PreloadFunc } from '../preload';
import { HTTPMethod } from '../httpHelpers';

class Router {
  private routingTree: RoutingTree;
 
  constructor() {
    this.routingTree = new RoutingTree();
  }

  public handler(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      let body = '';

      // Get the pipeline from the routing tree
      // This throws an HTTPError if the path or method is not found
      const pipeline = this.routingTree.getPipeline(req.url, req.method as HTTPMethod);

      // Collect the body data into the body variable
      req.on('data', chunk => body += chunk);

      // Handle the request when it is fully recieved
      req.on('end', () => {
        res.end(pipeline.run(req.url, body, req.headers as { [key: string]: string }));
      });
    } catch(err) {
      if(err.name === 'HTTPError') {
      // If the error is HTTPError it wil be send as a response to the client
       
        // Check if the error message is json
        if(err.isObject) {
          res.setHeader('Content-Type', 'application/json');
        }

        // Send the error to the client
        res.statusCode =  err.status;
        res.end(err.message);
      } else {
      // If the error is not HTTPError it will be loged on the server, 
      // and an internal server error will be send to the client
        
        // An non http error can not be send to the user this is logged on the server
        // TODO: reference the endpoint that throws
        console.error(`[tipi/router]: X threw a non http error ${err.message || err }`);
        res.statusCode = 500;
        res.end('Internal server error');
      }
    }
  }

  public addEndpoint(path: string, method: HTTPMethod, pipeline: Pipeline<any, any, any, any>) {
    try {
      this.routingTree.addRoute(path, method, pipeline);
    } catch(err) {
      console.error(err);
    }
  }
}

type LoadEndpointsProps = {
  path: string,
  preloadFunctions?: PreloadFunc[];
}

export async function loadEndpoints({ path, preloadFunctions: transformers = []}: LoadEndpointsProps):
  Promise<(req: http.IncomingMessage, res: http.ServerResponse) => void>
{
  const router = new Router();

  const imports = (await listFilesInDirRecrusively(path))
    .filter(x => x.match(/[a-zA-Z0-9]\.(js|ts)$/))
    .map(module => import(module));

  (await Promise.all(imports)).forEach(module => {
    let tranformed = transformers.reduce((module, transformer) => transformer(module), module);
    router.addEndpoint(module.path as string, module.method as HTTPMethod, createPipeline(tranformed))
  });

  return router.handler.bind(router);
}
