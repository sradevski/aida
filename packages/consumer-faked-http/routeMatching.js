import URL from 'url-parse';

export default function getDefinedRoute(requestConfig, routes, baseUri) {
  const method = requestConfig.method.toLowerCase();
  const requestUrl = new URL(requestConfig.url, undefined, true);

  const matchedRoutes = Object.keys(routes).filter(routeKey => {
    const routeUrl = new URL(baseUri + routeKey);

    if (!routes[routeKey][method]) {
      return false;
    }

    const hostsMatch = requestUrl.host === routeUrl.host;
    const pathsMatch = doPathsMatch(requestUrl.pathname, routeUrl.pathname);
    const paramsMatch = doParamsMatch(
      requestUrl.query,
      routes[routeKey][method].request.query,
    );
    const bodiesMatch =
      !['put', 'post'].includes(method) ||
      doBodiesMatch(requestConfig.data, routes[routeKey][method].request.body);

    return hostsMatch && pathsMatch && paramsMatch && bodiesMatch;
  });

  return (
    matchedRoutes.length > 0 && routes[getBestMatchedRouteUrl(matchedRoutes)]
  );
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
