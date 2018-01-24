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
  const definitions = { _raw: {} };
  const { location, blacklist } = definitionsConfig;
  const extendedBlacklist = [...blacklist, '.DS_Store'];

  const fileslist = traverseFileSystem(location);
  const filesToUse = fileslist.filter(
    file => !extendedBlacklist.includes(file.filename),
  );

  filesToUse.forEach(fileinfo => {
    const fileContent = require(fileinfo.location).default;
    const [modelName, modelType] = fileinfo.filename.split('.');

    if (!definitions._raw[modelName]) {
      definitions._raw[modelName] = {};
    }

    definitions._raw[modelName][modelType] = fileContent;
  });

  return definitions;
}

function getDefaultConfig() {
  //The config will hold the transformation functions to be run in each step.
  return {
    injectors: [],
  };
}
