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
