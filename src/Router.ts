import http from 'http';
import Pipeline, { createPipeline } from './Pipeline';
import { listFilesInDirRecrusively } from './Util';
import RoutingTree from './RoutingTree';
import { ModuleTranformer } from './ModuleTranformer';
import { HTTPMethod } from './HttpMethod';

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
          res.end(pipeline.run(req.url, body));
        } catch(err) {
          res.statusCode = 400;
          res.end(err.message);
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
  transformers?: ModuleTranformer[];
}

export async function loadEndpoints({ path, transformers = []}: LoadEndpointsProps): Promise<(req: http.IncomingMessage, res: http.ServerResponse) => void> {
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

