# Tipi transformer design

In the current version of the tipi library. Some checks are done by the lib at runtime
to check if the expected exports are present and valid on each of the matched 
modules.

The runtime is limited in what it can check. To get better checks we will be
checking and transforming the endoints at build time.

## Steps

- Check if the exports are presnent & basic checks
- Interop check, some of the exports are dependent on eachother
    the path export and variables type of the handle method must contain the smame keys
- Transform, add implementations using the transformers

## Cases

Throws an error

```ts
export const method: HTTPMethod = 'GET';
export const path = [ '/hello/@name/@age', '/hello/@age/@name' ]
export const handle: HandleFunc<
    {
        variables: { 
            name: string
            age: number,
        },
    }, 
    string
> = async ({ variables: { name }}) => {
    return `Hello Name`
}
```

## 

I hate visitors I can't figure out how to use them to detect exports.
