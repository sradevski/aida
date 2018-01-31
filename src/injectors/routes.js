export default function routes(definitions) {
  return {
    ...definitions,
    getRoutes: baseUri => getFlatRoutes(definitions, baseUri),
  };
}

function getFlatRoutes(definitions, baseUri) {
  return Object.values(definitions._raw).reduce((flatRoutes, definition) => {
    if (!definition.endpoints) {
      return flatRoutes;
    }

    const endpointData = definition.endpoints;

    const definitionRoutes = Object.keys(endpointData).reduce(
      (definitionPaths, path) => {
        definitionPaths[baseUri + path] = endpointData[path];
        return definitionPaths;
      },
      {},
    );

    flatRoutes = { ...flatRoutes, ...definitionRoutes };
    return flatRoutes;
  }, {});
}
