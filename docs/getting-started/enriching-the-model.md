---
id: enriching-the-model
title: Enriching Your Model
sidebar_label: Enriching Your Model
---

We now want to add more capabilities to our **User** model. Let's add some way to generate fake data that will have the same schema as our model. This can be done with the **faked-model** injector, but we will keep the discussion about what injectors are for later. For now, let's just enrich our model so it knows what sort of data would fit each property, using the `faker` property.

``` javascript 
const User = {
  id: {
    vtype: 'string',
    faker: 'random.uuid',
  },
  ageRange: {
    vtype: 'string',
    faker: ['20-30', '30-40', '40-50', '50+'],
  },
  country: {
    vtype: 'string',
    faker: { faker: 'address.country',
    options: {
        seed: 10,
      },
    },
  },
};

exports.default = User;
```

We have specified a `faker` property for each **primitive**. The values that the `faker` property can take are either one of the pre-defined values in [Faker.js](https://github.com/marak/Faker.js/), an array of constant values, or an object with either of the previous two, and a faker options object. For more details about how to create fake data, check the [faked data reference](reference/faked-data.md).

Now that we have specified what kind of fake data we want for each property, let's try to generate a faked data schema using [injectors](intro-to-injectors.md).
