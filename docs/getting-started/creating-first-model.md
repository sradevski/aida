---
id: creating-first-model
title: Creating Your First Model
sidebar_label: Creating Your First Model
---

> If you are more of a "learn-by-example" person, you can first check out [the examples](https://github.com/sradevski/aida/tree/master/examples) first.

Once you have everything set-up and ready, let's go ahead and write our first data model definition.

Models in Aida are just JavaScript objects. Although the fact that we are using a programming language for the model definition might seem weird, considering it is not interoperable compared to a format such as JSON, it is much more powerful. It allows us to do things like referencing other models, writing validation code, writing fake data definition, and it allows us to utilize the entire JS ecosystem. This might change in the future to something more interoperable as the tool evolves.

Let's create a very simple **User** model with an `id` and `email` property. Go to the **models** folder, create a **User** folder, and inside it create a file named **User.core.js**. This is where we define the core properties of a model. 

```javascript
const User = {
  id: {
    vtype: 'string',
  },
  email: {
    vtype: 'string',
  }
};

exports.default = User;
```

Each model property has to contain a type, named `vtype` (we didn't simply use `type` in order to avoid collisions with model properties named `type`). You can find all defined types that can be used as a value of `vtype` [here](reference/defined-types.md). The `vtype` property denotes that the property is a **primitive**. Aida can recognize whether a property is a **composite** or a **primitive** by the presence of the `vtype` property on a **primitive**. Let's now add a **composite** nested object, an `address` property to the `User` model.


```javascript
const Address = {
  city: {
    vtype: 'string',
  },
  street: {
    vtype: 'string',
  }
}

//...The User code
```

Let's add the address property to our `User` object now.

``` javascript
const User = {
  //...Existing properties
  address: Address,
};

exports.default = User;
```

Simple as that! We can put the `Address` model in another file and use it throughout the entire stack, having a consistent definition of an address. We can also cherry-pick only the properties we want instead of the entire `Address` model and it is very easy to do so, as it is just a JavaScript object. 

Let's try specifying another **composite** property, an array of some type:

```javascript
const User = {
  ..., //All other properties
  phoneNumbers: [{vtype: 'string'}],
};

exports.default = User;
```

Doing that defined phoneNumbers as a list of strings. You can also have nested objects in your data models as deep as it is necessary.

We have seen how we can define a model with both **primitive** and **composite** properties, but we can't do much with these models (except generate type definitions and schemas for different languages and technologies). Let's spice things up a bit and enrich our models next.