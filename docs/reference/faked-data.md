---
id: faked-data
title: Faked Data
sidebar_label: Faked Data
---

In order to generate fake data for your models, **primitives** can take a property called `faker`. As mentioned in a previous article, the values that the `faker` property can take are either one of the pre-defined values in [Faker.js](https://github.com/marak/Faker.js/), an array of constant values, or an object with either of the previous two, and a faker options object.

## Example

``` javascript
const User = {
  id: {
    vtype: 'string',
    faker: 'random.uuid', //The random.uuid method of Faker.js with default options
  },

  city: {
    vtype: 'string',
    faker: ['Nara', 'Berlin', 'Nairobi'] // An array of values, each chosen randomly
  },

  street: {
    vtype: 'string',
    faker: {
      faker: 'address.streetAddress', //The address.streetAddress method of Faker.js
      options: {
        useFullAddress: true, //The address.streetAddress method supports an option called useFullAddress, which can be specified using the `options` property.
      },
    },
  }
}

```

## API

If you are passing a **string**, it has to be one of the methods supported by **Faker.js**, found [here](https://github.com/Marak/faker.js#api-methods).

If you are passing an **array**, it can contain any number of entries that will be randomly selected based on the `seed` passed to the injectors that will generate the fake data.

If you are passing an **object**, it can take the following properties:
- `faker` - It can take either a string or an array, as described previously
- `options` - An options object passed to **Faker.js** method you have specified (check the documentation for each method in **Faker.js** for more details about the supported options) if you passed a string, or it is ignored otherwise.


