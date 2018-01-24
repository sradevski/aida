export function getFlatRoutes(definitions, includeRootUri = true) {
  return Object.values(definitions._raw).reduce((flatRoutes, definition) => {
    console.log(definition);

    if (!definition.endpoints) {
      return flatRoutes;
    }

    const endpointData = definition.endpoints;
    const rootUri = includeRootUri
      ? `${endpointData.schemes[0]}://${endpointData.host}${
          endpointData.basePath
        }`
      : '';

    const definitionRoutes = Object.keys(endpointData.paths).reduce(
      (definitionPaths, path) => {
        definitionPaths[rootUri + path] = endpointData.paths[path];
        return definitionPaths;
      },
      {},
    );

    flatRoutes = { ...flatRoutes, ...definitionRoutes };
    return flatRoutes;
  }, {});
}

export function getDefinitionType(definition) {
  if (Array.isArray(definition)) {
    return 'array';
  }

  if (!definition.type) {
    return 'object';
  }

  return definition.type;
}
