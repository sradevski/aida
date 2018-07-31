import run from '../aida';

// The roles of the core are:
// - Accept settings as a parameter
// - Pass the `models` object through the pipeline of injectors and handle the ordering based on the dependency specifications
// - At the end of the pipeline, pass the resulting `models` object to the caller (CLI, JavaScript call, etc.)

// {accepts: models: {}, injectors: []}

describe('The aida core run function', () => {
  test('Throws an exception when either models config or location in the models config is not specified', () => {
    expect(() => run({})).toThrow();
    expect(() => run({ models: {} })).toThrow();
  });

  test('The definitions object is available in the _raw property', () => {
    const result = run({
      models: { location: './packages/core/__tests__/models/Account' },
    });

    expect(result._raw).toEqual({
      Account: {
        core: {
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
    });
  });

  test('The injectors passed are present in the returned object', () => {
    const mockInjector1 = models => ({
      ...models,
      mockInjector1: () => null,
    });

    const mockInjector2 = models => ({
      ...models,
      mockInjector2: () => null,
    });

    const result = run({
      injectors: [mockInjector1, mockInjector2],
      models: { location: './packages/core/__tests__/models/Account' },
    });

    expect(result.mockInjector1).toBeTruthy();
    expect(result.mockInjector2).toBeTruthy();
  });

  test('The injector has access to the models data', () => {
    const mockInjector = models => ({
      ...models,
      mockInjector: () => models._raw.Account.core.id,
    });

    const result = run({
      injectors: [mockInjector],
      models: { location: './packages/core/__tests__/models/Account' },
    });

    expect(result.mockInjector()).toEqual({
      vtype: 'string',
      faker: 'random.uuid',
    });
  });

  test('Ignores blacklisted files and directories', () => {
    const result = run({
      injectors: [],
      models: {
        location: './packages/core/__tests__/models',
        blacklistFiles: ['Account.core.js'],
        blacklistDirectories: ['Ignore'],
      },
    });

    expect(result._raw).toEqual({});
  });
});
