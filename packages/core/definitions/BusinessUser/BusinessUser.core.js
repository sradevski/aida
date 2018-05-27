const BusinessUser = {
  id: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  businessAccountId: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  authorization: {
    vtype: 'string',
    faker: ['admin', 'creator', 'viewer', 'redeemer'],
  },
  email: {
    vtype: 'string',
    faker: 'internet.email',
  },
  firstName: {
    vtype: 'string',
    faker: 'name.firstName',
  },
  lastName: {
    vtype: 'string',
    faker: 'name.lastName',
  },
  avatar: {
    vtype: 'string',
    faker: 'image.avatar',
  },
};

export default BusinessUser;
