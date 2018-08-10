const pluginChoices = [
  {
    title: 'Routes',
    value: 'routes',
  },
  {
    title: 'Routes Map',
    value: 'routes-map',
  },
  {
    title: 'Swagger',
    value: 'swagger',
  },
  {
    title: 'Faked Data Routes',
    value: 'faked-data-routes',
  },
  {
    title: 'Faked Model',
    value: 'faked-model',
  },
];

const basic = [
  {
    type: 'input',
    name: 'modelsDir',
    message: 'Specify the default models directory',
  },
  {
    type: 'input',
    name: 'outputDir',
    message: 'Specify the default output directory',
  },
  {
    type: 'checkbox',
    name: 'injectors',
    message: 'Select all injectors you wish to run',
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
      when: answers => answers.injectors.includes(value),
    },
    {
      type: 'input',
      name: `${value}.outputFilepath`,
      message: `Specify the output file for ${name} (leave empty for default directory with plugin name as filename)`,
      when: answers => {
        return (
          answers.injectors.includes(value) &&
          answers[value].outputType === 'file'
        );
      },
    },
  ];
}
export default [...basic, ...pluginQuestions];
