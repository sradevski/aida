import { populateWithFaker } from '@aida/utils/dist/faker';

//fakedModel returns an object with either all or only includeed or excluded models, where each property contains an array of faked data for that model type.
export default function main(models, options = {}) {
  return {
    ...models,
    fakedModel: {
      execute: (overriddenOptions = {}) => {
        const ownOpts = {
          exclude: overriddenOptions.exclude || options.exclude,
          include: overriddenOptions.include || options.include,
          itemsPerModel:
            overriddenOptions.itemsPerModel || options.itemsPerModel || 1,
          modelType: overriddenOptions.modelType || options.modelType || 'core',
          seed: overriddenOptions.seed || options.seed || 12,
        };

        return getFakedModel(models, ownOpts);
      },
    },
  };
}

function getFakedModel(models, options) {
  const { exclude, include, itemsPerModel, modelType, seed } = options;
  const allModels = models._raw;

  return Object.keys(allModels).reduce((fakedModel, defName) => {
    if (!allModels[defName][modelType]) {
      return fakedModel;
    }

    if (shouldIncludeDef(defName, include, exclude)) {
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

function shouldIncludeDef(def, include, exclude) {
  if (include) {
    return include.includes(def);
  } else if (exclude) {
    return !exclude.includes(def);
  }

  return true;
}
