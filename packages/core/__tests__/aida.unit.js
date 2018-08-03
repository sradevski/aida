import { run } from '../index';
import path from 'path';

const modelsPath = path.resolve(
  process.cwd(),
  './packages/core/__tests__/models',
);

describe('The aida core run function', () => {
  test('Throws an exception when either models config or location in the models config is not specified', () => {
    expect(() => run({})).toThrow();
    expect(() => run({ models: {} })).toThrow();
  });

  test('The definitions object is available in the _raw property', () => {
    const result = run({
      models: { location: `${modelsPath}/Account` },
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
      models: { location: `${modelsPath}/Account` },
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
      models: { location: `${modelsPath}/Account` },
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
        location: modelsPath,
        blacklistFiles: ['Account.core.js'],
        blacklistDirectories: ['Ignore'],
      },
    });

    expect(result._raw).toEqual({});
  });
});
