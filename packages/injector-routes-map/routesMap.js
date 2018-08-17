import { getHttpMethods } from '@aida/utils/dist/configParsers';

//routesMap returns a map of operationId: route while maintaining the placeholders for path variables.
export default function main(models) {
  return {
    ...models,
    routesMap: {
      execute: ({ category } = {}) =>
        getRoutesMap(models.routes.execute({ baseUri: '', category })),
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