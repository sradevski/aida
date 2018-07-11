import crypto from 'crypto';
import { crawlDefinition } from '../../utils/configParsers';
import predefinedValidators from './predefinedValidators';
import { stringifyFunction, stringifyObject } from '../../utils/stringifier';

const validatorFunctions = {};

//Assigns a validation function to each property of the request and response definition types. This can later be used along with the validators to validate the data on both client and server side.
export default function main(definitions) {
  return {
    ...definitions,
    validation: {
      execute: () => getDefinitionsWithValidators(definitions._raw),
      getValidatorsAsString: config =>
        generateValidatorsFile(validatorFunctions, config),
    },
  };
}

function getDefinitionsWithValidators(definitions) {
  const definitionsWithValidators = Object.keys(definitions).reduce(
    (definitionsWithValidators, definitionKey) => {
      definitionsWithValidators[definitionKey] = getValidatorsForDefinition(
        definitions[definitionKey],
      );

      return definitionsWithValidators;
    },
    {},
  );

  return definitionsWithValidators;
}

const blacklistedTypes = ['endpoints'];

function getValidatorsForDefinition(definition) {
  return Object.keys(definition)
    .filter(definitionType => !blacklistedTypes.includes(definitionType))
    .reduce((definitionTypes, definitionType) => {
      definitionTypes[definitionType] = getValidatorsForType(
        definition[definitionType],
      );
      return definitionTypes;
    }, {});
}

function getValidatorsForType(definition) {
  return crawlDefinition(definition, 'validators', getValidator);
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
