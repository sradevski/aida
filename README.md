# Aida

Needs and Usage of Aida
https://docs.google.com/spreadsheets/d/1JBAAty461-kV2t9Qgmldb4Xt6Tsi76vDahcSWwd6h4A/edit#gid=0

# Introduction

A full stack tool that generates Swagger documentation, Flow types, MongoDB schemas, frontend/backend validators, and fake API all from just JSON definition documents.

### Supported types
integer	integer	int32	signed 32 bits
long	integer	int64	signed 64 bits
float	number	float
double	number	double
string	string		
byte	string	byte	base64 encoded characters
binary	string	binary	any sequence of octets
boolean	boolean		
date	string	date	As defined by full-date - RFC3339
dateTime	string	date-time	As defined by date-time - RFC3339
password	string	password	A hint to UIs to obscure input.


### Architecture

By default, there are several model definitions:
- Core: The base properties inherited by all other models
- Request: The properties that are sent from the client side when creating a new entity
- Response: The response from the server when getting the entity asked for
- Endpoints: The endpoints served by the backend, along with the information for the request, response, and so on
- Schema: The schema definition for the database

For simplicity reasons, you are only allowed to use a subset of Request and Response (or any other added definition type) in Endpoints and you should not add any additional fields.

The main function will read each of the files in each of the folders in definitions, and pipe that object through each of the injectors (validation, databases, etc.). Each of them will return a new superset of the received object, with injected functions (.validate(), .getFlowTypes(), etc.) and objects (.mongooseSchema, etc.). The injectors have to be pure and they should not alter the structure of the raw object as output. The results can also be piped to an output module that can output to a file, console, etc. Note that you can depend on a previous injector, but you have to manage the order of execution by yourself for now.

An example object passed to the injectors:
```
{
  \_raw: {
    User: {
      core: {
        //The fields in .core.js
      },
      request: {
        //The fields in .request.js
      }
    },
  },
  injectedFunction1: {
  }
}
```

### Usage

For a start, all definitions are flat. However, each definition can have subfolders - categories that use a similar model with some differences (Account for businesses and Account for users). The same can also be achieved just by creating a flat definition for each, and then adding the ones you don't want in a blacklist. However, the category concept is a bit cleaner in my opinion.



### Core

The roles of the core are:
- Accept settings as a parameter
- Convert definition files to the `definitions` object structure explained above
- Pass the `definitions` object through the pipeline of injectors and handle the ordering based on the dependency specifications
- At the end of the pipeline, pass the resulting `definitions` object to the caller (CLI, JavaScript call, etc.)


### CLI

The **cli** package provides an interactive command line interface for **Aida**. You can type `aida -h` To get help on the commands you can run.

The roles of the CLI are:
- Read the settings file `.aidarc` and use them throughout the module.
- Provide a simple interface to interact with **aida**
- Provide an interactive `init` function to setup all required settings
- `run` a pipeline pre-defined in the settings without any additional config
- `run` a custom injector from the command line, passing all settings inline.
- `generate` a new definition
- watch over definition files and rerun the pre-defined pipeline on change.
- Output results to STDOUT or file if specified.

### Injectors

##### fakedDataRoutes

For now, this injector is supposed to be used for request-response endpoints. There is no support for streaming and websockets yet. Moreover, the only supported response content type is "application/json". Also, the headers are not preserved as of now.

This injector should generate an object of the following structure:

```
{
  '/url1' : {
    "get": {
      operationId: "someId",
      request: fakedData
      response: {
        '200' : {
          "application/json": fakedData
        },
        '404': {
          "application/json": fakedData
        },
        'default': {
          "application/json": fakedData
        },
      }
    },
    "post": {
    
    },
    ...
  }
}

```

TODO: Currently the structure is different, and the request is not populated. This means the consumer needs to be updated as well.


### Consumers

### network call mock (currently axiosMocker)

Currently it depends on axios and axios mocker, although it can be easily removed and use XMLHttpRequest instead.

If the request matches one of the fakedDataRoutes object responses, it should return that response. If it doesn't match any, it should be passed through (and maybe log it in console).

If a request doesn't have a "200" response for the request, the first response status in the responses will be returned.

TODO: Remove axios and use either the sinon mock server or polly.



### Contributing

##### Pipeline

Definitions -> Injectors -> Output

For convenience, the output can be set to STDOUT, file, or none if you just want the injector function to be injected into the definitions. If you wish a custom output, you can specify the injector with your own custom injector, from where you can do whatever you wish with the results.

##### Injectors structure

Each injector should accept a single `definitions` parameter (described above) and return a single object with an `execute` function. The `execute` function should accept a single `options` object, through which all necessary parameters will be passed. Each injector can define its own properties, so there is no standardization in that aspect. The `execute` function will return the expected result for that injector.

The injector should be default exported, so you can name it however you wish internally. `main` might be a reasonable name.