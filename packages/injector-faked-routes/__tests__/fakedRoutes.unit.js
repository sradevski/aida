import fakedRoutes from '../index.js';
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
              path: {
                id: {
                  vtype: 'string',
                  faker: ['123'],
                },
              },
              body: {
                email: {
                  vtype: 'string',
                  faker: ['test@request'],
                  validator: 'email',
                },
              },
              query: {
                id: {
                  vtype: 'string',
                  faker: ['456'],
                },
              },
            },
            response: {
              '200': {
                description: 'Returns the updated user',
                body: {
                  email: {
                    vtype: 'string',
                    faker: ['test@response'],
                  },
                },
                headers: {
                  location: {
                    vtype: 'string',
                    faker: ['flencerOauth://login?data=""'],
                  },
                },
              },
            },
          },
        },

        '/users/{id}': {
          delete: {
            description: 'Deletes a single user based on the id supplied',
            operationId: 'deleteUser',
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

const injectedModels = fakedRoutes(routes(aidaModels));

describe('The fakedRoutes injector', () => {
  test('returns an empty object when there are no routes', () => {
    const res = fakedRoutes(routes({ _raw: {} })).fakedRoutes.execute();
    expect(Object.keys(res)).toHaveLength(0);
  });

  test('The passed routes and methods are all present', () => {
    const res = injectedModels.fakedRoutes.execute();
    expect(res).toHaveProperty('/users.put');
    expect(res).toHaveProperty('/users/{id}.delete');
  });

  test('The request path, query, and body are all populated with fake data', () => {
    const res = injectedModels.fakedRoutes.execute();
    expect(res['/users'].put.request.body.email).toBe('test@request');
    expect(res['/users'].put.request.path.id).toBe('123');
    expect(res['/users'].put.request.query.id).toBe('456');
  });

  test('The response body and header fields are populated', () => {
    const res = injectedModels.fakedRoutes.execute();
    expect(res['/users'].put.response[200]['application/json'].email).toBe(
      'test@response',
    );
    expect(res['/users'].put.response[200].headers.location).toBe(
      'flencerOauth://login?data=""',
    );
  });

  test('The response is empty if the response does not contain any data', () => {
    const res = injectedModels.fakedRoutes.execute();
    expect(res['/users/{id}'].delete.response[204]).toEqual({});
  });

  test('The request parameter is optional and set to an empty object if missing', () => {
    const res = injectedModels.fakedRoutes.execute();
    expect(res['/users/{id}'].delete.request).toEqual({});
  });
});
