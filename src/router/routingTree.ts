import Pipeline from '../pipeline';
import { HTTPMethod } from '../httpHelpers';
import {HTTPError} from '..';

export default class RoutingTree {
  private root: Node;

  public constructor() {
    this.root = {};
  }

  public addRoute(path: string, method: HTTPMethod, pipeline: Pipeline<any, any, any, any>) {
    const paths = Array.isArray(path) ? path : [ path ];

    for(const path of paths) {
      console.log(path);
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
   * @returns Pipeline if a matching route could be found
   * @throws HttpError (status: 405) if the path exist but not for the method given
   * @throws HttpError (status: 404) if the path does not exists
   */
  // Throws HTTPErrors instead of returning undefined to allow the difference between 404 and 405
  public getPipeline(path: string, method: HTTPMethod): Pipeline<any, any, any, any> {
    const pathParts = path
      // Remove the query part
      .split('?')[0]
      // Split in to parts
      .split('/')
      // Remove empty parts (before first / and after ending / if presnet)
      .filter(p => p !== '');

    let node = this.root;

    // Loop throug the parts of the path checking the tree if they exist
    for(const part of pathParts) {
      node = node.static?.[part] || node.dynamic?.children;

      // If the node is undefined the path is invalid and a 404 should be send to the user
      if(!node) {
        // Not found
        throw new HTTPError({
          status: 404,
          message: 'Not found'
        });
      }
    }

    // Check if the path has any leafs 
    // if not it is not a full path and should return 404
    if(!node.leafs) {
      throw new HTTPError({ status: 404, message: 'Not found' });
    }

    // Check if the requested method is supported on the path
    if(node.leafs[method]) {
      return node.leafs[method];
    } else {
      throw new HTTPError({ status: 405, message: `Method ${method} not allowed on '${path}'`});
    }
  }
}

type Node = {
  static?: { [key: string]: Node },
  dynamic?: { 
    variable: string,
    children: Node,
  },

  leafs?: { [key: string]: Pipeline<any, any, any, any> },
}

class InconistentPathVariableError extends Error {
  constructor(used: string, expected: string) {
    super(`Inconsistent path variable: ${used} expected ${expected}`);
    this.name = 'InconistentPathVariable';
  }
}
