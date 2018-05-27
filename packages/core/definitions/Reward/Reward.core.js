const Reward = {
  businessAccountId: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  userId: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  id: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  code: {
    vtype: 'string',
    faker: 'random.number',
  },
  barcode: {
    vtype: 'string',
    faker: ['barcode.png'],
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
  rewardType: {
    vtype: 'string',
    faker: ['discount', 'points'],
  },
  description: {
    vtype: 'string',
    faker: ['On selected items', 'On all items'],
  },
  validUntil: {
    vtype: 'integer',
    faker: {
      faker: 'random.number',
      options: {
        min: 1547707887000,
        max: 1597707887000,
      },
    },
  },
  remainingRedemptions: {
    vtype: 'integer',
    faker: 'random.number',
  },
};

export default Reward;
