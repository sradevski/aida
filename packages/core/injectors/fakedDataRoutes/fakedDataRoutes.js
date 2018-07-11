import { getHttpMethods } from '../../utils/configParsers';
import { populateWithFaker } from '../../utils/faker';

const seed = 12;

//fakedDataRoutes returns each of the defined endpoints with response and request parts populated with fake data.
export default function fakedDataRoutes(definitions) {
  return {
    ...definitions,
    getFakedDataRoutes: categories =>
      getFakedDataRoutes(definitions.getRoutes('', categories)),
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
            { seed },
          );

          routeDetails[methodName] = {
            ...methodFields,
            response: {
              ...methodFields.response,
              '200': fakedData,
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
