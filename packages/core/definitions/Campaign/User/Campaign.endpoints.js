import CampaignResponse from './Campaign.response';
import CampaignRequest from './Campaign.request';
import ErrorCore from '../../Shared/Error.core';

const Campaign = {
  '/campaigns': {
    get: {
      description: 'Returns all campaigns applicable to the requester',
      operationId: 'getAllCampaigns',
      request: {},
      response: {
        '200': {
          description: 'Returns an array of campaigns',
          body: [CampaignResponse],
        },
      },
    },
  },
  '/campaigns/sets': {
    get: {
      description: 'Returns all campaign sets applicable to the requester',
      operationId: 'getCampaignSets',
      request: {},
      response: {
        '200': {
          description: 'Returns an array of campaigns',
          body: [CampaignResponse],
        },
      },
    },
  },
  '/campaigns/{id}': {
    get: {
      description: 'Get a single Campaign',
      operationId: 'getCampaign',
      request: {
        path: {
          id: CampaignRequest.id,
        },
      },
      response: {
        '200': {
          description: 'Returning the Campaign model',
          body: CampaignResponse,
        },
        default: {
          description: 'Unexpected Error',
          error: ErrorCore,
        },
      },
    },
  },
};

export default Campaign;
