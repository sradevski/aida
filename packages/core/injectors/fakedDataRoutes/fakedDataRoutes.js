import { getHttpMethods } from '../../utils/configParsers';
import { populateWithFaker } from '../../utils/faker';

const seed = 12;

//fakedDataRoutes returns each of the defined endpoints with response and request parts populated with fake data.
export default function main(definitions) {
  return {
    ...definitions,
    fakedDataRoutes: {
      execute: ({ category } = {}) =>
        getFakedDataRoutes(definitions.routes.execute('', { category })),
    },
  };
}

function getFakedDataRoutes(routes) {
  return Object.keys(routes).reduce((fakedDataRoutes, routeKey) => {
    const routeDetails = getHttpMethods(routes[routeKey]).reduce(
      (routeDetails, methodName) => {
        const methodFields = routes[routeKey][methodName];
        const responses = populateAllResponseStatuses(methodFields);

        routeDetails[methodName] = {
          ...methodFields,
          response: {
            ...methodFields.response,
            ...responses,
          },
        };

        return routeDetails;
      },
      {},
    );
    fakedDataRoutes[routeKey] = routeDetails;
    return fakedDataRoutes;
  }, {});
}

function populateAllResponseStatuses(methodFields) {
  const responses = methodFields.response;

  return Object.keys(responses).reduce((populatedResponse, responseStatus) => {
    const body = responses[responseStatus].body;
    const headers = responses[responseStatus].headers;

    populatedResponse[responseStatus] = {
      ...responses[responseStatus],
      body: populateBody(body),
      headers: populateHeaders(headers),
    };

    return populatedResponse;
  }, {});
}

function populateBody(body) {
  return populateWithFaker(body, { seed });
}

function populateHeaders(headers) {
  if (headers) {
    return Object.keys(headers).reduce((populatedHeaders, headerName) => {
      populatedHeaders[headerName] = populateWithFaker(headers[headerName], {
        seed,
      });

      return populatedHeaders;
    }, {});
  }

  return undefined;
}
