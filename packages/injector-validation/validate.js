import crypto from 'crypto';
import { crawlModel } from '@aida/utils/dist/configParsers';
import {
  stringifyFunction,
  stringifyObject,
} from '@aida/utils/dist/stringifier';
import predefinedValidators from './predefinedValidators';

const validatorFunctions = {};

//Assigns a validation function to each property of the request and response model types. This can later be used along with the validators to validate the data on both client and server side.
export default function main(models) {
  return {
    ...models,
    validation: {
      execute: () => getModelsWithValidators(models._raw),
      getValidatorsAsString: config =>
        generateValidatorsFile(validatorFunctions, config),
    },
  };
}

function getModelsWithValidators(models) {
  const modelsWithValidators = Object.keys(models).reduce(
    (modelsWithValidators, modelKey) => {
      modelsWithValidators[modelKey] = getValidatorsForModel(models[modelKey]);

      return modelsWithValidators;
    },
    {},
  );

  return modelsWithValidators;
}

const excludedTypes = ['endpoints'];

function getValidatorsForModel(model) {
  return Object.keys(model)
    .filter(modelType => !excludedTypes.includes(modelType))
    .reduce((modelTypes, modelType) => {
      modelTypes[modelType] = getValidatorsForType(model[modelType]);
      return modelTypes;
    }, {});
}

function getValidatorsForType(model) {
  return crawlModel(model, 'validators', getValidator);
}

function getValidator(validatorObj) {
  if (!validatorObj) {
    return null;
  }

  return Object.keys(validatorObj).reduce((validators, validatorKey) => {
    const val = validatorObj[validatorKey];

    if (val instanceof Function) {
      const hash = getHashOfFunction(val);
      validatorFunctions[hash] = val;
      validators[hash] = true;
      return validators;
    }

    if (predefinedValidators[validatorKey]) {
      validatorFunctions[validatorKey] = predefinedValidators[validatorKey];
      validators[validatorKey] = val;
      return validators;
    }

    throw Error(
      'Could not find the specified validator in the predefined list of validators',
    );
  }, {});
}

function getHashOfFunction(func) {
  const funcAsString = stringifyFunction(func);
  return crypto
    .createHash('md5')
    .update(funcAsString)
    .digest('hex');
}

function generateValidatorsFile(validators, config) {
  return stringifyObject(validators, config);
}

//returns the same structure as a ES5 JS file. Each field is associated with a function that is called and returns {isValid: false, errCode: ''}. It also generates another map of ERRCODE: 'Description' which can be localized and used to show a message to the end user. Return just errcode and isValid for now.
