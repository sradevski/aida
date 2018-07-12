const pluginChoices = [
  {
    title: 'Routes',
    value: 'routes',
  },
  {
    title: 'Routes Map',
    value: 'routesMap',
  },
  {
    title: 'Swagger',
    value: 'swagger',
  },
  {
    title: 'Faked Data Routes',
    value: 'fakedDataRoutes',
  },
];

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
    choices: pluginChoices,
  },
];

const pluginQuestions = pluginChoices.reduce(
  (pluginQuestions, pluginChoice) => {
    return [
      ...pluginQuestions,
      ...getPluginQuestions(pluginChoice.title, pluginChoice.value),
    ];
  },
  [],
);

function getPluginQuestions(name, value) {
  return [
    {
      type: 'list',
      name: `${value}.outputType`,
      choices: [
        {
          title: 'None',
          value: 'none',
        },
        {
          title: 'File',
          value: 'file',
        },
      ],
      message: `Specify the type of output for ${name}.`,
      when: answers => answers.plugins.includes(value),
    },
    {
      type: 'input',
      name: `${value}.outputDir`,
      message: `Specify the output directory for ${name} (leave empty for default)`,
      when: answers => {
        answers.plugins.includes(value) && answers[value].outputType === 'file';
      },
    },
  ];
}
export default [...basic, ...pluginQuestions];
