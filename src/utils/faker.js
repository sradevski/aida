import faker from 'faker';
import { getDefinitionType } from './configParsers';

const defaultOptions = {
  seed: 1,
  locale: 'en',
};

const entriesPerArray = 8;

export function populateWithFaker(definition, options) {
  const fullOptions = { ...defaultOptions, ...options };
  const { locale, seed } = fullOptions;
  faker.locale = locale;
  faker.seed(seed);

  const defType = getDefinitionType(definition);
  if (defType === 'array') {
    return getPopulatedArray(definition[0], fullOptions);
  }

  if (defType !== 'object') {
    if (definition.faker) {
      return getFakerValue(definition.faker);
    }

    return null;
  }

  return Object.keys(definition).reduce((populatedObject, field) => {
    const property = definition[field];
    const propType = getDefinitionType(property);

    if (propType === 'array') {
      populatedObject[field] = getPopulatedArray(property, fullOptions);
    } else if (propType === 'object') {
      populatedObject[field] = populateWithFaker(property, fullOptions);
    } else if (property.faker) {
      populatedObject[field] = getFakerValue(property.faker);
    } else {
      populatedObject[field] = null;
    }

    return populatedObject;
  }, {});
}

function getFakerValue(fakerVal) {
  if (Array.isArray(fakerVal)) {
    return fakerVal[Math.floor(Math.random() * fakerVal.length)];
  } else {
    const [type, method] = fakerVal.split('.');
    return faker[type][method]();
  }
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
