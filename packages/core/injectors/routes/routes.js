export default function main(definitions) {
  return {
    ...definitions,
    routes: {
      execute: ({ baseUri, category } = {}) =>
        getFlatRoutes(definitions, baseUri, category),
    },
  };
}

//getFlatRoutes returns all the defined routes in a flat structure. This is used as the basis for several other injectors.
function getFlatRoutes(definitions, baseUri = '', category) {
  return Object.values(definitions._raw).reduce((flatRoutes, definition) => {
    if (!definition.endpoints) {
      return flatRoutes;
    }
    const endpointData = getEndpoints(definition.endpoints, category);

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

function getEndpoints(endpoints, category) {
  const firstEndpoint = Object.keys(endpoints)[0];
  //there are no categories, so return all routes
  if (firstEndpoint && firstEndpoint.includes('/')) {
    return endpoints;
  }

  if (!endpoints[category]) {
    return {};
  }

  return endpoints[category];
}
