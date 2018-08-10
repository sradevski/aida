import { getHttpMethods } from '@aida/utils/dist/configParsers';
import { populateWithFaker } from '@aida/utils/dist/faker';

const seed = 12;

//fakedDataRoutes returns each of the defined endpoints with response and request parts populated with fake data.
export default function main(models) {
  return {
    ...models,
    fakedDataRoutes: {
      execute: ({ category } = {}) =>
        getFakedDataRoutes(models.routes.execute('', { category })),
    },
  };
}

function getFakedDataRoutes(routes) {
  return Object.keys(routes).reduce((fakedDataRoutes, routeKey) => {
    const routeDetails = getHttpMethods(routes[routeKey]).reduce(
      (routeDetails, methodName) => {
        const methodFields = routes[routeKey][methodName];
        const response = populateAllResponseStatuses(methodFields.response);
        const request = populateRequest(methodFields.request);

        routeDetails[methodName] = {
          operationId: methodFields.operationId,
          request,
          response,
        };

        return routeDetails;
      },
      {},
    );
    fakedDataRoutes[routeKey] = routeDetails;
    return fakedDataRoutes;
  }, {});
}

function populateRequest(request) {
  return Object.keys(request)
    .filter(prop => ['path', 'query', 'body'].includes(prop))
    .reduce((populatedRequest, dataLocation) => {
      populatedRequest[dataLocation] = populateWithFaker(
        request[dataLocation],
        { seed },
      );

      return populatedRequest;
    }, {});
}

function populateAllResponseStatuses(response) {
  return Object.keys(response).reduce((populatedResponse, responseStatus) => {
    const body = response[responseStatus].body;
    const headers = response[responseStatus].headers;

    populatedResponse[responseStatus] = {
      'application/json': populateBody(body),
      headers: populateHeaders(headers),
    };

    return populatedResponse;
  }, {});
}

function populateBody(body) {
  if (body) {
    return populateWithFaker(body, { seed });
  }

  return undefined;
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
