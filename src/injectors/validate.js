import { crawlDefinition } from '../utils/configParsers';

//TODO: Do babel transform outside the validation logic and Define babel config inline. It sohuld be < ES5 maybe, or it also might not be necessary. Still good to do transform for validation purposes.
export default function validate(definitions) {
  return {
    ...definitions,
    getValidators: () => getValidators(definitions._raw),
  };
}

function getValidators(definitions) {
  return Object.keys(definitions).reduce(
    (definitionsWithValidators, definitionKey) => {
      definitionsWithValidators[definitionKey] = Object.keys(
        definitions[definitionKey],
      ).reduce((definitionTypes, definitionType) => {
        definitionTypes[definitionType] = getValidatorsForType(
          definitionType,
          definitions[definitionKey][definitionType],
        );
        return definitionTypes;
      }, {});
      return definitionsWithValidators;
    },
    {},
  );
}

const blacklistedTypes = ['endpoints'];

function getValidatorsForType(definitionType, definition) {
  if (blacklistedTypes.includes(definitionType)) {
    return undefined;
  }
  return crawlDefinition(definition, 'validator', getValidator);
}

function getValidator(value) {
  return '() => (value ? true : false),';
}

//returns the same structure as a ES5 JS file. Each field is associated with a function that is called and returns {isValid: false, errCode: ''}. It also generates another map of ERRCODE: 'Description' which can be localized and used to show a message to the end user. Return just errcode and isValid for now.
