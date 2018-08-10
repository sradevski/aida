//Create error codes mapping so only IDs are kept and it can be localized easily.
//0: Generic message (the {field} is invalid).

const basicValidators = {
  integer: val => val,
  // decimal:
  // string:
  range: (val, props) => val,
  // minLength:
  // maxLength:
  // min:
  // max:
};

//Add the generic types - int, double, decimal, etc. to these.
const compositeValidators = {
  // ID: (val) => ({isValid: true, errorCode: 0}),
  // username:
  // email:
  // creditcard:
  // mobilephone:
  // birthday:
  // age:
  // gender:
  // url:
  // text:
  // address:
  // country:
  // city:
  // authorization:
  // latitude:
  // longitude:
};

export default {
  ...basicValidators,
  ...compositeValidators,
  age: () => true,
};

//All of the ones defined above can be set as type. Create a composite type -> swagger type map in swagger. For custom validators, you can use a 'validate' property and just leave them on the object as defined.
