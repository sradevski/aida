import axios from 'axios';
import mockAdapter from 'axios-mock-adapter';
import { URL } from 'url';
import { populateWithFaker } from '../utils/faker';

export default function axiosMockApi(definitions) {
  const routes = extractRoutes(definitions);
  const createMockApi = configureMocking(routes);

  return { ...definitions, mocker: createMockApi };
}

function extractRoutes(definitions) {
  return Object.values(definitions).reduce((flatRoutes, definition) => {
    if (!definition._raw.endpoints) {
      return flatRoutes;
    }

    const endpointData = definition._raw.endpoints;
    const rootUri = `${endpointData.schemes[0]}://${endpointData.host}${
      endpointData.basePath
    }`;

    const definitionRoutes = Object.keys(endpointData.paths).reduce(
      (definitionPaths, path) => {
        definitionPaths[rootUri + path] = endpointData.paths[path];
        return definitionPaths;
      },
      {},
    );

    flatRoutes = { ...flatRoutes, ...definitionRoutes };
    return flatRoutes;
  }, {});
}

function configureMocking(routes) {
  return () => mockAxiosCalls(routes);
}

function mockAxiosCalls(routes) {
  const mock = new mockAdapter(axios);

  mock.onAny().reply(requestConfig => {
    if (!isRequestDefined(requestConfig, routes)) {
      //TODO: Request path and method don't exist. Return an error specified in the config as well.
      return [500, {}];
    }

    return respondToRequest(requestConfig, routes);
  });
}

function isRequestDefined(requestConfig, routes) {
  const method = requestConfig.method.toLowerCase();
  const requestUrl = new URL(requestConfig.url);

  const matchedRoutes = Object.keys(routes).filter(routeKey => {
    const routeUrl = new URL(routeKey);

    return (
      routes[routeKey][method] &&
      requestUrl.host === routeUrl.host &&
      doPathsMatch(requestUrl.pathname, routeUrl.pathname) &&
      doParamsMatch(
        requestUrl.searchParams,
        routes[routeKey][method].request.query,
      ) &&
      (!['put', 'post'].includes(method) ||
        doBodiesMatch(requestConfig.data, routes[routeKey].request.body))
    );
  });

  return Boolean(matchedRoutes.length);
}

function doBodiesMatch(requestBody, routeBody) {
  const routeBodyKeys = Object.keys(routeBody);

  return !Object.keys(requestBody).filter(bodyField => {
    return routeBodyKeys.includes(bodyField);
  }).length;
}

function doParamsMatch(requestParams, routeParams) {
  return !Object.keys(routeParams).filter(routeParam => {
    return requestParams.has(routeParam);
  }).length;
}

function doPathsMatch(requestPathname, templatePathname) {
  const requestPaths = requestPathname.split('/');
  const templatePaths = templatePathname.split('/');

  if (requestPaths.length !== templatePaths.length) {
    return false;
  }

  for (let i = 0; i < requestPaths.length; i++) {
    if (
      requestPaths[i] !== templatePaths[i] &&
      !templatePaths[i].match(/{:([a-zA-Z0-9]*)}/)
    ) {
      return false;
    }
  }

  return true;
}

function respondToRequest(requestConfig, routes) {
  const { request, response } = routes[requestConfig.url][requestConfig.method];
  if (!response['200']) {
    return [500, {}];
  }

  if (response['200'].isArray) {
    return [200, [populateWithFaker(response['200'].body, { seed: 25 })]];
  }
  return [200, populateWithFaker(response['200'].body, { seed: 123 })];
}
