import fakedHttp from '../fakedHttp';
import '../globalFetch';
import modelRoutes from './routes.json';

const rootUri = 'localhost:4000/api';
const expectedResponse = {
  id: '27bd418b-05e0-4e40-9fb2-54a9ff7de038',
  email: 'Katlynn_Upton@gmail.com',
  phoneNumber: '914.750.8191 x2376',
};

beforeAll(() => {
  fakedHttp(modelRoutes, rootUri);
});

describe('The api mocking function GET statement', () => {
  test('with optional parameter returns data (status 200)', async () => {
    expect.assertions(1);
    const response = await fetch(`${rootUri}/users?business=12345`);
    const resVals = Object.keys(JSON.parse(response.body)[0]).sort();
    expect(resVals).toEqual(Object.keys(expectedResponse).sort());
  });

  test('without an optional parameter returns data (status 200)', async () => {
    expect.assertions(1);
    const response = await fetch(`${rootUri}/users`);
    const resVals = Object.keys(JSON.parse(response.body)[0]).sort();
    expect(resVals).toEqual(Object.keys(expectedResponse).sort());
  });

  test('with path parameter returns data (status 200)', async () => {
    expect.assertions(1);
    const response = await fetch(`${rootUri}/users/12355`);
    const resVals = Object.keys(JSON.parse(response.body)).sort();
    expect(resVals).toEqual(Object.keys(expectedResponse).sort());
  });

  test('with ambiguous path parameter returns data for best match (status 200)', async () => {
    expect.assertions(1);
    const response = await fetch(`${rootUri}/users/details`);
    expect(Object.keys(JSON.parse(response.body)).sort()).toEqual(
      Object.keys({
        ...expectedResponse,
        details: { vtype: 'string' },
      }).sort(),
    );
  });

  test('to non-existent url is passed through', async () => {
    expect.assertions(1);
    const response = await fetch(`https://www.google.com`);
    expect(response.status).toBe(200);
  });

  test('includes the specified header in the response', async () => {
    expect.assertions(1);
    const response = await fetch(`${rootUri}/users/details`, {
      method: 'DELETE',
    });

    expect(response.headers.get('location')).toEqual('www.testing.none');
  });

  test('returns the first defined response if 200 response does not exist', async () => {
    expect.assertions(1);
    const response = await fetch(`${rootUri}/users/details`, {
      method: 'DELETE',
    });
    expect(response.status).toEqual(204);
  });
});

describe('The api mocking function POST statement', () => {
  test('with expected body data to return data (status 200)', async () => {
    expect.assertions(1);
    const response = await fetch(`${rootUri}/users`, {
      method: 'POST',
      body: {
        id: 'Fred',
        name: 'Flintstone',
      },
    });
    const resVals = Object.keys(JSON.parse(response.body)).sort();
    expect(resVals).toEqual(Object.keys(expectedResponse).sort());
  });
});
