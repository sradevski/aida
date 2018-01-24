import faker from 'faker';
import { getDefinitionType } from './configParsers';

const defaultOptions = {
  seed: 1,
  locale: 'en',
};

const entriesPerArray = 8;

//TODO: recursively iterate object and populate it. If type is array, create 5-10 entries and populate each.
export function populateWithFaker(definition, options) {
  const fullOptions = { ...defaultOptions, ...options };
  const { locale, seed } = fullOptions;
  faker.locale = locale;
  faker.seed(seed);

  if (getDefinitionType(definition) === 'array') {
    return getPopulatedArray(definition[0], fullOptions);
  }

  return Object.keys(definition).reduce((populatedObject, field) => {
    const property = definition[field];
    const propType = getDefinitionType(property);

    if (propType === 'array') {
      populatedObject[field] = getPopulatedArray(property, fullOptions);
    } else if (propType === 'object') {
      populatedObject[field] = populateWithFaker(property, fullOptions);
    } else if (property.faker) {
      const [type, method] = property.faker.split('.');
      populatedObject[field] = faker[type][method]();
    } else {
      populatedObject[field] = null;
    }

    return populatedObject;
  }, {});
}

function getPopulatedArray(property, options) {
  let iterableSeed = options.seed;
  const result = [];

  for (let i = 1; i <= entriesPerArray; i++) {
    result.push(
      populateWithFaker(property, {
        ...options,
        seed: iterableSeed,
      }),
    );

    iterableSeed = iterableSeed + 1;
  }

  return result;
}
