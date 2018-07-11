export default function routes(definitions) {
  return {
    ...definitions,
    getRoutes: (baseUri, categories) =>
      getFlatRoutes(definitions, baseUri, categories),
  };
}

//getFlatRoutes returns all the defined routes in a flat structure. This is used as the basis for several other injectors.
function getFlatRoutes(definitions, baseUri, categories) {
  return Object.values(definitions._raw).reduce((flatRoutes, definition) => {
    if (!definition.endpoints) {
      return flatRoutes;
    }

    const endpointData = getEndpoints(definition.endpoints, categories);

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

function getEndpoints(endpoints, categories) {
  if (!categories) {
    return endpoints;
  }

  return categories.reduce((matchingEndpoints, category) => {
    if (endpoints[category]) {
      matchingEndpoints.push(...endpoints[category]);
    }
  }, []);
}
