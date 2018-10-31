# **Injector** - Routes Map

## Introduction

The **Routes Map** injector generates a hash map of the **operation ID** of an endpoint, and the **URL** for that endpoint (including template placeholders). Note that each endpoint definition must have a unique **operationId** property for each route, otherwise there will be routes missing from the resulting map.

## Dependencies

The **Routes Map** injector depends on:
- [@aida/injector-routes](https://github.com/sradevski/aida/tree/master/packages/injector-routes)

## Use Cases

The main use case for this injector is to generate a file with all defined routes which can be accessed by ID. Using such an approach makes it trivial to make changes to the URL without making any changes to your code that uses the routes map.

## Example

``` javascript
//This is what is generated from the injector
const routesMap = {
  'getUser': '/users/{id}',
  'updateUser': '/users/{id}',
}

//Replaces template placeholders with a concrete value.
function getRoute(routeName, params) {
  const routeTemplate = routesMap[routeName];
  if (!params) {
    return routeTemplate;
  }

  return Object.keys(params).reduce((parsedPath, paramName) => {
    return routeTemplate.replace(`{${paramName}}`, params[paramName]);
  }, '');
}

fetch(getRoute('getUser')) //Make and request as usual
```

## API

### `options`

This injector doesn't take any own options.