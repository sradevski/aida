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

To generate a new definition, run `npm run generate definition "DefinitionName"`. This will create all the initial files for a definition.
