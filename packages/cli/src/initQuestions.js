const basic = [
  {
    type: 'input',
    name: 'schemaDir',
    message: 'Specify the default schemas directory',
  },
  {
    type: 'input',
    name: 'outputDir',
    message: 'Specify the default output directory',
  },
  {
    type: 'checkbox',
    name: 'plugins',
    message: 'Select all plugins you wish to run',
    choices: [
      {
        title: 'Swagger',
        value: 'swagger',
      },
      {
        title: 'Validate',
        value: 'validate',
      },
    ],
  },
];

const swagger = [
  {
    type: 'input',
    name: 'swagger.outputDir',
    message:
      'Specify the output directory for Swagger (leave empty for default)',
    when: answers => answers.plugins.includes('swagger'),
  },
  {
    type: 'input',
    name: 'swagger.otherParam',
    message: 'Specify some other param',
    when: answers => answers.plugins.includes('swagger'),
  },
];

export default [...basic, ...swagger];
