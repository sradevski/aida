---
id: defined-types
title: Defined Types
sidebar_label: Defined Types
---

The purpose of defining types in Aida is to standardize types to a certain extent, so injectors can make assumptions about how you will write your data models. The types were derived by taking a superset of several technologies while leaving out some more obscure types. The goal is to have common type definitions that will cover at least 80% of the use cases, and for the rest, injector-specific properties can be used to specify the specific type or some additional metadata (such as text size).

Each type is symbolic, in a sense that it doesn't have an entirely concrete definition. It will be up to injectors to decide the mapping between the Aida types and the types defined in the target technology. For example, the `int64` type in Aida might be mapped to `long` for **Avro**, and `bigint` for **MySQL**.

### Logical Types

- bool

### Numeric Types

- decimal
- double
- float
- int64
- int32
- int16
- byte


### Temporal Types

- date
- datetime
- time
- timestamp
- year

### Other Types

- string
- bytes
- blob
