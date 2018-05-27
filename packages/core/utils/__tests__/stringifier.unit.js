import { stringifyFunction, stringifyObject } from '../stringifier';

describe('stringify function', () => {
  test('throws when null or non-function is passed', () => {
    expect(() => stringifyFunction(null)).toThrow();
    expect(() => stringifyFunction('hi there')).toThrow();
    expect(() => stringifyFunction({})).toThrow();
  });

  test('returns the passed ES5 function as is when no config provided', () => {
    const func = function test() {
      var a = 1;
      var b = 2;
      return a + b;
    };

    const funcAsString = stringifyFunction(func);
    const expectedVal = `function test() {
  var a = 1;
  var b = 2;
  return a + b;
}
`;

    expect(funcAsString).toBe(expectedVal);
  });

  test('returns the passed ES6+ function as is when no config provided', () => {
    const func = () => {
      const a = 1;
      const b = 2;
      return a + b;
    };

    const funcAsString = stringifyFunction(func);
    const expectedVal = `() => {
  const a = 1;
  const b = 2;
  return a + b;
};
`;

    expect(funcAsString).toBe(expectedVal);
  });
});

describe('stringify object', () => {
  test('throws when null or non-object is passed', () => {
    expect(() => stringifyObject(null)).toThrow();
    expect(() => stringifyObject('hi there')).toThrow();
    expect(() => stringifyObject(() => null)).toThrow();
  });

  test('stringifies data-only object to json successfully as is without config', () => {
    const data = {
      a: 1,
      b: {
        c: 2,
        d: 'test',
      },
    };

    const result = stringifyObject(data);
    const expected = `const result = {
  a: 1,
  b: {
    c: 2,
    d: 'test',
  },
};
`;
    expect(result).toBe(expected);
  });

  test('stringifies data and functions object successfully as is without config', () => {
    const data = {
      a: 1,
      b: {
        d: () => {
          return 'test';
        },
      },
    };

    const result = stringifyObject(data);
    const expected = `const result = {
  a: 1,
  b: {
    d: () => {
      return 'test';
    },
  },
};
`;

    expect(result).toBe(expected);
  });
});
