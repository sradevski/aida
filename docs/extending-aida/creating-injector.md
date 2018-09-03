---
id: creating-injector
title: Creating A Custom Injector
sidebar_label: Creating A Custom Injector
---

Each injector should accept a single `models` parameter (described above) and return a single object with an `execute` function. Note that the injector should be "pure", and it should return a new object which will represent a superset of the `models` object it recieved. The `execute` function should accept a single `options` object, through which all necessary parameters will be passed. Each injector can define its own `options` properties, so there is no standardization in that aspect. The `execute` function will return the expected result for that injector.

The injector should be default exported, so you can name it however you wish internally. `main` might be a reasonable name.

TBD