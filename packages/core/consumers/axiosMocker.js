import axios from 'axios';
import mockAdapter from 'axios-mock-adapter';
import URL from 'url-parse';

export default function axiosMockApi(routes, baseUri) {
  const mock = new mockAdapter(axios);

  mock.onAny().reply(requestConfig => {
    const definedRoute = getDefinedRoute(requestConfig, routes, baseUri);
    if (!definedRoute) {
      //TODO: Request path and method don't exist. Return an error specified in the config as well.
      return [500, {}];
    }

    return respondToRequest(requestConfig, definedRoute);
  });
}

function getDefinedRoute(requestConfig, routes, baseUri) {
  const method = requestConfig.method.toLowerCase();
  const requestUrl = new URL(requestConfig.url, undefined, true);

  const matchedRoutes = Object.keys(routes).filter(routeKey => {
    const routeUrl = new URL(baseUri + routeKey);

    return (
      routes[routeKey][method] &&
      requestUrl.host === routeUrl.host &&
      doPathsMatch(requestUrl.pathname, routeUrl.pathname) &&
      doParamsMatch(requestUrl.query, routes[routeKey][method].request.query) &&
      (!['put', 'post'].includes(method) ||
        doBodiesMatch(
          requestConfig.data,
          routes[routeKey][method].request.body,
        ))
    );
  });

  return matchedRoutes.length && routes[getBestMatchedRouteUrl(matchedRoutes)];
}

function getBestMatchedRouteUrl(matchedRoutes) {
  const firstTemplateOccurences = matchedRoutes.map(route => {
    return getTemplatePathSegmentIndex(route);
  });

  if (firstTemplateOccurences.includes(-1)) {
    return matchedRoutes[firstTemplateOccurences.indexOf(-1)];
  }

  const bestMatchIndex = firstTemplateOccurences.indexOf(
    firstTemplateOccurences.includes(-1)
      ? -1
      : Math.max.apply(Math, firstTemplateOccurences),
  );

  return matchedRoutes[bestMatchIndex];
}

function doBodiesMatch(requestBody = {}, routeBody = {}) {
  const routeBodyKeys = Object.keys(routeBody);

  return !Object.keys(requestBody).filter(bodyField => {
    return (
      !routeBodyKeys.includes(bodyField) && requestBody[bodyField].required
    );
  }).length;
}

function doParamsMatch(requestParams = {}, routeParams = {}) {
  return !Object.keys(routeParams).filter(routeParam => {
    return !requestParams[routeParam] && routeParams[routeParam].required;
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
      getTemplatePathSegmentIndex(templatePaths[i]) === -1
    ) {
      return false;
    }
  }

  return true;
}

function getTemplatePathSegmentIndex(pathSegment) {
  //The encoded characters are { and } respectively.
  return pathSegment.search(/(%7B|{)[a-zA-Z0-9]*(%7D|})/);
}

function respondToRequest(requestConfig, definedRoute) {
  const { response } = definedRoute[requestConfig.method];
  const possibleResponses = Object.keys(response).filter(x => x !== 'default');

  if (possibleResponses.length > 0) {
    if (response['200']) {
      return [
        200,
        response['200']['application/json'],
        response['200'].headers,
      ];
    }

    return [
      parseInt(possibleResponses[0], 10),
      response[possibleResponses[0]]['application/json'],
      response[possibleResponses[0]].headers,
    ];
  }

  return [500, {}];
}
