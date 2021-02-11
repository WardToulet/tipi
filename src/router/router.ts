import http from 'http';
import Pipeline, { createPipeline } from '../pipeline';
import { listFilesInDirRecrusively } from '../util';
import RoutingTree from './routingTree';
import { EndpointTransformer } from '../endpoint';
import { HTTPMethod } from '../httpHelpers';

class Router {
  private routingTree: RoutingTree;
 
  constructor() {
    this.routingTree = new RoutingTree();
  }

  public handler(req: http.IncomingMessage, res: http.ServerResponse) {
    let body = '';

    const pipeline = this.routingTree.getPipeline(req.url, req.method as HTTPMethod);

    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      if(pipeline) {
        try {
          res.end(pipeline.run(req.url, body, req.headers as { [key: string]: string }));
        } catch(err) {
          if(err.name === 'HTTPError') {
            // Send the error to the client
            res.statusCode =  err.status;
            res.end(err.message);
          } else {
            // An non http error can not be send to the user this is logged on the server
            // TODO: reference the endpoint that throws
            console.error(`[tipi/router]: X threw a non http error ${err.message}`);
            res.statusCode = 500;
            res.end('Internal server error');
          }
        }
      } else {
        res.statusCode = 404;
        res.end('Not found', 'utf-8');
      }
    });
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
  transformers?: EndpointTransformer[];
}

export async function loadEndpoints({ path, transformers = []}: LoadEndpointsProps):
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
