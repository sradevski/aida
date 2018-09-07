---
id: intro-to-injectors
title: Introduction to Injectors
sidebar_label: Introduction to Injectors
---

So far we have defined our **User** model, but we haven't done anything useful with it. Models are used by what we call **injectors**. **Injectors** take models as input and output a function that will generate something useful that was derived from the model definition. Each injector will define the properties it requires in order to generate something meaningful. This means that the properties a **primitive** would have will almost entirely depend on the **injectors** you wish to use and what properties they expect. There are, however, some recurring properties that are useful to be standardized so multiple injectors can utilize them. You can find all standardized properties [here](reference/data-model.md). For all existing injectors, refer to [this page](reference/existing-injectors.md). We will now use the [faked-model](https://github.com/sradevski/aida/tree/master/packages/injector-faked-model) injector with the default options.

In the **User.core.js** file you created earlier, copy the model definition from the [previous page](getting-started/enriching-the-model.md) if you haven't already. In the terminal `cd` to **sampleDir** root location and first install the required injector by running:

```
npm i @aida/injector-faked-model 
```

After the dependency is installed, run:

```
aida run
```

This will generate a **faked-model.json** file, which will contain something like this (formatted for better legibility):

```json
{
  "User": [
    {
      "id": "27bd418b-05e0-4e40-9fb2-54a9ff7de038",
      "email": "Katlynn_Upton@gmail.com",
      "address": {
        "city": "Nara",
        "street": "914 Al Spring Suite 191"
      },
      "phoneNumbers": [
        "376-442-8621",
        "1-071-383-0926 x9917",
        "1-854-446-4799"
      ]
    }
  ]
}

```

Like that you have predictable fake data that you can use however you wish. You can use it manually, pipe it to other injectors built on top of the **faked-model** injector, or create a **consumer** that will use the generated data in some way (such as inserting the fake data into a development database). Let's check out what **consumers** look like next.