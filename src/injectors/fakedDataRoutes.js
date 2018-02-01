import { getHttpMethods } from '../utils/configParsers';
import { populateWithFaker } from '../utils/faker';

const server = 'http://localhost:4000/api';
const seed = 12;
export default function fakedDataRoutes(definitions) {
  return {
    ...definitions,
    getFakedDataRoutes: appCategory =>
      getFakedDataRoutes(definitions.getRoutes(server, appCategory)),
  };
}

function getFakedDataRoutes(routes) {
  return Object.keys(routes).reduce((fakedDataRoutes, routeKey) => {
    const routeDetails = getHttpMethods(routes[routeKey]).reduce(
      (routeDetails, methodName) => {
        const methodFields = routes[routeKey][methodName];
        if (methodFields.response['200']) {
          const fakedData = populateWithFaker(
            methodFields.response['200'].body,
            {
              seed,
            },
          );

          routeDetails[methodName] = {
            ...methodFields,
            response: {
              ...methodFields.response,
              '200': { ...methodFields.response['200'], body: fakedData },
            },
          };
        } else {
          routeDetails[methodName] = {
            ...methodFields,
          };
        }

        return routeDetails;
      },
      {},
    );
    fakedDataRoutes[routeKey] = routeDetails;
    return fakedDataRoutes;
  }, {});
}
