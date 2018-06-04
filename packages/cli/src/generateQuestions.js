const modelTypes = ['core', 'endpoints', 'request', 'response', 'schema'];

export default [
  {
    type: 'input',
    name: 'modelName',
    message: 'Input the name of the model',
  },
  {
    type: 'checkbox',
    name: 'modelTypes',
    message: 'Select all model types that you wish to generate',
    choices: modelTypes,
  },
];
