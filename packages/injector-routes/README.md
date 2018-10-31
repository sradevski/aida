# **Injector** - Routes

## Introduction

The **Routes** injector generates a flat endpoints object for all models defined in your models directory. This injector is used as a base for other injectors, and it has very limited applicability on its own.

## Dependencies

The **Routes** injector has no dependencies.

## Use Cases

The main use case for this injector is, as previously mentioned, as a base for other injectors that require a flat list of all defined endpoints.

## Example

Example is not required, as this injector's result is rarely used by end users.

## API

As previously discussed, all injectors accept a single `options` object in the **.aidarc** config file.

### `options`
- `baseUri` - Specifies the base URI to be hardcoded to each route, if desired. Defaults to `''`.
- `category` - Specifies the category you wish the injector to run on. Not required if your models are not split into categories (subfolders within a model folder).