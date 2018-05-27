const Account = {
  id: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  username: {
    vtype: 'string',
    faker: 'internet.userName',
  },
  strategies: [
    {
      strategyId: {
        vtype: 'string',
        faker: ['instagram', 'facebook', 'twitter'],
      },
      idInStrategy: {
        vtype: 'string',
        faker: 'random.uuid',
      },
      accessToken: {
        vtype: 'string',
        faker: 'random.uuid',
      },
      refreshToken: {
        vtype: 'string',
        faker: 'random.uuid',
      },
    },
    {
      areEntriesUnique: true,
      uniqueOn: 'strategy',
    },
  ],
};

export default Account;
