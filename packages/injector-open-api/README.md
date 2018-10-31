# **Injector** - Open API

## Introduction

The **Open API** injector generates Open API/Swagger 3.0-compatible JSON documentation file from your endpoint definitions.

## Dependencies

The **Open API** injector depends on:
- [@aida/injector-routes](https://github.com/sradevski/aida/tree/master/packages/injector-routes)

## Use Cases

The main use case for this injector is to generate Open API documentation. It can also be used as the foundation for other supporting tools built on top of the Open API syntax.

## Example

The injector simply generates Open API-compatible json file. For further uses of such syntax you can check other supporting resources built on top of Open API.

## API

### `options`

- `title` - The title of the Open API documentation. Defaults to `'MyApp'`.
- `version` - The version of your Open API documentation. Defaults to `'0.0.1'`.
