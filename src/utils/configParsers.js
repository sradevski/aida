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

export function getHttpMethods(route) {
  return Object.keys(route).filter(methodName =>
    httpMethods.includes(methodName),
  );
}
