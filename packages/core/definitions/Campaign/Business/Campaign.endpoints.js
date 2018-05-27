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
    post: {
      description: 'Create a campaign',
      operationId: 'createCampaign',
      request: {
        body: CampaignRequest,
      },
      response: {
        '200': {
          description: 'Campaign created successfully',
          body: CampaignResponse,
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
          description: 'Return more details about the campaign',
          body: CampaignResponse,
        },
        default: {
          description: 'Unexpected Error',
          error: ErrorCore,
        },
      },
    },
    delete: {
      description: 'deletes a single campaign based on the ID supplied',
      operationId: 'deleteCampaign',
      request: {
        path: {
          id: CampaignRequest.id,
        },
      },
      response: {
        '204': {
          description: 'Campaign deleted',
        },
      },
    },
  },
};

export default Campaign;
