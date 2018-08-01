import validate from '../';

const aidaDefinitons = {
  _raw: {
    User: {
      core: {
        id: {
          vtype: 'string',
          faker: 'random.uuid',
          validators: { integer: true, range: { max: 30 }, isId: val => val },
        },
        username: {
          vtype: 'string',
          faker: 'internet.userName',
        },
        tags: [
          {
            vtype: 'string',
            faker: 'commerce.productAdjective',
          },
          {
            iterations: 5,
            areEntriesUnique: true,
          },
        ],
      },
    },
  },
};

describe('The validate injector', () => {
  test('throws an exception when the specified predefined validator doesnt exist', () => {
    expect(() =>
      validate({
        _raw: {
          User: {
            core: {
              id: { vtype: 'string', validators: { nonexistent: true } },
            },
          },
        },
      }).validation.execute(),
    ).toThrow();
  });

  test('returns all properties with assigned validator if specified, or null otherwise', () => {
    const result = validate(aidaDefinitons).validation.execute();

    expect(result.User.core.username).toBeFalsy();
    expect(result.User.core.tags).toBeFalsy();
    expect(Object.keys(result.User.core.id).length).toBe(3);
  });

  test('returns all used validator functions', () => {
    const validatingObj = validate(aidaDefinitons);
    validatingObj.validation.execute();
    const validatorFunctions = validatingObj.validation.getValidatorsAsString();

    const sanitized = validatorFunctions.replace(
      /\/\* istanbul ignore next.*return/g,
      'return',
    );

    expect(sanitized).toBe(`const result = {
  integer: val => {return val;},
  range: (val, props) => {return val;},
  \"88fe1edfc09662fb57bb2274c1edc88f\": val => val
}`);
  });
});
