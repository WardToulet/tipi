Extract the ensdocing/decoding from the request type parameters

foo.endpoint.ts

```ts
export const handle: HandleFunc<
    RequestBody,
    Wildcards,
    Query,
    Context,
    ResponseBody,
> = async (req) => 
    return `Hello ${req.wildcards.name}`;
}
```
 
The analysis step should:

- Extract the types used as the generic arguments.
- Check that parts are not used wthen the are not defined as a generic parameter
  (e.g. you can't use a wildcard if the wildcards parameter is void or undfined)
- Generate decode and encode functions.
- Generate documentation.
