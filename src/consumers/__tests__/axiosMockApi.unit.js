import axios from 'axios';
import axiosMocker from '../axiosMocker';
import definitionRoutes from './routes.json';

let rootUri = 'http://localhost:4000/api';
const expectedResponse = {
  id: {
    type: 'string',
    required: true,
    faker: 'random.uuid',
  },
  name: {
    type: 'string',
    required: true,
    faker: 'name.findName',
  },
  somethingelse: {
    firstfield: {
      type: 'string',
      faker: 'name.findName',
    },
  },
};

beforeAll(() => {
  axiosMocker(definitionRoutes);
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
      Object.keys(expectedResponse),
    );
  });

  test('without an optional parameter returns data (status 200)', async () => {
    expect.assertions(1);
    const response = await axios.get(`${rootUri}/users`);
    expect(Object.keys(response.data[0])).toEqual(
      Object.keys(expectedResponse),
    );
  });

  test('with path parameter returns data (status 200)', async () => {
    expect.assertions(1);
    const response = await axios.get(`${rootUri}/users/12355`);
    expect(Object.keys(response.data)).toEqual(Object.keys(expectedResponse));
  });

  test('with ambiguous path parameter returns data for best match (status 200)', async () => {
    expect.assertions(1);
    const response = await axios.get(`${rootUri}/users/details`);
    expect(Object.keys(response.data).sort()).toEqual(
      Object.keys({
        ...expectedResponse,
        details: { type: 'string' },
      }).sort(),
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

    expect(Object.keys(response.data)).toEqual(Object.keys(expectedResponse));
  });
});
