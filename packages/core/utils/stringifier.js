import stringify from 'code-stringify';
import prettier from 'prettier';

const prettierConfig = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'avoid',
};

const defaultObjConfig = {
  prettier: prettierConfig,
};

//The config can be specifications whether to minify, convert to a certain JS version, etc.
export function stringifyObject(obj, config = {}) {
  const finalConfig = { ...defaultObjConfig, ...config };
  if (!obj || typeof obj !== 'object') {
    throw Error('The passed value is not an object');
  }

  const stringifiedCode = stringify(obj, null, 2);
  return prettier.format(
    `const result = ${stringifiedCode}`,
    finalConfig.prettier,
  );
}

const defaultFuncConfig = {
  prettier: prettierConfig,
};

export function stringifyFunction(func, config = {}) {
  const finalConfig = { ...defaultFuncConfig, ...config };
  if (!func || !(func instanceof Function)) {
    throw Error('The passed value is not a function');
  }

  const stringifiedFunc = func.toString();

  return prettier.format(stringifiedFunc, finalConfig.prettier);
}
