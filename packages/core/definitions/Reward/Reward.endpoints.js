import RewardResponse from './Reward.response';
import RewardRequest from './Reward.request';
import ErrorCore from '../Shared/Error.core';

const Reward = {
  '/rewards': {
    get: {
      description: 'Returns all rewards applicable to the requester',
      operationId: 'getAllRewards',
      request: {},
      response: {
        '200': {
          description: 'Returns an array of all rewards applicable to the user',
          body: { rewards: [RewardResponse] },
        },
      },
    },
  },

  '/rewards/{id}': {
    get: {
      description: 'Get details about a reward',
      operationId: 'getReward',
      request: {
        path: {
          id: RewardRequest.id,
        },
      },
      response: {
        '200': {
          description: 'Returns reward details',
          body: RewardResponse,
        },
        default: {
          description: 'Unexpected Error',
          error: ErrorCore,
        },
      },
    },
  },
};

export default Reward;
