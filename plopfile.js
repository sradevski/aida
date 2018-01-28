const definitionTypes = ['core', 'endpoints', 'request', 'response', 'schema'];

module.exports = function(plop) {
  // controller generator
  plop.setGenerator('definition', {
    description: 'Model definition',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Definition name please',
      },
    ],
    actions: definitionTypes.map(definitionType => ({
      type: 'add',
      path: `src/definitions/{{pascalCase name}}/{{pascalCase name}}.${definitionType}.js`,
      template:
        'const {{pascalCase name}} = {};\n\nexport default {{pascalCase name}};\n',
    })),
  });
};
