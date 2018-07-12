import { getDefinitionType, getHttpMethods } from '../../utils/configParsers';

const defaultRootProperties = {
  openapi: '3.0.0',
  info: {
    title: 'The title of the application',
    version: '1.0.0',
  },
};

//generates a swagger.json file that can be used with any swagger-based tool.
export default function main(definitions) {
  return {
    ...definitions,
    swagger: {
      execute: ({ category, rootProps = {} } = {}) =>
        generateSwaggerDocs(
          definitions.routes.execute({ baseUri: '', category }),
          {
            ...defaultRootProperties,
            ...rootProps,
          },
        ),
    },
  };
}

function generateSwaggerDocs(routes, rootProperties) {
  const swaggerFormattedPaths = getSwaggerForRoutes(routes);

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
  return getHttpMethods(route).reduce((methods, methodName) => {
    methods[methodName] = getSwaggerForMethod(route[methodName]);
    return methods;
  }, {});
}

function getSwaggerForMethod(method) {
  return {
    description: method.description,
    operationId: method.operationId,
    ...getRequestParams(method.request),

    responses: Object.keys(method.response).reduce(
      (responses, responseCode) => {
        responses[responseCode] = getResponseRequestBody(
          method.response[responseCode].body,
          method.response[responseCode].description,
        );
        return responses;
      },
      {},
    ),
  };
}

function getRequestParams(request) {
  if (request) {
    return {
      parameters: getRequestPathParameters(request.path),
      requestBody: getResponseRequestBody(request.body, request.description),
    };
  }
  return {};
}

function getRequestPathParameters(requestPath) {
  let swaggerRequest = [];

  if (requestPath) {
    swaggerRequest = Object.keys(requestPath).map(pathKey => {
      return {
        name: pathKey,
        in: 'path',
        required: true,
        schema: getSwaggerForDefinition(requestPath[pathKey]),
      };
    });
  }

  return swaggerRequest.length > 0 ? swaggerRequest : undefined;
}

function getResponseRequestBody(body, description) {
  if (body) {
    const responseContent = body
      ? {
          content: {
            'application/json': {
              schema: getSwaggerForDefinition(body),
            },
          },
        }
      : {};

    return {
      description: description,
      ...responseContent,
    };
  }

  return undefined;
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

  if (defType !== 'object') {
    return Boolean(definition.required);
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
