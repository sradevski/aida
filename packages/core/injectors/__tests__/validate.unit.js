import validate from '../validation/validate';

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
      }).getDefinitionsWithValidators(),
    ).toThrow();
  });

  test('returns all properties with assigned validator if specified, or null otherwise', () => {
    const result = validate(aidaDefinitons).getDefinitionsWithValidators();

    expect(result.User.core.username).toBeFalsy();
    expect(result.User.core.tags).toBeFalsy();
    expect(Object.keys(result.User.core.id).length).toBe(3);
  });

  test('returns all used validator functions', () => {
    const validatingObj = validate(aidaDefinitons);
    validatingObj.getDefinitionsWithValidators();
    const validatorFunctions = validatingObj.getValidatorsAsString();

    const sanitized = validatorFunctions
      .replace(/.*istanbul ignore next.*\n/g, '')
      .replace(/.*cov_.*\n/g, '');

    expect(sanitized).toBe(`const result = {
  integer: val => {
    return val;
  },
  range: (val, props) => {
    return val;
  },
  '2dbf2607877600fd8ebcb1653d4d13bf': val => val,
};
`);
  });
});
