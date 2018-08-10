export function getModelType(model) {
  if (model.vtype) {
    return model.vtype;
  }

  if (Array.isArray(model)) {
    return 'array';
  }

  return 'object';
}

const httpMethods = [
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
];

//Crawls a model and it replaces each primitive (not an array or object) with the value returned from the action passed. Optionally an array handling function can be passed to handle arrays. It returns the resulting object.
export function crawlModel(rootModel, selector, action, arrayHandler) {
  function crawler(model) {
    const defType = getModelType(model);
    if (defType === 'array') {
      return (
        (arrayHandler && arrayHandler(model, selector, action, arrayHandler)) ||
        crawler(model[0])
      );
    }

    if (defType !== 'object') {
      return action(model[selector]);
    }

    return Object.keys(model).reduce((populatedObject, field) => {
      const property = model[field];
      const propType = getModelType(property);

      if (propType === 'array') {
        populatedObject[field] =
          (arrayHandler &&
            arrayHandler(property, selector, action, arrayHandler)) ||
          crawler(property[0]);
      } else if (propType === 'object') {
        populatedObject[field] = crawler(property);
      } else {
        populatedObject[field] = action(property[selector]);
      }

      return populatedObject;
    }, {});
  }

  return crawler(rootModel);
}

export function getHttpMethods(route) {
  return Object.keys(route).filter(methodName =>
    httpMethods.includes(methodName),
  );
}
