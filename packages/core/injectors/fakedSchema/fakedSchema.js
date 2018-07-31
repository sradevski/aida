import { populateWithFaker } from '../../utils/faker';

const seed = 12;

//fakedSchema returns an object with either all or only whitelisted or blacklisted models, where each property contains an array of faked data for that schema.
export default function main(models) {
  return {
    ...models,
    fakedSchema: {
      execute: (options = {}) => getFakedSchema(models, options),
    },
  };
}

function getFakedSchema(models, options = {}) {
  const { blacklist, whitelist, itemsPerModel } = options;
  const allModels = models._raw;

  return Object.keys(allModels).reduce((schemaObjects, defName) => {
    if (!allModels[defName].schema) {
      return schemaObjects;
    }

    if (shouldIncludeDef(defName, whitelist, blacklist)) {
      schemaObjects[defName] = getFakeDataForSchema(
        allModels[defName].schema,
        itemsPerModel,
      );
    }

    return schemaObjects;
  }, {});
}

function getFakeDataForSchema(schemaDef, itemsPerModel = 1) {
  const fakerCrawlerOptions = {
    fakerIterations: itemsPerModel,
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
