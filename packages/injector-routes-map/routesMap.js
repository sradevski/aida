import { getHttpMethods } from '@aida/utils/dist/configParsers';

//routesMap returns a map of operationId: route while maintaining the placeholders for path variables.
export default function main(models, options = {}) {
  return {
    ...models,
    routesMap: {
      execute: (overriddenOptions = {}) => {
        const routesOpts = {
          baseUri: overriddenOptions.baseUri || options.baseUri || '',
          category: overriddenOptions.category || options.category,
        };

        return getRoutesMap(models.routes.execute(routesOpts));
      },
    },
  };
}

function getRoutesMap(routes) {
  return Object.keys(routes).reduce((routesMap, routeKey) => {
    const routeMap = getHttpMethods(routes[routeKey]).reduce(
      (routeMap, methodName) => {
        const id = routes[routeKey][methodName].operationId;
        if (!id) {
          throw new Error('All routes have to have an operationId field');
        }

        routeMap[id] = routeKey;
        return routeMap;
      },
      {},
    );

    routesMap = { ...routesMap, ...routeMap };
    return routesMap;
  }, {});
}
