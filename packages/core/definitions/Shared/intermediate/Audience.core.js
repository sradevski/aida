import GeoJsonCore from './GeoJson.core';

export default {
  isWorldwide: {
    vtype: 'boolean',
    faker: 'random.boolean',
  },
  locations: [
    {
      coords: GeoJsonCore,
      country: {
        vtype: 'string',
        faker: 'address.country',
      },
      locality: {
        vtype: 'string',
        faker: 'address.city',
      },
    },
    {
      fakerIterations: 3,
      areEntriesUnique: false,
    },
  ],
  ageRange: {
    from: {
      vtype: 'integer',
      faker: {
        faker: 'random.number',
        options: {
          min: 16,
          max: 140,
        },
      },
    },
    to: {
      vtype: 'integer',
      faker: 'random.number',
    },
  },
  genders: [
    {
      vtype: 'string',
      faker: ['male', 'female', 'unspecified'],
    },
    {
      fakerIterations: 3,
      areEntriesUnique: true,
    },
  ],
  numOfFollowers: {
    from: {
      vtype: 'integer',
      faker: 'random.number',
    },
    to: {
      vtype: 'integer',
      faker: 'random.number',
    },
  },
  userRanks: [
    {
      vtype: 'string',
      faker: ['beginner', 'influencer'],
    },
    {
      fakerIterations: 2,
      areEntriesUnique: true,
    },
  ],
  userInterests: [
    {
      vtype: 'string',
      faker: 'commerce.productName',
    },
    {
      fakerIterations: 4,
      areEntriesUnique: true,
    },
  ],
};
