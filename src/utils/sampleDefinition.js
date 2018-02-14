export default {
  _raw: {
    User: {
      core: {
        id: {
          type: 'string',
          required: true,
          faker: 'random.uuid',
          validator: 'email',
        },
        email: {
          type: 'string',
          faker: 'internet.email',
          validator: 'email',
        },
        phoneNumber: {
          type: 'string',
          faker: 'phone.phoneNumber',
        },
        address: {
          formattedAddress: {
            type: 'string',
            faker: 'address.streetAddress',
          },
          country: {
            type: 'string',
            faker: 'address.country',
          },
          region: {
            type: 'string',
            faker: 'address.state',
          },
          city: {
            type: 'string',
            faker: 'address.city',
          },
          zip: {
            type: 'string',
            faker: 'address.zipCode',
          },
          street: {
            type: 'string',
            faker: 'address.streetAddress',
          },
          streetNumber: {
            type: 'string',
            faker: 'random.number',
          },
        },
        firstName: {
          type: 'string',
          faker: 'name.firstName',
        },
        lastName: {
          type: 'string',
          faker: 'name.lastName',
        },
        avatar: {
          type: 'string',
          faker: 'image.avatar',
        },
      },
    },
  },
};
