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
      const pipeline = this.routingTree.getPipeline(req.url, req.method as HTTPMethod);

      // Collect the body data into the body variable
      req.on('data', chunk => body += chunk);

      // Handle the request when it is fully recieved
      req.on('end', async () => {
        try {
          const response = await pipeline.run(req.url, body, req.headers);
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

  public addEndpoint(path: string, method: HTTPMethod, pipeline: Pipeline<any, any, any, any, any>) {
    try {
      this.routingTree.addRoute(path, method, pipeline);
    } catch(err) {
      console.error(err);
    }
  }
}

function handleHTTPError(res: http.ServerResponse, error: HTTPError) {
  if(error.name === 'HTTPError') {
  // If the error is HTTPError it wil be send as a response to the client
   
    // Check if the error message is json
    if(error.isObject) {
      res.setHeader('Content-Type', 'application/json');
    }

    // Send the error to the client
    res.statusCode = error.status;
    res.end(error.message);
  } else {
  // If the error is not HTTPError it will be loged on the server, 
  // and an internal server error will be send to the client
    
    // TODO: reference the endpoint that throwed the error
    console.error(`[router]: X threw a non http error ${error.message || error }`);
    res.statusCode = 500;
    res.end('Internal server error');
  }
}
