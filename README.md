# Tipi

Tipi is a straightforward http endpoint framwork with a focus on readablity
and generationg documentation.

Tipi is based on [simple-endpoints](https://github.com/simonBackx/simple-endpoints)
taking it's base idea of using es modules as endpoints and extending on it by
exporting even more as to increase readablity and decrease code size.

## TODO

- [ ] Testing
- [ ] Better logging (dependency incecting logger?)
- [ ] Mixins: extentions that create endpoints, and implement middleware etc.
      (ex: oauth mixing would create endpoints for login in, registering, 
      getting tokens and add middleware to check for tokens and add a user to the context)
- [ ] Typed context?, the context is now a object of type `{ [key: string]: any }`
    It might be nice to get that typed for endusers, as this is populated 
    by middleware we can't be shure that the data will actually be present though.
