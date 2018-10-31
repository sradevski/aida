export default function main(models, options = {}) {
  return {
    ...models,
    routes: {
      execute: (overriddenOptions = {}) => {
        const ownOpts = {
          baseUri: overriddenOptions.baseUri || options.baseUri || '',
          category: overriddenOptions.category || options.category,
        };

        return getFlatRoutes(models, ownOpts);
      },
    },
  };
}

//getFlatRoutes returns all the defined routes in a flat structure. This is used as the basis for several other injectors.
function getFlatRoutes(models, options) {
  return Object.values(models._raw).reduce((flatRoutes, model) => {
    if (!model.endpoints) {
      return flatRoutes;
    }
    const endpointData = getEndpoints(model.endpoints, options.category);

    const modelRoutes = Object.keys(endpointData).reduce((modelPaths, path) => {
      modelPaths[options.baseUri + path] = endpointData[path];
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
