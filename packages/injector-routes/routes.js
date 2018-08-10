export default function main(models) {
  return {
    ...models,
    routes: {
      execute: ({ baseUri, category } = {}) =>
        getFlatRoutes(models, baseUri, category),
    },
  };
}

//getFlatRoutes returns all the defined routes in a flat structure. This is used as the basis for several other injectors.
function getFlatRoutes(models, baseUri = '', category) {
  return Object.values(models._raw).reduce((flatRoutes, model) => {
    if (!model.endpoints) {
      return flatRoutes;
    }
    const endpointData = getEndpoints(model.endpoints, category);

    const modelRoutes = Object.keys(endpointData).reduce((modelPaths, path) => {
      modelPaths[baseUri + path] = endpointData[path];
      return modelPaths;
    }, {});

    flatRoutes = { ...flatRoutes, ...modelRoutes };
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
