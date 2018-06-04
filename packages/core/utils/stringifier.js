import stringify from 'code-stringify';

const defaultObjConfig = {};

//The config can be specifications whether to minify, convert to a certain JS version, etc.
export function stringifyObject(obj, config = {}) {
  const finalConfig = { ...defaultObjConfig, ...config };
  if (!obj || typeof obj !== 'object') {
    throw Error('The passed value is not an object');
  }

  const stringifiedCode = stringify(obj, null, 2);
  return `const result = ${stringifiedCode}`;
}

const defaultFuncConfig = {};

export function stringifyFunction(func, config = {}) {
  const finalConfig = { ...defaultFuncConfig, ...config };
  if (!func || !(func instanceof Function)) {
    throw Error('The passed value is not a function');
  }

  return func.toString();
}
