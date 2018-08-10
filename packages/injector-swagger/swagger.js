import { getModelType, getHttpMethods } from '@aida/utils/dist/configParsers';

const defaultRootProperties = {
  openapi: '3.0.0',
  info: {
    title: 'The title of the application',
    version: '1.0.0',
  },
};

//generates a swagger.json file that can be used with any swagger-based tool.
export default function main(models) {
  return {
    ...models,
    swagger: {
      execute: ({ category, rootProps = {} } = {}) =>
        generateSwaggerDocs(models.routes.execute({ baseUri: '', category }), {
          ...defaultRootProperties,
          ...rootProps,
        }),
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
      requestBody: request.body
        ? getResponseRequestBody(request.body, request.description)
        : undefined,
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
        schema: getSwaggerForModel(requestPath[pathKey]),
      };
    });
  }

  return swaggerRequest.length > 0 ? swaggerRequest : undefined;
}

function getResponseRequestBody(body, description) {
  const responseContent = body
    ? {
        content: {
          'application/json': {
            schema: getSwaggerForModel(body),
          },
        },
      }
    : {};

  return {
    description: description,
    ...responseContent,
  };
}

function getSwaggerForModel(model) {
  const defType = getModelType(model);
  if (defType === 'array') {
    return {
      type: 'array',
      items: {
        ...getSwaggerForModel(model[0]),
      },
    };
  }

  if (defType === 'object') {
    const requiredChildren = getRequiredChildrenNames(model);
    return {
      required: requiredChildren.length > 0 ? requiredChildren : undefined,
      properties: Object.keys(model).reduce((properties, field) => {
        properties[field] = getSwaggerForModel(model[field]);
        return properties;
      }, {}),
    };
  }

  return { type: defType };
}

function getRequiredChildrenNames(model) {
  return Object.keys(model).filter(child => {
    const defType = getModelType(model[child]);
    if (defType === 'array' || defType === 'object') {
      return hasRequiredDescendant(model[child]);
    }

    return Boolean(model[child].required);
  });
}

//If a model has a required descendant, it automatically makes it required.
function hasRequiredDescendant(model) {
  const defType = getModelType(model);
  if (defType === 'array') {
    return hasRequiredDescendant(model[0]);
  }

  if (defType !== 'object') {
    return Boolean(model.required);
  }

  return Object.keys(model).reduce((hasRequired, field) => {
    const property = model[field];
    const propType = getModelType(property);
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
