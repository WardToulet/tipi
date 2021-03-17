# Middleware

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
