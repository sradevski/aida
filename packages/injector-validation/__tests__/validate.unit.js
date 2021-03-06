import validate from '../index.js';

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

  //Note: Istanbul adds code to the validators, which makes the test fail when calculating coverage. Resolve once the validation injector is completed.
  //   test('returns all used validator functions', () => {
  //     const validatingObj = validate(aidaDefinitons);
  //     validatingObj.validation.execute();
  //     const validatorFunctions = validatingObj.validation.getValidatorsAsString();

  //     expect(validatorFunctions).toBe(`const result = {
  //   integer: val => val,
  //   range: (val, props) => val,
  //   \"88fe1edfc09662fb57bb2274c1edc88f\": val => val
  // }`);
  //   });
});
