import { populateWithFaker } from '../../utils/faker';

const seed = 12;
const defaultOptions = {
  modelType: 'core',
};

//fakedModel returns an object with either all or only whitelisted or blacklisted models, where each property contains an array of faked data for that model type.
export default function main(models) {
  return {
    ...models,
    fakedModel: {
      execute: (options = {}) =>
        getFakedModel(models, { ...defaultOptions, ...options }),
    },
  };
}

function getFakedModel(models, options = {}) {
  const { blacklist, whitelist, itemsPerModel, modelType } = options;
  const allModels = models._raw;

  return Object.keys(allModels).reduce((fakedModel, defName) => {
    if (!allModels[defName][modelType]) {
      return fakedModel;
    }

    if (shouldIncludeDef(defName, whitelist, blacklist)) {
      fakedModel[defName] = getFakeDataForModel(
        allModels[defName][modelType],
        itemsPerModel,
      );
    }

    return fakedModel;
  }, {});
}

function getFakeDataForModel(modelDef, itemsPerModel = 1) {
  const fakerCrawlerOptions = {
    fakerIterations: itemsPerModel,
  };

  const fakedData = populateWithFaker([modelDef, fakerCrawlerOptions], {
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
