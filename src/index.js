import validstack from './validstack';
import axiosMockApi from './injectors/axiosMockApi';
import validate from './injectors/validate';

const config = {
  injectors: [axiosMockApi, validate],
  definitions: {
    location: './definitions',
    blacklist: ['helpers.js'],
  },
};

console.log(validstack(config));
