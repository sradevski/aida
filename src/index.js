import validstack from './validstack';
import axiosMockApi from './injectors/axiosMockApi';
import swagger from './injectors/swagger';

const config = {
  injectors: [axiosMockApi, swagger],
  definitions: {
    location: './definitions',
    blacklist: ['helpers.js'],
  },
};

console.log(validstack(config).getSwaggerDocs());
