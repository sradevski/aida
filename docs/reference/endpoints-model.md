---
id: endpoints-model
title: Endpoints Model
sidebar_label: Endpoints Model
---

Most of the inspiration about the endpoints model is from OpenAPI (Swagger 3.0), with few improvements where possible, and few things left out as they might bring more complexity than clarity. For example, it is assumed that the response is 'application/json' type, something that is not true of every endpoint. The idea is to start simple and provide a solution for most of the use cases, and evolve from there and provide an escape hatch for other, less common ones.

Although a bit overwhelming at first, it is best to show all possible properties through a complete example rather than a lengthy documentation, so let's do just that.

``` javascript
const UserEndpoints = {
  '/users': {
    get: {
      description: 'Get filtered users',
      operationId: 'getUsers',
      request: {
        body: userObj,
        query: {
          ...PaginationCursors,
          location: GeoJsonCore,
        },
      },
      response: {
        '200': {
          description: 'Returning the user model',
          body: userObj,
        },
      },
    },

    post: {
      description: "Create a new user",
      operationId: 'createUser',
      request: {
        body: userObj
      },
      response: {
        '302': {
          description:
            'Redirect to the specified strategy, which will, in turn, perform a callback on authorization',
          headers: {
            location: OauthLocationHeader,
          },
        },
      }
    },

    delete: {
      description: 'Deletes a single user based on the id supplied',
      operationId: 'deleteUser',
      request: {
        path: {
          id: userObj.id,
        },
      },
      response: {
        '204': {
          description: 'sucessfully deleted status',
        },
        '403': {
          description:
            'The user does not have permissions to get the social networks of the inquired account',
          body: ErrorCore,
        },
      },
    },
  },
  
  '/users/{id}': {
    get: {
      description: 'Get a single user',
      operationId: 'getUser',
      request: {
        path: { id: userObj.id },
      },
      response: {
        '200': {
          description: 'Returning the user model',
          body: userObj,
        },
      },
    },
  }
}

export default UserEndpoints
```

As we can see, we are creating a User endpoints model. The model has 2 routes, `/users` and `/users/{id}`. 
- Routes are a property of the root endpoints object. 
- Each route has one or more HTTP methods as its properties. 
- Each HTTP method can have a required and unique `operationId`, an optional `description`, `request` property, and a `response` property.
- The `request` property can have a `description` property, as well as optional `path`, `query`, `body`, or `headers` properties, each being an Aida data model.
- The `response` property can have one or more status codes as properties.
- Each status code can have a `description` property, as well as optional `body`, or `headers` properties, each being an Aida data model.

And that's it! Although it might be a bit too much to digest at once, once you try using it everything will come naturally. Whenever you are not sure about the details, you can always refer to this page and example as a reference.