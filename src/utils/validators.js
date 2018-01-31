//TODO: Create error codes mapping.
//0: Generic message (the {field} is invalid).

const basicValidators = {
  // integer:
  // decimal:
  // string:
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
  // SNID:
  // url:
  // text:
  // address:
  // country:
  // city:
  // authorization:
  // campaignName:
  // latitude:
  // longitude:
  // userRank:
  // rewardType:
};

const validators = {
  ...compositeValidators,
  ...basicValidators,
};

//All of the ones defined above can be set as type. Create a composite type -> swagger type map in swagger. For custom validators, you can use a 'validate' property and just leave them on the object as defined.
