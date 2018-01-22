import { populateWithFaker } from '../faker';

describe('The faker function', () => {
  test('returns an empty object when an empty object or undefined are passed', () => {
    expect(populateWithFaker({})).toEqual({});
  });

  test('populates a flat object', () => {
    const populatedObject = populateWithFaker({
      id: {
        faker: 'random.uuid',
      },
      name: { faker: 'name.findName' },
    });

    expect(populatedObject).toHaveProperty('id');
    expect(populatedObject).toHaveProperty('name');
    expect(typeof populatedObject.id).toBe('string');
    expect(typeof populatedObject.name).toBe('string');
  });

  test('populates a nested object', () => {
    const populatedObject = populateWithFaker({
      addressbook: {
        type: 'object',
        of: {
          names: {
            type: 'object',
            of: {
              firstName: {
                faker: 'name.findName',
              },
            },
          },
        },
      },
    });

    expect(populatedObject).toHaveProperty('addressbook.names.firstName');
    expect(typeof populatedObject.addressbook.names.firstName).toBe('string');
  });

  test('populates an array with nested object', () => {
    const populatedObject = populateWithFaker({
      type: 'array',
      of: {
        names: {
          type: 'object',
          of: {
            firstName: {
              faker: 'name.findName',
            },
          },
        },
      },
    });

    expect(populatedObject).toHaveLength(8);
    expect(populatedObject[0]).toHaveProperty('names.firstName');
  });

  test("throws an exception if function doesn't exist in faker", () => {
    expect(() =>
      populateWithFaker({
        id: {
          faker: 'some.nonfunction',
        },
      }),
    ).toThrow();
  });

  test("returns undefined for properties that don't have faker specified", () => {
    expect(
      populateWithFaker({
        id: {
          type: 'string',
        },
      }).id,
    ).toBe(null);
  });

  test('returns the same value for the same passed seed', () => {
    const func = () =>
      populateWithFaker(
        {
          id: {
            faker: 'random.uuid',
          },
        },
        { seed: 5 },
      );

    const firstCall = func();
    const secondCall = func();

    expect(firstCall.id).toBe(secondCall.id);
  });
});
