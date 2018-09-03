import routes from './routesMap.json';
let baseRoute = '';

export function setBaseRoute(route) {
  baseRoute = route;
}

export default function getRoute(routeName, params) {
  const routeTemplate = baseRoute + routes[routeName];
  if (!params) {
    return routeTemplate;
  }

  return Object.keys(params).reduce((parsedPath, paramName) => {
    const param = `{${paramName}}`;
    if (parsedPath.includes(param) && params[paramName]) {
      return parsedPath.replace(param, params[paramName]);
    }

    return parsedPath;
  }, routeTemplate);
}
