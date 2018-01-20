import validstack from './validstack';
import fakeApi from './injectors/fakeApi';
import validate from './injectors/validate';

const config = {
  injectors: [fakeApi, validate],
  definitions: {
    location: './definitions',
    blacklist: ['helpers.js'],
  },
};

console.log(validstack(config));
