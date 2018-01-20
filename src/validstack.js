import { traverseFileSystem } from './utils/filesystem';

const pipe = (...fns) => fn => fns.reduce((prev, func) => func(prev), fn);

export default function validstack(passedConfig = {}) {
  const config = { ...getDefaultConfig(), ...passedConfig };
  return executeInjectors(config);
}

function executeInjectors(config) {
  const definitions = generateDefinitionsObject(config.definitions);
  const injectors = pipe(...config.injectors);
  return injectors(definitions);
}

function generateDefinitionsObject(definitionsConfig) {
  const definitions = {};
  const { location, blacklist } = definitionsConfig;
  const fileslist = traverseFileSystem(location);
  const filesToUse = fileslist.filter(
    file => !blacklist.includes(file.filename),
  );

  filesToUse.forEach(fileinfo => {
    const fileContent = require(fileinfo.location);
    const [modelName, modelType] = fileinfo.filename.split('.');

    if (!definitions[modelName]) {
      definitions[modelName] = { _raw: {} };
    }

    definitions[modelName]._raw[modelType] = fileContent;
  });

  return definitions;
}

function getDefaultConfig() {
  //The config will hold the transformation functions to be run in each step.
  return {
    injectors: [],
  };
}
