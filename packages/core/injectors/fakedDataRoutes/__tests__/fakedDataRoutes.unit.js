import fakedDataRoutes from '../fakedDataRoutes';
import routes from '../../routes';

const aidaModels = {
  _raw: {
    User: {
      endpoints: {
        '/users': {
          put: {
            description: 'Update a user',
            operationId: 'updateUser',
            request: {
              path: {
                id: {
                  vtype: 'string',
                  required: true,
                  faker: 'random.uuid',
                },
              },
              body: {
                email: {
                  vtype: 'string',
                  faker: 'internet.email',
                  validator: 'email',
                },
              },
            },
            response: {
              '200': {
                description: 'Returns the updated user',
                body: {
                  email: {
                    vtype: 'string',
                    faker: 'internet.email',
                    validator: 'email',
                  },
                },
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
                description: 'Login user',
                body: {},
                headers: {
                  location: {
                    vtype: 'string',
                    required: true,
                    faker: ['flencerOauth://login?data=""'],
                  },
                },
              },
            },
          },
          delete: {
            description: 'Deletes a single user based on the id supplied',
            operationId: 'deleteUser',
            request: {
              query: {
                id: {
                  vtype: 'string',
                  required: true,
                  faker: 'random.uuid',
                },
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

const injectedModels = fakedDataRoutes(routes(aidaModels));

describe('The fakedDataRoutes injector', () => {
  test('returns an empty object when there are no routes', () => {
    const res = injectedModels.fakedDataRoutes.execute();
    console.log(JSON.stringify(res, null, 2));
  });
});
