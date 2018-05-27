import Address from '../Shared/intermediate/Address.core';

const User = {
  id: {
    vtype: 'string',
    required: true,
    faker: 'random.uuid',
  },
  email: {
    vtype: 'string',
    faker: 'internet.email',
    validator: 'email',
  },
  phoneNumber: {
    vtype: 'string',
    faker: 'phone.phoneNumber',
  },
  address: Address,
  firstName: {
    vtype: 'string',
    faker: 'name.firstName',
  },
  lastName: {
    vtype: 'string',
    faker: 'name.lastName',
  },
  formattedName: {
    vtype: 'string',
    faker: 'name.lastName',
  },
  avatar: {
    vtype: 'string',
    faker: 'image.avatar',
  },
  gender: {
    vtype: 'string',
    faker: ['male', 'female', 'other'],
  },
  birthday: {
    vtype: 'string',
    faker: 'date.past',
  },
  ageRange: {
    from: {
      vtype: 'number',
      faker: 'random.number',
    },
    to: {
      vtype: 'number',
      faker: 'random.number',
    },
  },
  locale: {
    vtype: 'string',
    faker: ['en', 'jp'],
  },
};

export default User;
