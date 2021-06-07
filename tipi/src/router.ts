import { IncomingMessage, ServerResponse } from "http";

import Pipeline from "./pipeline";

export default class Router {
  private routingTree: RoutingTree;

  constructor() {
    this.routingTree = new RoutingTree();
  }

  public handler(req: IncomingMessage, res: ServerResponse) {
    try {
      let body = '';

      const { pipeline, matchedOn } = this.routingTree.getPipeline(
        req.url as string, 
        req.method as string,
      );

      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const response = await pipeline.run({
            uri: req.url as string,
            rawBody: body,
            matchedOn, 
            headers: req.headers,
          });

          res.end(response);
        } catch(error) {
          res.statusCode = 400;
          res.end(String(error));
        }
      });
    } catch(error) {
      // TODO: extract the error code from the error type
      res.statusCode = 400;
      res.end(String(error));
    }
  }

  public mount(pipeline: Pipeline<any, any>) {
    console.log('mounting', pipeline.endpoint.method, pipeline.endpoint.path, pipeline);
    this.routingTree.addRoute(pipeline.endpoint.path, pipeline.endpoint.method, pipeline)
  }
}

class RoutingTree {
  private root: Node;

  public constructor() {
    this.root = {};
  }

  public addRoute(path: string | string[], method: string, pipeline: Pipeline<any, any>) {
    const paths = Array.isArray(path) ? path : [ path ];

    for(const path of paths) {
      const routeParts = path.split('/').slice(1);
      let node = this.root;

      for(const part of routeParts) {
        const isDynamic = part.startsWith('@');
        const name = isDynamic ? part.slice(1) : part;

        if(isDynamic) {
          // Init the dynamic route if needed
          if(!node.dynamic) {
            node.dynamic = {
              variable: name,
              children: {},
            }
          // Check if the dynamic route variable name is consistent
          } else {
            if(node.dynamic.variable != name) {
              throw new InconistentPathVariableError(node.dynamic.variable, name);
            }
          }
          node = node.dynamic.children;
        } else {
          // Init the static property if needed
          if(!node.static) {
            node.static = {};
          }

          // Init the route if needed
          if(!node.static[name]) {
            node.static[name] = {};
          }

          // Set the node to the correct child
          node = node.static[name];
        }
      }

      if(!node.leafs) {
        node.leafs = {};
      }

      node.leafs[method] = pipeline;
    }
  }

  /**
   * Try and get the pipeline for a route (path and method cobination)
   * @returns Pipeline and the routet that got matched if a matching route could be found
   * @throws HttpError (status: 405) if the path exist but not for the method given
   * @throws HttpError (status: 404) if the path does not exists
   */
  // Throws HTTPErrors instead of returning undefined to allow the difference between 404 and 405
  public getPipeline(path: string, method: string): {
    matchedOn: string,
    pipeline: Pipeline<any, any>}
  {
    // The route that got matched
    let matchedOn = '';

    const pathParts = path
      // Remove the query part
      .split('?')[0]
      // Split in to parts
      .split('/')
      // Remove empty parts (before first / and after ending / if presnet)
      .filter(p => p !== '');

    let node: Node | undefined = this.root;

    // Loop through the parts of the path checking the tree if they exist
    for(const part of pathParts) {
      // Add the matched node to the route
      matchedOn += node?.static?.[part] 
        ? `/${part}`
        : `/@${node?.dynamic?.variable}`;

      // IF the partexist as a static child use that othrerwise asume it is a variable
      node = node.static?.[part] || node.dynamic?.children;

      // If the node is undefined the path is invalid and a 404 should be send to the user
      if(!node) {
        // Not found
        throw new Error(JSON.stringify({
          status: 404,
          message: 'Not found'
        }));
      }
   }

    // Check if the path has any leafs 
    // if not it is not a full path and should return 404
    if(!node.leafs) {
      throw new Error(JSON.stringify({ status: 404, message: 'Not found' }));
    }

    // Check if the requested method is supported on the path
    if(node.leafs[method]) {
      // Return the pipeline and the route that was matched to get to it
      return {
        pipeline: node.leafs[method],
        matchedOn
      };
    } else {
      throw new Error(JSON.stringify({ status: 405, message: `Method ${method} not allowed on '${path}'`}));
    }
  }
}

type Node = {
  static?: { [key: string]: Node },
  dynamic?: { 
    variable: string,
    children: Node,
  },

  leafs?: { [key: string]: Pipeline<any, any> },
}

class InconistentPathVariableError extends Error {
  constructor(used: string, expected: string) {
    super(`Inconsistent path variable: ${used} expected ${expected}`);
    this.name = 'InconistentPathVariable';
  }
}
