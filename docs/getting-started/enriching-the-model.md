---
id: enriching-the-model
title: Enriching Your Model
sidebar_label: Enriching Your Model
---

We now want to add more capabilities to our **User** model. Let's add some way to generate fake data that will have the same schema as our model. This can be done with the **faked-model** injector, but we will keep the discussion about what injectors are for later. For now, let's just enrich our model so it knows what sort of fake data would fit for each property, using the `faker` property. Go ahead and copy the below code to **User.core.js** file, as it will be used in the next step.

``` javascript 
const Address = {
  city: {
    vtype: 'string',
    faker: ['Nara', 'Berlin', 'San Francisco', 'Sydney', 'Nairobi']
  },
  street: {
    vtype: 'string',
    faker: { 
      faker: 'address.streetAddress',
      options: {
        seed: 10,
      },
    },
  }
}

const User = {
  id: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  email: {
    vtype: 'string',
    faker: 'internet.email'
  },
  address: Address,
  phoneNumbers: [{
    vtype: 'string',
    faker: 'phone.phoneNumber',
  }, {
    fakerIterations: 3,
  }], //The second object in the array is options regarding the array for various injectors 
};

exports.default = User;
```

We have specified a `faker` property for each **primitive**. Just by specifying the `faker` property, each injector that needs some fake data will now know what kind of data to generate for each **primitive**. The values that the `faker` property can take are either one of the pre-defined values in [Faker.js](https://github.com/marak/Faker.js/), an array of constant values, or an object with either of the previous two, and a faker options object. For more details about how to create fake data, check the [faked data reference](reference/faked-data.md).

Now that we have specified what kind of fake data we want for each property, let's try to generate a faked data schema using [injectors](getting-started/intro-to-injectors.md).
