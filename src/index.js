import validstack from './validstack';
import axiosMockApi from './injectors/axiosMockApi';
import swagger from './injectors/swagger';
import { outputToFile } from './utils/filesystem';

const config = {
  injectors: [axiosMockApi, swagger],
  definitions: {
    location: './definitions',
    blacklist: ['helpers.js'],
  },
};

outputToFile(
  JSON.stringify(validstack(config).getSwaggerDocs()),
  'swagTest.json',
);
