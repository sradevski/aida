---
id: full-example
title: Putting It All Together
sidebar_label: Putting It All Together
---

Let's see how we can put everything we have learned so far together and create something you would very likely use in a real-world application. The goal is to define our **User** API, have it populated with fake data, and receive fake data when we call our API from the frontend without even having the backend implemented. Moreover, we want an **Open API (Swagger)** documentation for our API, so we can communicate with the backend team about our expectations (even in full-stack teams, or when you are working by yourself, it is still useful to have the API cleanly documented).

If you would have followed all tutorials so far, you should have a directory structure like the following (if not, go ahead and create it):
- sampleDir
  - Models
    - User
      - User.core.js
      - User.endpoints.js
  - .aidarc

Content of the **.aidarc** file: 

```json
{
  "modelsDir": "./Models",
  "outputDir": "./",
  "injectors": [
    {
      "name": "routes",
      "outputType": "none"
    },
    {
      "name": "faked-data-routes",
      "outputType": "file"
    },
    {
      "name": "swagger",
      "outputType": "file"
    }
  ]
}
```

Content of the **User.core.js** file: 

``` javascript 
const User = {
  id: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  ageRange: {
    vtype: 'string',
    faker: ['20-30', '30-40', '40-50', '50+'],
  },
  country: {
    vtype: 'string',
    faker: { faker: 'address.country',
    options: {
        seed: 10,
      },
    },
  },
};

exports.default = User;
```

Content of the **User.endpoints.js** file:

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

Once you have all the models ready, run `aida run`. After running Aida, you will notice that two new files were created: **swagger**, and **faked-data-routes**. Just like that, you have generated swagger documentation, and all defined endpoints are populated with fake data that you can use while developing your frontend application. There are more things that can be done  

In order to check the swagger documentation, you can copy the contents of the **swagger** file, go to [Swagger Editor](https://editor.swagger.io/), and paste it there. That will give you a nicely formatted documentation that you can share with your colleagues.

Using the faked data routes is a bit more involved. Let's say you have a **React** application, but you don't have your **User** endpoints backend implemented yet. Nevertheless, you want to make all the network calls as usual and get some data back, so the development of the frontend is completely independent from the backend. We can achieve that by installing a **faked HTTP consumer** using `npm i @aida/consumer-faked-http` and with just a few lines of code:

```
import fakedHttpConsumer from '@aida/consumer-faked-http';
import routes from './faked-data-routes'; //This is the generated file from aida

export function appConfig() {
  if(process.env.NODE_ENV === "development"){
    fakedHttpConsumer(routes, "localhost:4000/api");
  }
}
```

You can now do your network requests to the defined endpoints as usual, and you will have a mocked API. 

As you can see, it can be really powerful to have your models defined using Aida. These are just some of the countless use-cases you can achieve when your models are defined in a standardized manner. If it is still blurry to you about how to use Aida, go to [this repo example]() TODO: Add example repo location.. where you can find a much larger example. As a next step, you can check the [existing injectors](reference/existing-injectors.md), [existing consumers](reference/existing-consumers.md) and see how you can combine them and what workflow would fit your use-case. 