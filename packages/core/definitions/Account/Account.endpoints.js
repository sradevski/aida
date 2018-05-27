import AccountRequest from './Account.request';
import AccountCore from './Account.core';
import ErrorCore from '../Shared/Error.core';

const Account = {
  '/auth/{strategyId}/unlinkStrategy': {
    put: {
      description: 'Unlinks a previously linked social network link.',
      operationId: 'unlinkStrategy',
      request: {
        path: {
          strategyId: AccountRequest.strategies[0].strategyId,
        },
      },
      response: {
        '204': {
          description: 'Unlinking successful',
        },
      },
    },
  },

  '/auth/{strategyId}': {
    get: {
      description: 'Login/Register with the specified strategy',
      operationId: 'authWithStrategy',
      request: {
        path: {
          strategyId: AccountRequest.strategies[0].strategyId,
        },
      },
      response: {
        '204': {
          description:
            'For this special case, there is a redirect using a custom protocol, so you can ignore the response for this url',
        },
      },
    },
  },
  '/account/{id}/socialNetworks': {
    get: {
      description: 'Get the connected social networks of a user',
      operationId: 'getConnectedSocialNetworks',
      request: {
        path: {
          id: AccountRequest.id,
        },
      },
      response: {
        '200': {
          description: 'Returning a list of the connected strategy ids',
          body: [AccountCore.strategies[0].strategyId],
        },
        default: {
          description: 'Unexpected Error',
          error: ErrorCore,
        },
      },
    },
  },
};

export default Account;
