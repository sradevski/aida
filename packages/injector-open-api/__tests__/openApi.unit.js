import swaggerParser from 'swagger-parser';
import openApi from '../index.js';
import routes from '@aida/injector-routes';

const userObj = {
  id: {
    vtype: 'string',
    required: true,
    faker: 'random.uuid',
  },
  email: {
    vtype: 'string',
    faker: 'internet.email',
    validator: 'email',
  },
};

const aidaModels = {
  _raw: {
    User: {
      endpoints: {
        '/users': {
          put: {
            description: 'Update a user',
            operationId: 'updateUser',
            request: {
              body: userObj,
              path: { id: userObj.id },
              query: { id: userObj.id },
            },
            response: {
              '200': {
                description: 'Returns the updated user',
                body: userObj,
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
                id: userObj.id,
              },
            },
            response: {
              '200': {
                description: 'Returning the user model',
                body: userObj,
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
                id: userObj.id,
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

let execute;
beforeAll(() => {
  execute = openApi(routes(aidaModels)).openApi.execute;
});

describe('Open API', () => {
  test('Generates a valid 3.0 version markup', async () => {
    //A quick and dirty way to remove undefined fields.
    const openApiDocs = JSON.parse(JSON.stringify(execute()));

    expect(
      await swaggerParser.validate(openApiDocs, { validate: { spec: false } }),
    ).toBeTruthy();
  });
});
