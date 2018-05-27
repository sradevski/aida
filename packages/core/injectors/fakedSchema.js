import { populateWithFaker } from '../utils/faker';

const seed = 12;

//fakedSchema returns an object with either all or only whitelisted or blacklisted definitions, where each property contains an array of faked data for that schema.
export default function fakedSchema(definitions) {
  return {
    ...definitions,
    getFakedSchema: options => getFakedSchema(definitions, options),
  };
}

function getFakedSchema(definitions, options = {}) {
  const { blacklist, whitelist, itemsPerDefinition } = options;
  const allDefinitions = definitions._raw;

  return Object.keys(allDefinitions).reduce((schemaObjects, defName) => {
    if (!allDefinitions[defName].schema) {
      return schemaObjects;
    }

    if (shouldIncludeDef(defName, whitelist, blacklist)) {
      schemaObjects[defName] = getFakeDataForSchema(
        allDefinitions[defName].schema,
        itemsPerDefinition,
      );
    }

    return schemaObjects;
  }, {});
}

function getFakeDataForSchema(schemaDef, itemsPerDefinition = 1) {
  const fakerCrawlerOptions = {
    fakerIterations: itemsPerDefinition,
  };

  const fakedData = populateWithFaker([schemaDef, fakerCrawlerOptions], {
    seed,
  });

  return fakedData;
}

function shouldIncludeDef(def, whitelist, blacklist) {
  if (whitelist) {
    return whitelist.includes(def);
  } else if (blacklist) {
    return !blacklist.includes(def);
  }

  return true;
}
