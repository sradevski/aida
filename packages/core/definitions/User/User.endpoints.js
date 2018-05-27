import UserResponse from './User.response';
import UserRequest from './User.request';
import ErrorCore from '../Shared/Error.core';

const User = {
  '/users': {
    put: {
      description: 'Update a user',
      operationId: 'updateUser',
      request: {
        body: UserRequest,
      },
      response: {
        '200': {
          description: 'Returns the updated user',
          body: UserResponse,
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
          id: UserRequest.id,
        },
      },
      response: {
        '200': {
          description: 'Returning the user model',
          body: UserResponse,
        },
        default: {
          description: 'Unexpected Error',
          error: ErrorCore,
        },
      },
    },
    delete: {
      description: 'Deletes a single user based on the id supplied',
      operationId: 'deleteUser',
      request: {
        path: {
          id: UserRequest.id,
        },
      },
      response: {
        '204': {
          description: 'sucessfully deleted status',
        },
      },
    },
  },
};

export default User;
