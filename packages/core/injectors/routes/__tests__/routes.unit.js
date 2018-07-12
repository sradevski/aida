import routes from '../routes';

const aidaDefinitions = {
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

    Player: {
      endpoints: {
        Free: {
          '/player/stop': {
            put: {
              operationId: 'stop player',
              request: {
                body: {},
              },
              response: {
                '200': {
                  body: {},
                },
              },
            },
          },
        },

        Premium: {
          '/player/play': {
            put: {
              operationId: 'play player',
              request: {
                body: {},
              },
              response: {
                '200': {
                  body: {},
                },
              },
            },
          },
        },
      },
    },
  },
};

describe('The routes injector', () => {
  test('returns an empty object for definitions that do not have endpoints file.', () => {
    const flatRoutes = routes({ _raw: {} }).routes.execute();
    expect(Object.keys(flatRoutes)).toHaveLength(0);
  });

  test('returns all routes in a definition without categories', () => {
    const flatRoutes = routes(aidaDefinitions).routes.execute();
    expect(flatRoutes).toEqual({
      ...aidaDefinitions._raw.User.endpoints,
    });
  });

  test('returns the routes with base url prepended to them', () => {
    const flatRoutes = routes(aidaDefinitions).routes.execute({
      baseUri: 'www.test.com',
    });
    expect(Object.keys(flatRoutes)).toEqual([
      'www.test.com/users',
      'www.test.com/users/{id}',
    ]);
  });

  test('returns endpoints only for the specified categories', () => {
    const flatRoutes = routes(aidaDefinitions).routes.execute({
      category: 'Free',
    });

    expect(flatRoutes).toEqual({
      ...aidaDefinitions._raw.User.endpoints,
      ...aidaDefinitions._raw.Player.endpoints.Free,
    });
  });
});
