import fakedModel from '../index.js';

const aidaModels = {
  _raw: {
    User: {
      core: {
        id: {
          vtype: 'string',
          faker: 'random.uuid',
        },
        username: {
          vtype: 'string',
          faker: 'internet.userName',
        },
      },
    },
    Account: {
      core: {
        id: {
          vtype: 'string',
          faker: 'random.uuid',
        },
        username: {
          vtype: 'string',
          faker: 'internet.userName',
        },
      },
    },
    Profile: {
      schema: {
        id: {
          vtype: 'string',
          faker: 'random.uuid',
        },
      },
    },
  },
};

let execute;
beforeAll(() => {
  execute = fakedModel(aidaModels).fakedModel.execute;
});

describe('Faked model', () => {
  test('returns only models that have defined core model type', () => {
    const keys = Object.keys(execute());
    expect(keys).toEqual(expect.arrayContaining(['User', 'Account']));

    expect(keys).not.toContain('Profile');
  });

  test('returns only whitelisted models, even if blacklist is provided', () => {
    const keys = Object.keys(
      execute({
        whitelist: ['User'],
        blacklist: ['User'],
      }),
    );

    expect(keys).toContain('User');
    expect(keys).not.toContain('Account');
  });

  test('returns only models not in blacklist', () => {
    const keys = Object.keys(execute({ blacklist: ['Account'] }));
    expect(keys).toContain('User');
    expect(keys).not.toContain('Account');
  });

  test('returns an array with one element of fake data for each model', () => {
    const model = execute();
    expect(model.User).toHaveLength(1);
    expect(model.User[0]).toEqual({
      id: '27bd418b-05e0-4e40-9fb2-54a9ff7de038',
      username: 'Caleb.Lubowitz68',
    });
  });

  test('returns an array with specified number of items of fake data for each model', () => {
    const model = execute({ itemsPerModel: 5 });
    expect(model.User).toHaveLength(5);
    expect(model.User[3]).toEqual({
      id: '4739088c-6600-499c-81b4-ea97a8975e89',
      username: 'Lulu44',
    });
  });

  test('returns data only for models that contain the specified model type', () => {
    const model = execute({ modelType: 'schema' });
    expect(model).not.toHaveProperty('User');
    expect(model).not.toHaveProperty('Account');
    expect(model.Profile).toHaveLength(1);
  });
});
