---
id: intro-to-endpoints
title: Introduction to Endpoints
sidebar_label: Introduction to Endpoints
---

As you might have guessed, the **endpoints** model defines the API endpoints by using data models for its request and response schema definitions. The **endpoints** model type differs in its structure, as it represents how data is communicated, and it slightly drifts off from the core idea of data modeling. Nevertheless, endpoints are a fundamental part of how data and data models are used, and it is extremely powerful to have both data models and API definitions in one place.

Without further ado, let's see how a simple **endpoints** model would look like. 

`cd` to **sampleDir/models/User**, and make sure you still have the **User.core.js** file from the **[Enriching The Model](getting-started/enriching-the-model.md)** article. Then, create a new file, called **User.endpoints.js**, and add the following endpoint definitions to it.

```javascript
const UserCore = require('./User.core.js').default;

const User = {
  '/users': {
    put: {
      description: 'Update a user',
      operationId: 'updateUser',
      request: {
        body: UserCore,
      },
      response: {
        '200': {
          description: 'Returns the updated user',
          body: UserCore,
        },
      },
    },
  },

  '/users/{id}': {
    get: {
      description: 'Get a single user',
      operationId: 'getUser',
      request: {
        path: {
          id: UserCore.id,
        },
      },
      response: {
        '200': {
          description: 'Returning the user model',
          body: UserCore,
        },
      },
    },
  },
};

exports.default = User;
```

In the above model, we have defined a `/users` endpoint that has a **PUT** method and a `/users/{id}` endpoint that defines a **GET** method, each with specified request and response definition. As you can see, we have used the **core** of our **User** model to specify the request and response data (although you will probably shrink or extend it as necessary). For all supported properties for the **endpoints** model type, visit the [endpoints model](reference/endpoints-model.md) page.

Before we use our **endpoints** model, let's diverge a bit and talk about how injectors can be chained in the next article.

