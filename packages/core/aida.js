import { traverseFileSystem } from './filesystem';
import defaultsDeep from 'lodash/fp/defaultsDeep';

const pipe = (...fns) => fn => fns.reduce((prev, func) => func(prev), fn);

export default function run(passedConfig = {}) {
  const config = defaultsDeep(passedConfig, getDefaultConfig());
  if (!config.models || !config.models.location) {
    throw new Error(
      'A model config with a location parameter has to be specified.',
    );
  }

  return executeInjectors(config);
}

function executeInjectors(config) {
  const models = generateModelsObject(config.models);
  const configuredInjectorRuntimes = config.injectors.map(injector => models =>
    injector.runtime(models, injector.config),
  );

  const injectors = pipe(...configuredInjectorRuntimes);
  return injectors(models);
}

const defaultExcludeFiles = ['.DS_Store'];

function generateModelsObject(modelsConfig) {
  const models = { _raw: {} };
  const { location, excludeFiles, excludeDirectories } = modelsConfig;
  const extendedExcludeFiles = [...excludeFiles, ...defaultExcludeFiles];

  const fileslist = traverseFileSystem(location);
  const filesToUse = fileslist.filter(
    file =>
      !extendedExcludeFiles.includes(file.filename) &&
      excludeDirectories.findIndex(directoryPath =>
        file.location.includes(directoryPath),
      ) === -1,
  );

  filesToUse.forEach(fileinfo => {
    const fileContent = require(fileinfo.location).default;
    const [modelName, modelType] = fileinfo.filename.split('.');

    if (!models._raw[modelName]) {
      models._raw[modelName] = {};
    }

    models._raw[modelName][modelType] = fileContent;
  });

  return models;
}

function getDefaultConfig() {
  //The config will hold the transformation functions to be run in each step.
  return {
    injectors: [],
    models: {
      excludeDirectories: [],
      excludeFiles: [],
    },
  };
}
