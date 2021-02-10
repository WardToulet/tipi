# Tipi

Tipi is a straightforward http endpoint framwork with a focus on readablity
and generationg documentation.

Tipi is based on [simple-endpoints](https://github.com/simonBackx/simple-endpoints)
taking it's base idea of using es modules as endpoints and extending on it by
exporting even more as to increase readablity and decrease code size.

## Endpoint

And endpoint is a `es module` (or file if) that exports these items:

### Path

type: `string`

This is the path that needs to get matched inorder to invoke this endpoint.
Variables in paths are included by adding `@ident` in the path.

### Method

type: `HTTPMethod`

This is the method that needs to match inorder to invoke this endpoint.

### decodeRequestBody

type: `(rawBody: string) => RequestBody`

Decodes the body of the raw request into the type required by the handler.

### decodeURLParameters

type: `(url: string) => URLParmeteters`

Decodes the URLParmeteters (defined by '@ident' in the path) of the request
into the type required by the handler.

### decodeQueryParameters

Decodes the queryParameters of the request into the type required by the handler.

type: `(url: string) => QueryParameters`

### handle

type: `(req: {RequestBody, URLParmeteters, QueryParameters}) => ResponseBody`

### encodeResponseBody

type: `(body: ResponseBody) => string`

Encodes the ResponseBody as a string

## Loading & serving modules

To create a router you can use the `loadEndpoints` function which loads
endpoints and returns a promis to a router.

This can be used by nodes http server.

```ts
async function start() {
    const router = await loadEndpoints({ path: `${__dirname}/endpoints` });
    const server = http.createServer(router);
    server.listen(8080, () => console.log('Server started on port 8008'));
}
```

## Module tranformers

Module transformers are called upon modules before the `Pipeline` and routing record
for that endpoint are constructed.

It allows the user to automatically add implementations for the required exports
based on the exports in the module.

Example: automaticaly encode every object as json

```ts
const encodeObject = (module: any) => {
    if(endpoint.ResponseBody instanceof Object) {
      endpoint.encodeResponseBody = JSON.stringify;
    }

    return endpoint;
}
```

The tranformers can be passed to the `loadEndpoints` function
these tranformers will be executed on the modueles that are loaded.

```ts
const router = await loadEndpoints({
    path: `${__dirname}/endpoints`,
    transformers: [
       encodeObject,
    ]
});
```

## Pipeline

From an endpoint module a pipline is constructed this pipeline is inovked by
the router when the it's endpoint is called by a client.

The base flow for a pipeline looks like this.

- The pipelines is invoked and gets `rawBody`, `path` and `headers` as arguments.
- The decode functions run
  - the queryParameters are extracted and parsed
  - the the URLParmeteters are extracted and parsed
  - the requestBody is parsed
  If any of these throw an error the pipleline is canceled and throw an httpError.
- Middleware runs and can modify the request or throw an error which would
  cancel the pipeline.
- The handler function runs getting the Decoded data from the previous step as
  an argument wrapped in a Request object.
- The return of the handler is encoded using the returBodyEncoder.

### Notes

- Some middleware would not need the decoded body, think of checking a bearer
  token for example, or extracting an api key from
  - Create a rawMiddleware type which handles with raw request only
   (before the decode step)
  - Determine in the middleware if the body or parameters are needed and running
    the decoding in the first step that requres it
    (or not if not required by anny middleware). And lazily initiallyizing the
    request data.
