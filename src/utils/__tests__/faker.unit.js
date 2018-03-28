import { populateWithFaker } from '../faker';

describe('The faker function', () => {
  test('returns an empty object when an empty object or undefined are passed', () => {
    expect(populateWithFaker({})).toEqual({});
  });

  test('populates a flat object', () => {
    const populatedObject = populateWithFaker({
      id: {
        vtype: 'integer',
        faker: 'random.uuid',
      },
      name: { vtype: 'string', faker: 'name.findName' },
    });

    expect(populatedObject).toHaveProperty('id');
    expect(populatedObject).toHaveProperty('name');
    expect(typeof populatedObject.id).toBe('string');
    expect(typeof populatedObject.name).toBe('string');
  });

  test('populates object according to passed faker options', () => {
    const populatedObject = populateWithFaker({
      id: {
        vtype: 'integer',
        faker: {
          faker: 'random.number',
          options: {
            min: 1000,
            max: 1001,
          },
        },
      },
    });

    expect(populatedObject).toHaveProperty('id');
    expect(populatedObject.id).toBeGreaterThanOrEqual(1000);
    expect(populatedObject.id).toBeLessThanOrEqual(1001);
  });

  test('populates a nested object', () => {
    const populatedObject = populateWithFaker({
      addressbook: {
        names: {
          firstName: {
            vtype: 'string',
            faker: 'name.findName',
          },
        },
        nicknames: [
          {
            vtype: 'string',
            faker: 'name.findName',
          },
          {
            fakerIterations: 8,
          },
        ],
      },
    });

    expect(populatedObject).toHaveProperty('addressbook.names.firstName');
    expect(typeof populatedObject.addressbook.names.firstName).toBe('string');
    expect(populatedObject.addressbook.nicknames).toHaveLength(8);
    expect(typeof populatedObject.addressbook.nicknames[0]).toBe('string');
  });

  test('populates an array with primitive object', () => {
    const populatedObject = populateWithFaker([
      {
        vtype: 'string',
        faker: 'name.findName',
      },
      {
        fakerIterations: 8,
      },
    ]);

    expect(populatedObject).toHaveLength(8);
    expect(typeof populatedObject[0]).toBe('string');
  });

  test('populates array according to settings', () => {
    const populatedObject = populateWithFaker([
      {
        name: {
          vtype: 'string',
          faker: ['a', 'b', 'c'],
        },
        nicknames: [
          {
            vtype: 'string',
            faker: ['l', 'm', 'n'],
          },
          {
            fakerIterations: 8,
            areEntriesUnique: true,
          },
        ],
      },
      {
        fakerIterations: 8,
        areEntriesUnique: true,
        uniqueOn: 'name',
      },
    ]);

    const topArrayLength = populatedObject.length;
    const uniqueValuesLength = Array.from(
      new Set(populatedObject.map(x => x.name)),
    ).length;
    expect(topArrayLength).toBe(uniqueValuesLength);

    const nicknamesLength = populatedObject[0].nicknames.length;
    const nicknamesUniqueLength = Array.from(
      new Set(populatedObject[0].nicknames),
    ).length;
    expect(nicknamesLength).toBe(nicknamesUniqueLength);
  });

  test('populates an array with nested primitive object', () => {
    const populatedObject = populateWithFaker([
      {
        names: {
          firstName: {
            vtype: 'string',
            faker: 'name.findName',
          },
          middleNames: [
            {
              vtype: 'string',
            },
            {
              fakerIterations: 8,
            },
          ],
        },
      },
      {
        fakerIterations: 8,
      },
    ]);

    expect(populatedObject).toHaveLength(8);
    expect(populatedObject[0]).toHaveProperty('names.firstName');
    expect(populatedObject[0].names.middleNames).toHaveLength(8);
  });

  test('populates an array with nested complex object', () => {
    const populatedObject = populateWithFaker([
      {
        names: {
          firstName: {
            vtype: 'string',
            faker: 'name.findName',
          },
          middleNames: [
            {
              firstOne: {
                vtype: 'string',
              },
              secondOne: {
                vtype: 'string',
              },
            },
            {
              fakerIterations: 8,
            },
          ],
        },
      },
      {
        fakerIterations: 8,
      },
    ]);

    expect(populatedObject).toHaveLength(8);
    expect(populatedObject[0]).toHaveProperty('names.firstName');
  });

  test("throws an exception if function doesn't exist in faker", () => {
    expect(() =>
      populateWithFaker({
        id: {
          vtype: 'integer',
          faker: 'some.nonfunction',
        },
      }),
    ).toThrow();
  });

  test("returns undefined for properties that don't have faker specified", () => {
    expect(
      populateWithFaker({
        id: {
          vtype: 'string',
        },
      }).id,
    ).toBe(null);
  });

  test('returns a random element when passed an array of values', () => {
    const values = ['first', 'second', 'third'];
    const fakeId = populateWithFaker({
      id: {
        vtype: 'string',
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
            vtype: 'integer',
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
