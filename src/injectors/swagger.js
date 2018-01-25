import { getFlatRoutes, getDefinitionType } from '../utils/configParsers';

const defaultRootProperties = {
  openapi: '3.0.0',
  info: {
    title: 'The title of the application',
    version: '1.0.0',
  },
};

const httpMethods = [
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
];

export default function swagger(definitions) {
  return {
    ...definitions,
    getSwaggerDocs: (rootProps = {}) =>
      generateSwaggerDocs(definitions, {
        ...defaultRootProperties,
        ...rootProps,
      }),
  };
}

function generateSwaggerDocs(definitions, rootProperties) {
  const swaggerFormattedPaths = getSwaggerForRoutes(
    getFlatRoutes(definitions, false),
  );

  const swaggerDocs = {
    ...rootProperties,
    paths: swaggerFormattedPaths,
  };

  return swaggerDocs;
}

function getSwaggerForRoutes(routes) {
  return Object.keys(routes).reduce((swaggerRoutes, routeName) => {
    swaggerRoutes[routeName] = {
      description: routes[routeName].description,
      ...getSwaggerForRouteMethods(routes[routeName]),
    };

    return swaggerRoutes;
  }, {});
}

function getSwaggerForRouteMethods(route) {
  return Object.keys(route)
    .filter(methodName => httpMethods.includes(methodName))
    .reduce((methods, methodName) => {
      methods[methodName] = getSwaggerForMethod(route[methodName]);
      return methods;
    }, {});
}

function getSwaggerForMethod(method) {
  return {
    description: method.description,
    responses: Object.keys(method.response).reduce(
      (responses, responseCode) => {
        responses[responseCode] = getSwaggerForResponse(
          method.response[responseCode],
        );
        return responses;
      },
      {},
    ),
  };
}

function getSwaggerForResponse(response) {
  const responseContent = response.body
    ? {
        content: {
          'application/json': {
            schema: getSwaggerForDefinition(response.body),
          },
        },
      }
    : {};

  return {
    description: response.description,
    ...responseContent,
  };
}

function getSwaggerForDefinition(definition) {
  const defType = getDefinitionType(definition);
  if (defType === 'array') {
    return {
      type: 'array',
      items: {
        ...getSwaggerForDefinition(definition[0]),
      },
    };
  }

  if (defType === 'object') {
    const requiredChildren = getRequiredChildrenNames(definition);
    return {
      required: requiredChildren.length > 0 ? requiredChildren : undefined,
      properties: Object.keys(definition).reduce((properties, field) => {
        properties[field] = getSwaggerForDefinition(definition[field]);
        return properties;
      }, {}),
    };
  }

  return { type: defType };
}

function getRequiredChildrenNames(definition) {
  return Object.keys(definition).filter(child => {
    const defType = getDefinitionType(definition[child]);
    if (defType === 'array' || defType === 'object') {
      return hasRequiredDescendant(definition[child]);
    }

    return Boolean(definition[child].required);
  });
}

//If a definition has a required descendant, it automatically makes it required.
function hasRequiredDescendant(definition) {
  const defType = getDefinitionType(definition);
  if (defType === 'array') {
    return hasRequiredDescendant(definition[0]);
  }

  return Object.keys(definition).reduce((hasRequired, field) => {
    const property = definition[field];
    const propType = getDefinitionType(property);
    if (propType === 'array') {
      hasRequired = hasRequired || hasRequiredDescendant(property[0]);
    } else if (propType === 'object') {
      hasRequired = hasRequired || hasRequiredDescendant(property);
    } else {
      hasRequired = hasRequired || property.required;
    }

    return hasRequired;
  }, false);
}
