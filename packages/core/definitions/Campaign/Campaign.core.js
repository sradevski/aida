import Genre from '../Shared/intermediate/Genre.core';

const Campaign = {
  id: {
    vtype: 'string',
    required: true,
    faker: 'random.uuid',
  },
  businessAccountId: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  campaignType: {
    vtype: 'string',
    faker: ['posting', 'notification'],
  },
  genre: Genre,
  platforms: [
    {
      vtype: 'string',
      faker: ['facebook', 'instagram', 'twitter'],
    },
    {
      areEntriesUnique: true,
    },
  ],
  reward: {
    rewardType: {
      vtype: 'string',
      faker: ['discount', 'points'],
    },
    description: {
      vtype: 'string',
      faker: ['On selected items', 'On all items'],
    },
    amount: {
      vtype: 'integer',
      faker: {
        faker: 'random.number',
        options: {
          min: 10,
          max: 80,
        },
      },
    },
  },
  content: {
    title: {
      vtype: 'string',
      faker: 'random.words',
    },
    description: {
      vtype: 'string',
      faker: 'company.catchPhraseDescriptor',
    },
    media: [
      {
        vtype: 'string',
        faker: ['sample-campaign-media.png'],
      },
      {
        fakerIterations: 1,
      },
    ],
  },
  tags: [
    {
      vtype: 'string',
      faker: 'commerce.productAdjective',
    },
    {
      fakerIterations: 5,
      areEntriesUnique: true,
    },
  ],
};

export default Campaign;
