const Address = {
  country: {
    vtype: 'string',
    faker: 'address.country',
  },
  region: {
    vtype: 'string',
    faker: 'address.state',
  },
  city: {
    vtype: 'string',
    faker: 'address.city',
  },
  zip: {
    vtype: 'string',
    faker: 'address.zipCode',
  },
  street: {
    vtype: 'string',
    faker: 'address.streetAddress',
  },
  streetNumber: {
    vtype: 'string',
    faker: 'random.number',
  },
  lat: {
    vtype: 'number',
    faker: 'address.latitude',
  },
  long: {
    vtype: 'number',
    faker: 'address.longitude',
  },
};

export default Address;
