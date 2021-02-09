import http from 'http';
import Pipeline, { createPipeline } from './Pipeline';
import { listFilesInDirRecrusively } from './Util';
import RoutingTree from './RoutingTree';

class Router {
  // TODO: use a tree to improve speed
  private routingTree: RoutingTree;
 
  constructor() {
    this.routingTree = new RoutingTree();
  }

  public handler(req: http.IncomingMessage, res: http.ServerResponse) {
    let body = '';

    const pipeline = this.routingTree.getPipeline(req.url, req.method);

    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      if(pipeline) {
        res.end(pipeline.run(req.url, body));
      } else {
        res.statusCode = 404;
        res.end('Not found', 'utf-8');
      }
    });
  }

  public addEndpoint(path: string, method: string, pipeline: Pipeline<any, any, any, any>) {
    try {
      this.routingTree.addRoute(path, method, pipeline);
    } catch(err) {
      console.error(err);
    }
  }
}

export async function loadEndpoints(dir: string) {
  const router = new Router();

  const imports = (await listFilesInDirRecrusively(dir))
    .filter(x => x.match(/[a-zA-Z0-9]\.(js|ts)$/))
    .map(module => import(module));

  (await Promise.all(imports)).forEach(module => {
    router.addEndpoint(module.path as string, module.method as string, createPipeline(module))
  });

  console.log(JSON.stringify(router, undefined, 2));

  const server = http.createServer(router.handler.bind(router));
  server.listen(8090, () => console.log(`Server started on port 8090`));
}

