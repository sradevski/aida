export function getDefinitionType(definition) {
  if (definition.vtype) {
    return definition.vtype;
  }

  if (Array.isArray(definition)) {
    return 'array';
  }

  return 'object';
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

//Crawls a definition and it replaces each primitive (not an array or object) with the value returned from the action passed. Optionally an array handling function can be passed to handle arrays. It returns the resulting object.
export function crawlDefinition(
  rootDefinition,
  selector,
  action,
  arrayHandler,
) {
  function crawler(definition) {
    const defType = getDefinitionType(definition);
    if (defType === 'array') {
      return (
        (arrayHandler &&
          arrayHandler(definition, selector, action, arrayHandler)) ||
        crawler(definition[0])
      );
    }

    if (defType !== 'object') {
      return action(definition[selector]);
    }

    return Object.keys(definition).reduce((populatedObject, field) => {
      const property = definition[field];
      const propType = getDefinitionType(property);

      if (propType === 'array') {
        populatedObject[field] =
          (arrayHandler &&
            arrayHandler(property, selector, action, arrayHandler)) ||
          crawler(property[0]);
      } else if (propType === 'object') {
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
