import stringify from 'code-stringify';

//The config can be specifications whether to minify, convert to a certain JS version, etc.
export function stringifyObject(obj) {
  if (!obj || typeof obj !== 'object') {
    throw Error('The passed value is not an object');
  }

  const stringifiedCode = stringify(obj, null, 2);
  return `const result = ${stringifiedCode}`;
}

export function stringifyFunction(func) {
  if (!func || !(func instanceof Function)) {
    throw Error('The passed value is not a function');
  }

  return func.toString();
}
