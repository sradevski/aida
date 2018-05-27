const GeoJson = {
  type: {
    vtype: 'string',
    faker: ['Point'],
  },
  coordinates: [
    {
      vtype: 'number',
      faker: {
        faker: 'random.number',
        options: {
          min: -90,
          max: 90,
        },
      },
    },
    {
      fakerIterations: 2,
      areEntriesUnique: true,
    },
  ],
};

export default GeoJson;
