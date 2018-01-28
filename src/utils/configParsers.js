export function getDefinitionType(definition) {
  if (Array.isArray(definition)) {
    return 'array';
  }

  if (!definition.type) {
    return 'object';
  }

  return definition.type;
}

const httpMethods = [
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
];

//TODO: Refactor this and faker functions as they are similar.
export function crawlDefinition(rootDefinition, selector, action) {
  function crawler(definition) {
    const defType = getDefinitionType(definition);
    if (defType === 'array') {
      return crawler(definition[0]);
    }

    if (defType !== 'object') {
      if (definition[selector]) {
        return action(definition[selector]);
      }

      return null;
    }

    return Object.keys(definition).reduce((populatedObject, field) => {
      const property = definition[field];
      const propType = getDefinitionType(property);

      if (propType === 'array') {
        populatedObject[field] = crawler(property[0]);
      } else if (propType === 'object') {
        console.log(definition, property);
        populatedObject[field] = crawler(property);
      } else {
        populatedObject[field] = action(property[selector]);
      }

      return populatedObject;
    }, {});
  }

  return crawler(rootDefinition);
}

export function getHttpMethods(route) {
  return Object.keys(route).filter(methodName =>
    httpMethods.includes(methodName),
  );
}
