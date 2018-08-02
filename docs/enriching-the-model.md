---
id: enriching-the-model
title: Enriching Your Model
sidebar_label: Enriching Your Model
---

We now want to add more capabilities to our **User** model. Let's add some way to generate fake data that will have the same schema as our model. This can be done with the **fakedSchema** injector, but we will keep the discussion about what injectors are for later. For now, let's just enrich our model so it knows what sort of data would fit each property.

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
  email: {
    vtype: 'string',
    faker: { faker: 'internet.email',
    options: {
        seed: 10,
      },
    },
  },
};

export default User;
```

We have specified a `faker` property for each **primitive**. The values that the `faker` property can take are either one of the pre-defined values in [Faker.js](https://github.com/marak/Faker.js/), an array of constant values, or an object with either of the previous two, as well as faker options (check the options hereTODO: add link to API here).

Now that we have specified what kind of fake data we want for each property, let's go and try generating it using injectors TODO: Add link on injectors.
