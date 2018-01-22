import axios from 'axios';

import validstack from '../../validstack';
import axiosMockApi from '../axiosMockApi';

const config = {
  injectors: [axiosMockApi],
  definitions: {
    location: './definitions',
    blacklist: ['helpers.js'],
  },
};

let rootUri = '';
let definitions = {};

beforeAll(() => {
  definitions = validstack(config);
  definitions.axiosMockApi();
  rootUri = `${definitions.User._raw.endpoints.schemes[0]}://${
    definitions.User._raw.endpoints.host
  }${definitions.User._raw.endpoints.basePath}`;
});

describe('The api mocking function GET statement', () => {
  test('with optional parameter returns data (status 200)', async () => {
    expect.assertions(1);
    const response = await axios.get(`${rootUri}/users`, {
      params: {
        company: 12345,
      },
    });
    expect(Object.keys(response.data[0])).toEqual(
      Object.keys(definitions.User._raw.response),
    );
  });

  test('without an optional parameter returns data (status 200)', async () => {
    expect.assertions(1);
    const response = await axios.get(`${rootUri}/users`);
    expect(Object.keys(response.data[0])).toEqual(
      Object.keys(definitions.User._raw.response),
    );
  });

  test('with path parameter returns data (status 200)', async () => {
    expect.assertions(1);
    const response = await axios.get(`${rootUri}/users/12355`);
    expect(Object.keys(response.data)).toEqual(
      Object.keys(definitions.User._raw.response),
    );
  });

  test('with ambiguous path parameter returns data for best match (status 200)', async () => {
    expect.assertions(1);
    const response = await axios.get(`${rootUri}/users/details`);
    expect(Object.keys(response.data)).toEqual(
      Object.keys({
        ...definitions.User._raw.response,
        details: { type: 'string' },
      }),
    );
  });

  test('to unexistent url returns status 500', async () => {
    expect.assertions(2);
    try {
      await axios.get(`${rootUri}/users/nonexistent/12355`);
    } catch (error) {
      expect(error.response.status).toEqual(500);
      expect(error.response.data).toEqual({});
    }
  });
});

describe('The api mocking function POST statement', () => {
  test('with expected body data to return data (status 200)', async () => {
    expect.assertions(1);
    const response = await axios.post('http://localhost:4000/api/users', {
      id: 'Fred',
      name: 'Flintstone',
    });

    expect(Object.keys(response.data)).toEqual(
      Object.keys(definitions.User._raw.response),
    );
  });
});
