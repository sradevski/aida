import { getHttpMethods } from '../utils/configParsers';

export default function routesMap(definitions) {
  return {
    ...definitions,
    getRoutesMap: () => getRoutesMap(definitions.getRoutes()),
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
