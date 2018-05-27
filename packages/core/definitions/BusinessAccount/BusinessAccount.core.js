const BusinessAccount = {
  id: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  name: {
    vtype: 'string',
    faker: 'company.companyName',
  },
  logo: {
    vtype: 'string',
    faker: 'image.avatar',
  },
  website: {
    vtype: 'string',
    faker: 'internet.url',
  },
  description: {
    vtype: 'string',
    faker: 'company.catchPhrase',
  },
  tags: [
    {
      vtype: 'string',
      faker: 'commerce.productAdjective',
    },
    {
      iterations: 5,
      areEntriesUnique: true,
    },
  ],
};

export default BusinessAccount;
