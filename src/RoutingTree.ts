import Pipeline from './Pipeline';

export default class RoutingTree {
  private root: Node;

  public constructor() {
    this.root = {};
  }

  public addRoute(path: string, method: string, pipeline: Pipeline<any, any, any, any>) {
    const routeParts = path.split('/').slice(1);
    let node = this.root;

    for(const part of routeParts) {
      const isDynamic = part.startsWith('@');
      const name = isDynamic ? part.slice(1) : part;
      const childType = isDynamic ? 'dynamic' : 'static';

      if(!node[childType]) {
        node[childType] = {};
      }

      if(!node[childType][name]) {
        node[childType][name] = {};
      }

      node = node[childType][name];
    }

    if(!node.leafs) {
      node.leafs = {};
    }

    node.leafs[method] = pipeline;
  }

  public getPipeline(path: string, method: string): Pipeline<any, any, any, any> | undefined {
    const pathParts = path.split('/').slice(1);
    let node = this.root;

    for(const part of pathParts) {
      const isDynamic = part.startsWith('@');
      const name = isDynamic ? part.slice(1) : part;
      const childType = isDynamic ? 'dynamic' : 'static';

      node = node[childType]?.[name];

      if(!node) {
        return undefined;
      }
    }

    return node.leafs?.[method];
  }
}

type Node = {
  static?: { [key: string]: Node },
  dynamic?: { [key: string]: Node },
  // TODO: replace string with http method type
  leafs?: { [key: string]: Pipeline<any, any, any, any> },
}
