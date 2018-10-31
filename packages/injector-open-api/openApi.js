import { getModelType, getHttpMethods } from '@aida/utils/dist/configParsers';
import aidaToOpenApiType from './typeConversion';

//generates a openapi.json file that can be used with any openapi-based tool.
export default function main(models, options = {}) {
  return {
    ...models,
    openApi: {
      execute: (overriddenOptions = {}) => {
        const routesOpts = {
          baseUri: overriddenOptions.baseUri || options.baseUri || '',
          category: overriddenOptions.category || options.category,
        };

        const ownOpts = {
          openapi: '3.0.0',
          info: {
            title: options.title || 'MyApp',
            version: options.version || '0.0.1',
          },
        };

        return generateOpenApiDocs(models.routes.execute(routesOpts), ownOpts);
      },
    },
  };
}

function generateOpenApiDocs(routes, options) {
  const openApiFormattedPaths = getOpenApiForRoutes(routes);

  const openApiDocs = {
    ...options,
    paths: openApiFormattedPaths,
  };

  return openApiDocs;
}

function getOpenApiForRoutes(routes) {
  return Object.keys(routes).reduce((openApiRoutes, routeName) => {
    openApiRoutes[routeName] = {
      description: routes[routeName].description,
      ...getOpenApiForRouteMethods(routes[routeName]),
    };

    return openApiRoutes;
  }, {});
}

function getOpenApiForRouteMethods(route) {
  return getHttpMethods(route).reduce((methods, methodName) => {
    methods[methodName] = getOpenApiForMethod(route[methodName]);
    return methods;
  }, {});
}

function getOpenApiForMethod(method) {
  return {
    description: method.description,
    operationId: method.operationId,
    ...getRequest(method.request),
    responses: Object.keys(method.response).reduce(
      (responses, responseCode) => {
        responses[responseCode] = getBody(
          method.response[responseCode].body,
          method.response[responseCode].description,
        );
        return responses;
      },
      {},
    ),
  };
}

function getRequest(request) {
  if (request) {
    return {
      parameters: getRequestParameters(request.path, request.query),
      requestBody: request.body
        ? getBody(request.body, request.description)
        : undefined,
    };
  }

  return {};
}

function getRequestParameters(requestPath, requestQuery) {
  let openApiRequest = [];
  if (requestPath) {
    openApiRequest = openApiRequest.concat(
      Object.keys(requestPath).map(pathKey => {
        return {
          ...getSchema(requestPath[pathKey]),
          name: pathKey,
          in: 'path',
          description: requestPath[pathKey].description,
          required: true, //Path parameters must be required.
        };
      }),
    );
  }

  if (requestQuery) {
    openApiRequest = openApiRequest.concat(
      Object.keys(requestQuery).map(queryKey => {
        return {
          name: queryKey,
          in: 'query',
          description: requestQuery[queryKey].description,
          required:
            requestQuery[queryKey].vtype && requestQuery[queryKey].required, //Its a primitive and required
          ...getSchema(requestQuery[queryKey]),
        };
      }),
    );
  }

  return openApiRequest.length > 0 ? openApiRequest : undefined;
}

function getBody(body, description) {
  const responseContent = body
    ? {
        content: {
          'application/json': getSchema(body),
        },
      }
    : {};

  return {
    description: description,
    ...responseContent,
  };
}

function getSchema(model) {
  const defType = getModelType(model);
  if (defType === 'array') {
    return {
      schema: {
        type: 'array',
        items: getSchema(model[0]).schema,
      },
    };
  }

  if (defType === 'object') {
    const requiredChildren = getRequiredChildrenNames(model);
    return {
      schema: {
        required: requiredChildren.length > 0 ? requiredChildren : undefined,
        properties: Object.keys(model).reduce((properties, field) => {
          properties[field] = getSchema(model[field]).schema;
          return properties;
        }, {}),
      },
    };
  }

  return {
    required: model.required,
    schema: { type: aidaToOpenApiType(defType) },
  };
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
