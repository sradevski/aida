import axios from 'axios';

import validstack from '../validstack';
import axiosMockApi from '../injectors/axiosMockApi';

const config = {
  injectors: [axiosMockApi],
  definitions: {
    location: './definitions',
    blacklist: ['helpers.js'],
  },
};

beforeAll(() => {
  validstack(config).mocker();
});

describe('The api mocking function', () => {
  test('returns the expected result', () => {
    axios
      .get('http://localhost:4000/api/users', {
        params: {
          company: 12345,
        },
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  });

  test('POST request with passed data', () => {
    axios
      .post('http://localhost:4000/api/users', {
        firstName: 'Fred',
        lastName: 'Flintstone',
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  });
});
