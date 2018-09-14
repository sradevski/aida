import { populateWithFaker } from '@aida/utils/dist/faker';

//fakedModel returns an object with either all or only whitelisted or blacklisted models, where each property contains an array of faked data for that model type.
export default function main(models) {
  return {
    ...models,
    fakedModel: {
      execute: (options = {}) => {
        const ownOpts = {
          blacklist: options.blacklist,
          whitelist: options.whitelist,
          itemsPerModel: options.itemsPerModel || 1,
          modelType: options.modelType || 'core',
          seed: options.seed || 12,
        };

        return getFakedModel(models, ownOpts);
      },
    },
  };
}

function getFakedModel(models, options) {
  const { blacklist, whitelist, itemsPerModel, modelType, seed } = options;
  const allModels = models._raw;

  return Object.keys(allModels).reduce((fakedModel, defName) => {
    if (!allModels[defName][modelType]) {
      return fakedModel;
    }

    if (shouldIncludeDef(defName, whitelist, blacklist)) {
      fakedModel[defName] = getFakeDataForModel(
        allModels[defName][modelType],
        itemsPerModel,
        seed,
      );
    }

    return fakedModel;
  }, {});
}

function getFakeDataForModel(modelDef, itemsPerModel, seed) {
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
