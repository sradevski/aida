import { crawlDefinition, getDefinitionType } from '../configParsers';

describe('Get definition type', () => {
  test('returns "array" when the definition is an array', () => {
    const type = getDefinitionType([{ vtype: 'string' }]);
    expect(type).toBe('array');
  });

  test('returns "object" when the definition is an object', () => {
    const type = getDefinitionType({
      someObj: { vtype: 'string' },
      someObj2: { vtype: 'int' },
    });
    expect(type).toBe('object');
  });

  test('returns the specified vtype when the definition is a primitive', () => {
    const type = getDefinitionType({ vtype: 'string' });
    expect(type).toBe('string');
  });
});

describe('Crawl definition', () => {
  test('returns an empty object when the definition is empty', () => {
    expect(crawlDefinition({})).toEqual({});
  });

  test('returns an object of primitives with the passed action applied to each of them', () => {
    const def = {
      val1: {
        vtype: 'string',
        someData: 5,
      },
      val2: {
        vtype: 'int',
        someData: 6,
      },
    };

    const expected = {
      val1: 6,
      val2: 7,
    };

    expect(crawlDefinition(def, 'someData', val => val + 1)).toEqual(expected);
  });

  test('returns an array of primitives with the passed action applied to each of them', () => {
    const def = [
      {
        vtype: 'string',
        someData: 5,
      },
    ];

    const expected = 6;

    expect(crawlDefinition(def, 'someData', val => val + 1)).toEqual(expected);
  });

  test('returns an object defined in the array with the passed action applied to it when no array handler is passed', () => {
    const def = [
      {
        val1: {
          vtype: 'string',
          someData: 5,
        },
        val2: {
          vtype: 'string',
          someData: 6,
        },
      },
    ];

    const expected = {
      val1: 6,
      val2: 7,
    };

    expect(crawlDefinition(def, 'someData', val => val + 1)).toEqual(expected);
  });

  test('returns an array of values where each array element is handled by the array handler', () => {
    const def = [
      {
        val1: {
          vtype: 'string',
          someData: 5,
        },
        val2: {
          vtype: 'string',
          someData: 6,
        },
      },
    ];

    const expected = [5, 6];

    expect(
      crawlDefinition(
        def,
        'someData',
        val => val + 1,
        arr => [arr[0].val1.someData, arr[0].val2.someData],
      ),
    ).toEqual(expected);
  });
});
