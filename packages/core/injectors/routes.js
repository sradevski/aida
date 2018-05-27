export default function routes(definitions) {
  return {
    ...definitions,
    getRoutes: (baseUri, appCategory) =>
      getFlatRoutes(definitions, baseUri, appCategory),
  };
}

//getFlatRoutes returns all the defined routes in a flat structure. This is used as the basis for several other injectors.
function getFlatRoutes(definitions, baseUri, appCategory) {
  return Object.values(definitions._raw).reduce((flatRoutes, definition) => {
    if (!definition.endpoints) {
      return flatRoutes;
    }

    const endpointData = getEndpoints(definition.endpoints, appCategory);

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

function getEndpoints(endpoints, appCategory) {
  if (endpoints[appCategory]) {
    return endpoints[appCategory];
  }

  return endpoints;
}
