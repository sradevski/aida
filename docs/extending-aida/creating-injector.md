---
id: creating-injector
title: Creating A Custom Injector
sidebar_label: Creating A Custom Injector
---

Injectors are what make Aida useful. The idea behind injectors is each injector in the pipeline "injects" a function of their own, thus enriching the model that was originally passed.

## Rules and Conventions

- Each injector accepts a single parameter (usually called `models`) through which they can access the models information, as well as injected functionality from previous injectors in the pipeline
- Each injector has to be pure (shouldn't modify the passed models).
- Each injector should default-export a single function (usually named `main`)
- The name of the property the injector "injects" into the returning object should match the name of the injector package (after the `@aida/injector-` part) in camelCase. For example `@aida/injector-routes-map` becomes `routesMap`.
- The injected property should have a single function named `execute` that accepts a single `options` object that can contain any options the injector has defined. Each injector can define its own `options` properties, so there is no standardization in that aspect. The `execute` function will return the expected result for that injector.


## Example

``` javascript
//This has to be default exported.
export default function main(models) {
  return {
    ...models, //All models and everything the previous injectors in the pipeline have injected.
    myInjector: {
      //This property has to be called `execute`.
      execute: (options = {}) => {
        return myInjectorResults(options); //This returns something useful for the user.
      },
    },
  };
}
```

## Adding an injector to Aida

Injectors that are generic-enough can be added to the Aida monorepo. Simply create a pull request that adds your injector to the packages, along with unit tests, updated documentation in the website docs (in the reference for existing injectors), and a README.MD that follows some conventions in its formatting (check other injectors for a template).