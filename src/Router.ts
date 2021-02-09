import http from 'http';
import Pipeline, { createPipeline } from './Pipeline';
import { listFilesInDirRecrusively } from './Util';

class Router {
  // TODO: use a tree to improve speed
  private routes: { [key: string ]: Pipeline<any, any, any, any> }
 
  constructor() {
    this.routes = {};
  }

  public handler(req: http.IncomingMessage, res: http.ServerResponse) {
    let body = '';

    const pipeline = this.routes[`${req.method} ${req.url}`]

    req.on('data', chunk => body += chunk);
    req.on('end', () => res.end(pipeline?.run(req.url, body) || 'Not found'));
  }

  public addEndpoint(path: string, method: string, pipeline: Pipeline<any, any, any, any>) {
    this.routes[`${method} ${path}`] = pipeline;
  }
}

export async function loadEndpoints(dir: string) {
  const router = new Router();

  const imports = (await listFilesInDirRecrusively(dir))
    .filter(x => x.match(/[a-zA-Z0-9]\.(js|ts)$/))
    .map(module => import(module));

  (await Promise.all(imports)).forEach(module => router.addEndpoint(module.path as string, module.method as string, createPipeline(module)));

  const server = http.createServer(router.handler.bind(router));
  server.listen(8090, () => console.log(`Server started on port 8090`));
}

