import faker from 'faker';

const defaultOptions = {
  seed: 1,
  locale: 'en',
  presetData: {},
};

export function populateWithFaker(definition, options) {
  const { locale, seed, presetData } = { ...defaultOptions, ...options };

  faker.locale = locale;
  faker.seed(seed);

  return Object.keys(definition).reduce((populatedObject, field) => {
    if (presetData[field]) {
      populatedObject[field] = presetData[field];
    } else {
      const [type, method] = definition[field].faker.split('.');
      populatedObject[field] = faker[type][method]();
    }
    return populatedObject;
  }, {});
}
