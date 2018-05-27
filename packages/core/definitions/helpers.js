export function removeBlacklistedFields(definition, blacklist) {
  return Object.keys(definition)
    .filter(field => blacklist.includes(field))
    .reduce((filteredUser, field) => {
      filteredUser[field] = definition[field];
      return filteredUser;
    }, {});
}

export function removeMetadata(definition) {
  return Object.keys(definition).reduce(
    (filteredDefinition, definitionField) => {
      if (!definitionField.startsWith('_')) {
        filteredDefinition[definitionField] = definition[definitionField];
      }

      return filteredDefinition;
    },
    {},
  );
}
