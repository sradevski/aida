import { getHttpMethods } from '../../utils/configParsers';

//routesMap returns a map of operationId: route while maintaining the placeholders for path variables.
export default function main(definitions) {
  return {
    ...definitions,
    routesMap: {
      execute: ({ categories } = {}) =>
        getRoutesMap(definitions.routes.execute('', { categories })),
    },
  };
}

function getRoutesMap(routes) {
  return Object.keys(routes).reduce((routesMap, routeKey) => {
    const routeMap = getHttpMethods(routes[routeKey]).reduce(
      (routeMap, methodName) => {
        const id = routes[routeKey][methodName].operationId || routeKey;
        routeMap[id] = routeKey;
        return routeMap;
      },
      {},
    );

    routesMap = { ...routesMap, ...routeMap };
    return routesMap;
  }, {});
}
