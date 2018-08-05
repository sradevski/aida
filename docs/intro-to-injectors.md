---
id: intro-to-injectors
title: Introduction to Injectors
sidebar_label: Introduction to Injectors
---

So far we have defined our **User** model, but we haven't done anything useful with it. Models are used by what we call **injectors**. **Injectors** take models as input and output a function that will generate something useful that was derived from the model definition. Each injector will define the properties it requires in order to generate something meaningful. This means that the properties a **primitive** would have will entirely depend on the **injectors** you wish to use and what properties they expect. For all existing injectors, refer to [this page](existing-injectors.md).

In the **User.core.js** file you created earlier copy the model definition from the [previous page](enriching-the-model.md). In the terminal `cd` to **sampleDir** root location and run the Aida pipeline.

```
aida run
```

This will generate a **fakedModel** file, which will contain something like this (formatted for better legibility):

```json
{  
  "User":[  
    {  
      "id":"27bd418b-05e0-4e40-9fb2-54a9ff7de038",
      "ageRange":"20-30",
      "country":"Cameroon"
    }
  ]
}
```

Like that you have predictable fake data that you can use however you wish. You can use it manually, Pipe it to other injectors built on top of the **fakedModel** injector, or create a **consumer** that will use the generated data in some way (such as inserting the fake data into a development database). Let's check out what **consumers** look like next.