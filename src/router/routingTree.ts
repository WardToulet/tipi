import Pipeline from '../pipeline';
import { HTTPMethod } from '../httpMethod';

export default class RoutingTree {
  private root: Node;

  public constructor() {
    this.root = {};
  }

  public addRoute(path: string, method: HTTPMethod, pipeline: Pipeline<any, any, any, any>) {
    console.log(`Loading route ${method} ${path}`);
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

  public getPipeline(path: string, method: HTTPMethod): Pipeline<any, any, any, any> | undefined {
    const pathParts = path.split('/').filter(p => p !== '');
    let node = this.root;

    for(const part of pathParts) {
      node = node.static?.[part] || node.dynamic?.children;

      if(!node) {
        return undefined;
      }
    }

    return node.leafs?.[method];
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
