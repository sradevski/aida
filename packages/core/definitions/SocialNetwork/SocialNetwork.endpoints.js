import SocialNetworkResponse from './SocialNetwork.response';
import SocialNetworkRequest from './SocialNetwork.request';
import SocialNetworkPostCore from './SocialNetworkPost.core';
import SocialNetworkPostResponse from './SocialNetworkPost.response';
import CampaignCore from '../Campaign/Campaign.core';

import ErrorCore from '../Shared/Error.core';

const SocialNetwork = {
  '/socialNetworks/supportedSocialNetworks': {
    get: {
      description:
        'Returns all available social networks applicable to the requester',
      operationId: 'getSupportedSocialNetworks',
      request: {},
      response: {
        '200': {
          description: 'Returns an array of social networks',
          body: [
            SocialNetworkResponse,
            { areEntriesUnique: true, uniqueOn: 'id' },
          ],
        },
      },
    },
  },

  '/socialNetworks/{id}': {
    get: {
      description: 'Get details about a social network',
      operationId: 'getSocialNetwork',
      request: {
        path: {
          id: SocialNetworkRequest.id,
        },
      },
      response: {
        '200': {
          description: 'Returns social network details',
          body: SocialNetworkResponse,
        },
        default: {
          description: 'Unexpected Error',
          error: ErrorCore,
        },
      },
    },
  },
  '/socialNetworks/sharePost': {
    post: {
      description: 'Share a post to the specified social networks',
      operationId: 'getSocialNetwork',
      request: {
        body: {
          sns: [SocialNetworkRequest.id, { areEntriesUnique: true }],
          campaignId: CampaignCore.id,
        },
      },
      response: {
        '200': {
          description:
            'Returns whether it was successful for each social network',
          body: [
            {
              id: SocialNetworkRequest.id,
              postId: {
                vtype: 'string',
                faker: 'random.uuid',
              },
            },
            {
              areEntriesUnique: true,
              uniqueOn: 'id',
            },
          ],
        },
        default: {
          description: 'Unexpected Error',
          error: ErrorCore,
        },
      },
    },
  },

  '/socialNetworks/{snId}/getPost/{postId}': {
    get: {
      description: 'Get details about a social network post',
      operationId: 'getSocialNetworkPost',
      request: {
        path: {
          snId: SocialNetworkRequest.id,
          postId: SocialNetworkPostCore.id,
        },
      },
      response: {
        '200': {
          description: 'Returns post details',
          body: SocialNetworkPostResponse,
        },
        default: {
          description: 'Unexpected Error',
          error: ErrorCore,
        },
      },
    },
  },
};

export default SocialNetwork;
