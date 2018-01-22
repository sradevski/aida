const rootProperties = {
  openapi: '3.0.0',
  info: {
    title: 'The title of the application',
    version: '1.0.0',
  },
};

export default function swagger(definitions) {
  return {
    ...definitions,
    getSwaggerDocs: () => generateSwaggerDocs(definitions),
  };
}

function generateSwaggerDocs(definitions) {
  const pathsForDefinitions = Object.keys(definitions).map(definitionKey => ({
    swagger: getSwaggerForDefinition(definitions[definitionKey]),
  }));

  const swaggerDocs = {
    ...rootProperties,
    ...pathsForDefinitions,
  };

  return swaggerDocs;
}

function getSwaggerForDefinition(definition) {}
