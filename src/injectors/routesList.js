import { getFlatRoutes, getHttpMethods } from '../utils/configParsers';

export default function routesList(definitions) {
  return {
    ...definitions,
    getRoutesList: () => getRoutesList(getFlatRoutes(definitions)),
  };
}

function getRoutesList(routes) {
  return Object.keys(routes).reduce((routesList, routeKey) => {
    const routeList = getHttpMethods(routes[routeKey]).reduce(
      (routeList, methodName) => {
        const id = routes[routeKey][methodName].operationId || routeKey;
        routeList[id] = routeKey;
        return routeList;
      },
      {},
    );

    routesList = { ...routesList, ...routeList };
    return routesList;
  }, {});
}
