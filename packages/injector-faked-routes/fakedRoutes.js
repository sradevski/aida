import { getHttpMethods } from '@aida/utils/dist/configParsers';
import { populateWithFaker } from '@aida/utils/dist/faker';

//fakedRoutes returns each of the defined endpoints with response and request parts populated with fake data.
export default function main(models) {
  return {
    ...models,
    fakedRoutes: {
      execute: (options = {}) => {
        const routesOpts = {
          baseUri: options.baseUri || '',
          category: options.category,
        };

        const ownOpts = {
          seed: options.seed || 12,
        };

        return getFakedRoutes(models.routes.execute(routesOpts), ownOpts);
      },
    },
  };
}

function getFakedRoutes(routes, options) {
  return Object.keys(routes).reduce((fakedRoutes, routeKey) => {
    const routeDetails = getHttpMethods(routes[routeKey]).reduce(
      (routeDetails, methodName) => {
        const methodFields = routes[routeKey][methodName];
        const response = populateAllResponseStatuses(
          methodFields.response,
          options,
        );
        const request = populateRequest(methodFields.request, options);

        routeDetails[methodName] = {
          operationId: methodFields.operationId,
          request,
          response,
        };

        return routeDetails;
      },
      {},
    );
    fakedRoutes[routeKey] = routeDetails;
    return fakedRoutes;
  }, {});
}

function populateRequest(request, options) {
  if (!request) {
    return {};
  }

  return Object.keys(request)
    .filter(prop => ['path', 'query', 'body'].includes(prop))
    .reduce((populatedRequest, dataLocation) => {
      populatedRequest[dataLocation] = populateWithFaker(
        request[dataLocation],
        { seed: options.seed },
      );

      return populatedRequest;
    }, {});
}

function populateAllResponseStatuses(response, options) {
  return Object.keys(response).reduce((populatedResponse, responseStatus) => {
    const body = response[responseStatus].body;
    const headers = response[responseStatus].headers;

    populatedResponse[responseStatus] = {
      'application/json': populateBody(body, options),
      headers: populateHeaders(headers, options),
    };

    return populatedResponse;
  }, {});
}

function populateBody(body, options) {
  if (body) {
    return populateWithFaker(body, { seed: options.seed });
  }

  return undefined;
}

function populateHeaders(headers, options) {
  if (headers) {
    return Object.keys(headers).reduce((populatedHeaders, headerName) => {
      populatedHeaders[headerName] = populateWithFaker(headers[headerName], {
        seed: options.seed,
      });

      return populatedHeaders;
    }, {});
  }

  return undefined;
}
