import { getHttpMethods } from '../utils/configParsers';

export default function routesMap(definitions) {
  return {
    ...definitions,
    getRoutesMap: appCategory =>
      getRoutesMap(definitions.getRoutes('', appCategory)),
  };
}

const pathParamRegex = /{[a-zA-Z0-9]*}\/?/gi;

function getRoutesMap(routes) {
  return Object.keys(routes).reduce((routesMap, routeKey) => {
    const routeMap = getHttpMethods(routes[routeKey]).reduce(
      (routeMap, methodName) => {
        const id = routes[routeKey][methodName].operationId || routeKey;
        routeMap[id] = routeKey.replace(pathParamRegex, '');
        return routeMap;
      },
      {},
    );

    routesMap = { ...routesMap, ...routeMap };
    return routesMap;
  }, {});
}
