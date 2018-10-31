---
id: data-model
title: Data Model
sidebar_label: Data Model
---

Each property of the data model can be a **primitive** or a **composite**. A **composite** is either an object or an array of **primitives** and/or **composites**. A **primitive** is marked as one by having a `vtype` property, holding one of the [defined primitive types](reference/defined-types.md).

## Primitive

``` javascript
{
  vtype: 'int64',
}
```

## Composite (Object)
``` javascript
{
  name: {
    vtype: 'int64',
  }
}
```

## Composite (Array)
``` javascript
[
  {
    vtype: 'int64',
  }
]
```

## Common Properties

Aside from the `vtype` property, other properties will depend almost entirely by what each injector needs. However, it is practical to have some properties standardized which can be used by multiple injectors. So far, the following properties are recommended to be used:

- `description` - Textual description of the **primitive**.
- `required` - Boolean, denotes whether a **primitive** is required.
- `faker` - Specifies the faker name, array, or options object for generating fake values for that **primitive**, as described [here](reference/faked-data.md).