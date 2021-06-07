import { Endpoint, Request } from "./endpoint";
import { IncomingHttpHeaders } from 'http2';

interface RunProps {
  /**
   * The uri that was used by the user to reach the endpoint
   */
  uri: string,

  /**
   * The path that was matched by the router, (including wildcards)
   *
   * This will be used by the variables- & queryExtractors
   */
  matchedOn: string,

  /**
   * The headers received by the http server
   */
  headers: IncomingHttpHeaders,

  /**
   * The raw body of the request
   */
  rawBody: string,
}


function createProxy<Req extends Request, Res>(endpoint: Endpoint<Req, Res>, { headers, ...props }: RunProps) {
  return new Proxy({
    headers,
    body: undefined, 
    query: undefined,
    variables: undefined,
    context: {},
  }, { 
    get: (obj, prop) => {
      switch(prop) {
        case 'body': {
          if(!obj.body) {
            if(!endpoint.bodyDecoder) {
              throw 'No BodyDecoder, this can be infered by tipi-transform';
            } else {
              obj.body = endpoint.bodyDecoder(props.rawBody);
            }
          }
          return obj.body;
        }

        case 'query': {
          if(!obj.query) {
            if(!endpoint.queryExtractor) {
              throw 'No QueryExtractor, this can be infered by tipi-transform';
            } else {
              obj.query = endpoint.queryExtractor(props.uri);
            }
          }
          return obj.query;
        }

        case 'variables': {
          if(!obj.variables) {
            if(!endpoint.variablesExtractor) {
              throw 'No ParamsExtractor, this can be infered by tipi-transform';
            } else {
              obj.variables = endpoint.variablesExtractor(props.uri, props.matchedOn);
            }
          }
          return obj.variables;
        }

        default: return obj[prop];
      }
    }
  }
)};

// TODO: add a name to endpoints with a fallback constructed from the filename 
export default class Pipeline<Req extends Request, Res> {
  readonly endpoint: Endpoint<Req, Res>;

  constructor(endpoint: Endpoint<Req, Res>) {
    // NOTE: I'm not supper happy with this as this also includes the path 
    // and method which are not used for handeling the request, and are duplicated
    // in the router
    this.endpoint = endpoint;   
  }

  async run(props: RunProps): Promise<string> {
    // Create the request type
    let req = createProxy(this.endpoint, props);

    for(const middleware of this.endpoint.middleware ?? []) {
      // TODO: add the raw req as an argument
      req = await middleware(req);
    }

    console.log(req);

    // @ts-ignore
    let result = await this.endpoint(req);

    if(typeof result === 'object') {
      return JSON.stringify(result);
    } else {
      return String(result);
    }
  }
}
