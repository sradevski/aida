import { populateWithFaker } from '../faker';

describe('The faker function', () => {
  test('returns an empty object when an empty object or undefined are passed', () => {
    expect(populateWithFaker({})).toEqual({});
  });

  test('populates a flat object', () => {
    const populatedObject = populateWithFaker({
      id: {
        type: 'uuid',
        faker: 'random.uuid',
      },
      name: { type: 'string', faker: 'name.findName' },
    });

    expect(populatedObject).toHaveProperty('id');
    expect(populatedObject).toHaveProperty('name');
    expect(typeof populatedObject.id).toBe('string');
    expect(typeof populatedObject.name).toBe('string');
  });

  test('populates a nested object', () => {
    const populatedObject = populateWithFaker({
      addressbook: {
        names: {
          firstName: {
            type: 'string',
            faker: 'name.findName',
          },
        },
        nicknames: [
          {
            type: 'string',
            faker: 'name.findName',
          },
        ],
      },
    });

    expect(populatedObject).toHaveProperty('addressbook.names.firstName');
    expect(typeof populatedObject.addressbook.names.firstName).toBe('string');
    expect(populatedObject.addressbook.nicknames).toHaveLength(8);
    expect(typeof populatedObject.addressbook.nicknames[0]).toBe('string');
  });

  test('populates an array with nested complex object', () => {
    const populatedObject = populateWithFaker([
      {
        names: {
          firstName: {
            type: 'string',
            faker: 'name.findName',
          },
          middleNames: [
            {
              firstOne: {
                type: 'string',
              },
              secondOne: {
                type: 'string',
              },
            },
          ],
        },
      },
    ]);

    expect(populatedObject).toHaveLength(8);
    expect(populatedObject[0]).toHaveProperty('names.firstName');
  });

  test('populates an array with nested primitive object', () => {
    const populatedObject = populateWithFaker([
      {
        names: {
          firstName: {
            type: 'string',
            faker: 'name.findName',
          },
          middleNames: [
            {
              type: 'string',
            },
          ],
        },
      },
    ]);

    expect(populatedObject).toHaveLength(8);
    expect(populatedObject[0]).toHaveProperty('names.firstName');
    expect(populatedObject[0].names.middleNames).toHaveLength(8);
  });

  test('populates an array with primitive object', () => {
    const populatedObject = populateWithFaker([
      {
        type: 'string',
        faker: 'name.findName',
      },
    ]);

    expect(populatedObject).toHaveLength(8);
    expect(typeof populatedObject[0]).toBe('string');
  });

  test("throws an exception if function doesn't exist in faker", () => {
    expect(() =>
      populateWithFaker({
        id: {
          type: 'uuid',
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

  test('returns a random element when passed an array of values', () => {
    const values = ['first', 'second', 'third'];
    const fakeId = populateWithFaker({
      id: {
        type: 'string',
        faker: values,
      },
    }).id;

    expect(values).toContain(fakeId);
  });

  test('returns the same value for the same passed seed', () => {
    const func = () =>
      populateWithFaker(
        {
          id: {
            type: 'uuid',
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
