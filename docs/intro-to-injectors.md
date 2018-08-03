---
id: intro-to-injectors
title: Introduction to Injectors
sidebar_label: Introduction to Injectors
---

So far we have defined our **User** model, but we haven't done anything useful with it. Models are used by what we call **injectors**. Injectors take models as input and output a function that will generate something useful that was derived from the model definition. For all existing injectors, refer to TODO: add link here.

In the **User.core.js** file you created earlier copy the model definition from the previous pageTODO: Add link. In the terminal `cd` to **sampleDir** and we can go ahead and run the Aida pipeline.

```
aida run
```

This will generate a **fakedModel** file, which will contain something like this:

```
TODO: Add the content here
```

Like that you have predictable fake data that you can use however you wish. You can either use it manually, or create a **consumer** that will use the generated data in some way (such as inserting the fake data into a development database). Let's check out what **consumers** look like next.