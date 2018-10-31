import faker from 'faker';
import { crawlModel } from './configParsers';

const defaultOptions = {
  seed: 1,
  locale: 'en',
};

let randomizer;

export function populateWithFaker(model, options) {
  const fullOptions = { ...defaultOptions, ...options };
  const { locale, seed } = fullOptions;
  faker.locale = locale;
  faker.seed(seed);
  randomizer = random(seed);

  return crawlModel(model, 'faker', getFakerValue, getPopulatedArray);
}

const defaultArrayFakerProps = {
  fakerIterations: 10,
  areEntriesUnique: false,
  uniqueOn: undefined,
};

const defaultFakerProps = {
  faker: 'random.number',
  options: undefined,
};

function getPopulatedArray(model) {
  const [property, passedArrayProps] = model;
  const { areEntriesUnique, uniqueOn, fakerIterations } = {
    ...defaultArrayFakerProps,
    ...(passedArrayProps ? passedArrayProps : {}),
  };
  const result = [];
  for (let i = 1; i <= fakerIterations; i++) {
    const newFakerVal = crawlModel(
      property,
      'faker',
      getFakerValue,
      getPopulatedArray,
    );

    if (areEntriesUnique) {
      if (isEntryInArray(result, newFakerVal, uniqueOn)) {
        continue;
      }
    }

    result.push(newFakerVal);
  }

  return result;
}

function isEntryInArray(arr, entry, onProperty) {
  return (
    arr.findIndex(
      x => (onProperty ? x[onProperty] === entry[onProperty] : x === entry),
    ) !== -1
  );
}

function getFakerValue(fakerVal) {
  if (!fakerVal) {
    return null;
  }

  if (Array.isArray(fakerVal)) {
    return fakerVal[Math.round(randomizer() * (fakerVal.length - 1))];
  } else if (typeof fakerVal === 'object') {
    const props = {
      ...defaultFakerProps,
      ...fakerVal,
    };
    const [type, method] = props.faker.split('.');
    return faker[type][method](props.options);
  } else {
    const [type, method] = fakerVal.split('.');
    return faker[type][method]();
  }
}

// A simple Pseudorandom number generator (Mulberry 32bit) that takes a seed.
function random(seed) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
