import validate from '../validation/validate';
import dummyDef from './dummyDef';

describe('The validate injector', () => {
  test('throws an exception when the specified predefined validator doesnt exist', () => {
    expect(() =>
      validate({
        _raw: {
          User: {
            core: { id: { type: 'string', validators: { nonexistent: true } } },
          },
        },
      }).getDefinitionsWithValidators(),
    ).toThrow();
  });

  test('returns all properties with assigned validator if specified, or null otherwise', () => {
    const result = validate(dummyDef).getDefinitionsWithValidators();

    expect(result.User.core.username).toBeFalsy();
    expect(result.User.core.tags).toBeFalsy();
    expect(Object.keys(result.User.core.id).length).toBe(3);
  });

  test('returns all used validator functions', () => {
    const validatingObj = validate(dummyDef);
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
  '89f4bebb29507c2031c689d0259a5faa': val => {
    return val;
  },
};
`);
  });
});
