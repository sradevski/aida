import BusinessAccountResponse from './BusinessAccount.response';
import BusinessAccountRequest from './BusinessAccount.request';
import ErrorCore from '../../Shared/Error.core';

const BusinessAccount = {
  '/businesses/{id}/info': {
    get: {
      description: 'Get details about a business',
      operationId: 'getBusinessInfo',
      request: {
        path: {
          id: BusinessAccountRequest.id,
        },
      },
      response: {
        '200': {
          description: 'Return details about a business',
          body: BusinessAccountResponse,
        },
        default: {
          description: 'Unexpected Error',
          error: ErrorCore,
        },
      },
    },
  },
};
export default BusinessAccount;
