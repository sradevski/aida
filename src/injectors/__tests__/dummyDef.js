export default {
  _raw: {
    User: {
      core: {
        id: {
          type: 'string',
          faker: 'random.uuid',
          validators: { integer: true, range: { max: 30 }, isId: val => val },
        },
        username: {
          type: 'string',
          faker: 'internet.userName',
        },
        tags: [
          {
            type: 'string',
            faker: 'commerce.productAdjective',
          },
          {
            iterations: 5,
            areEntriesUnique: true,
          },
        ],
      },
    },
  },
};
