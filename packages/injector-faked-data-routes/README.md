For now, this injector is supposed to be used for request-response endpoints. There is no support for streaming and websockets yet. Moreover, the only supported response content type is "application/json". The results from this injector can be used by the **@aida/consumer-faked-http** consumer to mock APIs without making network calls to a backend.

This injector should generate a flat object with all defined endpoints similar in structure to the **.endpoints.js** file, except that data models will be replaced with mock data, as in the example below:

```
{
 "/users": {
    "put": {
      "operationId": "updateUser",
      "request": {
        "body": {
          "id": "27bd418b-05e0-4e40-9fb2-54a9ff7de038",
          "email": "Katlynn_Upton@gmail.com",
          "phoneNumber": "914.750.8191 x2376",
          "firstName": "Bobby"
        }
      },
      "response": {
        "200": {
          "application/json": {
            "id": "27bd418b-05e0-4e40-9fb2-54a9ff7de038",
            "email": "Katlynn_Upton@gmail.com",
            "phoneNumber": "914.750.8191 x2376",
            "firstName": "Bobby"
          }
        },
        "400": {
          "application/json": {
            "description": "Quod officiis voluptatem dicta provident est. Aliquid sint aperiam."
          }
        }
      }
    }
  },
  "/users/{id}": {
    "get": {
      "operationId": "getUser",
      "request": {
        "path": {
          "id": "27bd418b-05e0-4e40-9fb2-54a9ff7de038"
        }
      },
      "response": {
        "200": {
          "application/json": {
            "id": "27bd418b-05e0-4e40-9fb2-54a9ff7de038",
            "email": "Katlynn_Upton@gmail.com",
            "phoneNumber": "914.750.8191 x2376",
            "firstName": "Bobby"
          }
        }
      }
    }
  },
  ...
}
```
