import fakedSchema from '../fakedSchema';

const aidaDefinitions = {
  _raw: {
    User: {
      schema: {
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
      schema: {
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
      core: {
        id: {
          vtype: 'string',
          faker: 'random.uuid',
        },
      },
    },
  },
};

let getSchema;
beforeAll(() => {
  getSchema = fakedSchema(aidaDefinitions).getFakedSchema;
});

describe('Faked schema', () => {
  test('returns only definitions that have defined schema', () => {
    const keys = Object.keys(getSchema());
    expect(keys).toEqual(expect.arrayContaining(['User', 'Account']));

    expect(keys).not.toContain('Profile');
  });

  test('returns only whitelisted definitions, even if blacklist is provided', () => {
    const keys = Object.keys(
      getSchema({ whitelist: ['User'], blacklist: ['User'] }),
    );

    expect(keys).toContain('User');
    expect(keys).not.toContain('Account');
  });

  test('returns only definitions not in blacklist', () => {
    const keys = Object.keys(getSchema({ blacklist: ['Account'] }));
    expect(keys).toContain('User');
    expect(keys).not.toContain('Account');
  });

  test('returns an array with one element of fake data for each definition', () => {
    const schema = getSchema();
    expect(schema.User).toHaveLength(1);
    expect(schema.User[0]).toEqual({
      id: '27bd418b-05e0-4e40-9fb2-54a9ff7de038',
      username: 'Caleb.Lubowitz68',
    });
  });

  test('returns an array with specified number of items of fake data for each definition', () => {
    const schema = getSchema({ itemsPerDefinition: 5 });
    expect(schema.User).toHaveLength(5);
    expect(schema.User[3]).toEqual({
      id: '4739088c-6600-499c-81b4-ea97a8975e89',
      username: 'Lulu44',
    });
  });
});
