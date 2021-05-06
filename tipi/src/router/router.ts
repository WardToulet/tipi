import http from 'http';
import Pipeline from '../pipeline';
import RoutingTree from './routingTree';
import { HTTPMethod } from '../httpHelpers';
import {HTTPError} from '../errors';

export default class Router {
  private routingTree: RoutingTree;
 
  constructor() {
    this.routingTree = new RoutingTree();
  }

  public handler(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      let body = '';

      // Get the pipeline from the routing tree
      // This throws an HTTPError if the path or method is not found
      const { pipeline, route } = this.routingTree.getPipeline(req.url as string, req.method as HTTPMethod);

      // Collect the body data into the body variable
      req.on('data', chunk => body += chunk);

      // Handle the request when it is fully recieved
      req.on('end', async () => {
        try {
          const response = await pipeline.run({
            path: req.url as string,
            rawBody: body, 
            headers: req.headers,
            route,
          });
          // Set headers
          // TODO: replace string cast
          Object.entries(response.headers).forEach(([header, value]) => res.setHeader(header, value as string));

          res.end(response.body);
        } catch(err) { 
          // Thrown if pipeline fails
          handleHTTPError(res, err);
        }
      });
    } catch(err) {
      // Thrown if routing could not be done
      handleHTTPError(res, err);
    }
  }

  public addEndpoint(path: string, method: HTTPMethod, pipeline: Pipeline<any, any>) {
    try {
      this.routingTree.addRoute(path, method, pipeline);
    } catch(err) {
      console.error(err);
    }
  }
}

function handleHTTPError(res: http.ServerResponse, error: HTTPError) {
  res.statusCode = error.status || 500;
  res.end(error.message || '');
}
