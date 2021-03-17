# Endpoint

An endpoint is a typescript module that contains and exports all the metadata 
and logic to handle an HTTP endpoint.

It must export certain members to be considered a valid endpoint.
If an endpoint appears to be missing some of these or contains extra exports
this may be because they are automatically derived or used to derive other exports 
during the [preload stage](preload.md).

## Exports

### Method

Method is a `string` containing a valid `HTTP method/verb` and is **required**

```ts
export const method = 'GET';
```

### Path

Path is a `string` or `string[]` containing one or more paths on which the endpoint
will be accessable the must start with a '/' and contain only url valid characters.

Variables can be added in the path by prefixing a part
(between two slashes or between the last slash and the end of the string) with a colon ':'.

When multiple paths are provided all paths must contain the same variables 
but not nesiccarily in the same order.


```ts
// Single path
export const path = '/hello-world';

// Multipe paths
export const path = [ '/foo', '/bar' ];

// Variable
export const path = '/user/:id';

// Variable and multiple paths
export const path = [ '/user/:id', '/info/:id/account' ]
```

### Middleware

[main MiddlewareFunc docs](middleware.md)

Middleware is a `MiddlewareFunc[]`.

The middleware functions are executed in the order of the array before the 
handle funcion is executed.

Middleware functions have two main purposes.

- By **throwing errors** the handeling of the request is terminated and the error
  will be transtlated into an appopritae HTTP status code for the client. 

- Adding **contextual data** which can be accessed by the HandleFunc by adding data 
  to the context field of the request parameter.

Since middleware funcitions are designed to be used on many different endpoints
the are offten imported and not declared in the endpoint module, 
or automaticaly imported using the [preload](preload.md) functionality.

```ts
import { foo } from 'bar';

export const middleware = [
    foo,
];
```

### Handle

[main HandleFunc docs](handlefunc.md)

Handle is a `HandleFunc<ReqBody, URLParameters, QueryParameters, Context, ResBody>`.

It is where the endpoint logic is implemented.

```ts
export const handle: HandlerFunc<undefined, undefined, undefined, undefined, string> = async (_req) => {
    return 'Hello world';
}
```

### RequestBodyDecoder

RequestBodyDecoder `RequestBodyDecoder<ReqBody>` is a function that takes the raw body and the cont
ent type and produces an object of the type required by handle.

If it is not possible to decode the body this function may throw an error 
then the handleing of the request will be terminated.

When not requestBodyDecoder is provided nothing will happen when loading the module
but if the body is requested by a middleware- or the handlefunction the 
handeling of the request will be terminated and an status 500 send to the client.

```ts
const requestBodyDecoder: RequestBodyDecoder<Req> = (raw: string, contentType: string) => {
    // Checks the content type
    if(contentType !== 'application/json') throw new HTTPError({
        status: 415,
    });
        
    const { name } = JSON.parse(raw);

    // Check if the name is persent
    if(!name) throw new HTTPError({
        status: 400,
    });

    return new Req(name);
}
```

### QueryPararameterDecoder

QueryParameterDecoder `QueryPararameterDecoder<QueryParams>` is a function that takes the path provided by the client
and extracts the query parameters as an QueryParams object. There is a default implementation for this as it does no checking 
because all queryParameters are optional.

### URLParameterDecoder

The URLParameterDecoder extracts the url parameters from the path provided by the client.

**BUG** This does not work properliy when multiple paths have arguments in different orders.

### ResponseBodyEncoder 

ResponseBodyEncoder `ResponseBodyEncoder<ResBody>` is responsible for transforming the
responseBody returned by the handlefunction and setting any nessecariy headers.

If no encoder is provided the `toString` method of the ResBody will be used to
stringify the response and the `content-type` header will be set to `text/plain`

```ts
const resonseBodyEncoder: ResponseBodyEncoder = (body) => {
    return {
        body: JSON.stringify(body),
        headers: {
            'content-type': 'application/json',
        }
    }
}
```

## Example

A simple hello world endpoint returning a string.

* `GET /hello/ward` Hello ward from planet earth
* `GET /hello/elon?planet=mars` Hello elon from planet mars

```ts
import { HandleFunc } from "tipi";

export const path = '/hello/@name';
export const method = 'GET';

// Required parameters are path parameters
type URLParameters = {
  name: string,
};

type QueryParameters = {
  planet: string,
}

// NOTE: this can be infered by preload or build on top of standard implemenations
export const decodeURLParameters = (requestPath: string) => {
    // Split parts 
    const requestParts = requestPath.split('?')[0].split('/');

    return Object.fromEntries(path.split('/')
      .map((path, idx) => [ path, requestParts[idx] ])
      .filter(([path, _]) => path.startsWith('@'))
      .map(([key, val]) => [ key.slice(1), val ])
    );
}

// TODO: this should be use by default
export const decodeQueryParameters = (requestPath: string) => {
  const query = requestPath.split('?')[1];
  if(query) {
      return Object.fromEntries(query.split('&').map(kv => kv.split('='))) || {};
  } else {
    return {};
  }
}

export const handle: HandleFunc<undefined, URLParameters, QueryParameters, undefined, string> = async (req) => {
  return `Hello ${req.urlParameters.name} from planet ${req.queryParameters.planet ?? 'earth'}`;
}
```
