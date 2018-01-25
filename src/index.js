import validstack from './validstack';
import axiosMockApi from './injectors/axiosMockApi';
import swagger from './injectors/swagger';

import fileOutput from './output/fileOutput';

const config = {
  injectors: [axiosMockApi, swagger],
  definitions: {
    location: './definitions',
    blacklist: ['helpers.js'],
  },
};

fileOutput(
  JSON.stringify(validstack(config).getSwaggerDocs()),
  'swagTest.json',
);
