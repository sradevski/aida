export default function routes(definitions) {
  return {
    ...definitions,
    getRoutes: includeRootUri => getFlatRoutes(definitions, includeRootUri),
  };
}

function getFlatRoutes(definitions, includeRootUri = true) {
  return Object.values(definitions._raw).reduce((flatRoutes, definition) => {
    if (!definition.endpoints || !definition.endpoints.paths) {
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
