import routesMap from '../index.js';
import routes from '@aida/injector-routes';

const aidaModels = {
  _raw: {
    User: {
      endpoints: {
        '/users': {
          put: {
            description: 'Update a user',
            operationId: 'updateUser',
            request: {
              body: {},
            },
            response: {
              '200': {
                description: 'Returns the updated user',
                body: {},
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
                id: {},
              },
            },
            response: {
              '200': {
                description: 'Returning the user model',
                body: {},
              },
              default: {
                description: 'Unexpected Error',
                error: { message: 'Some error occured' },
              },
            },
          },
          delete: {
            description: 'Deletes a single user based on the id supplied',
            operationId: 'deleteUser',
            request: {
              path: {
                id: {},
              },
            },
            response: {
              '204': {
                description: 'sucessfully deleted status',
              },
            },
          },
        },
      },
    },
  },
};

describe('The routes map injector', () => {
  test('returns an empty object for models that do not have endpoints file.', () => {
    const flatRoutes = routesMap(routes({ _raw: {} })).routesMap.execute();
    expect(Object.keys(flatRoutes)).toHaveLength(0);
  });

  test('returns a map of operationId:route for all endpoints in the model', () => {
    const flatRoutes = routesMap(routes(aidaModels)).routesMap.execute();
    expect(flatRoutes).toEqual({
      updateUser: '/users',
      getUser: '/users/{id}',
      deleteUser: '/users/{id}',
    });
  });

  test('throws an error if an endpoint does not have an operationId field', () => {
    const flatRoutes = () =>
      routesMap(
        routes({
          _raw: {
            User: {
              endpoints: {
                '/test': {
                  get: {
                    request: {},
                  },
                },
              },
            },
          },
        }),
      ).routesMap.execute();

    expect(flatRoutes).toThrow();
  });

  test('returns routes object only for the specified category', () => {
    const flatRoutes = routesMap(
      routes({
        _raw: {
          User: {
            endpoints: {
              Free: {
                '/user/{id}': {
                  get: {
                    request: {},
                    operationId: 'getUser',
                  },
                },
              },
            },
          },
        },
      }),
      {
        category: 'Free',
      },
    ).routesMap.execute();

    expect(flatRoutes).toEqual({ getUser: '/user/{id}' });
  });
});
