Add a readme later.

# Introduction

A full stack tool that generates Swagger documentation, Flow types, MongoDB schemas, frontend/backend validators, and fake API all from just JSON definition documents.

### Supported types
uuidv4 - uuidv4 value
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

The main function will read each of the files in each of the folders in definitions, and pipe that object through each of the injectors (validation, databases, etc.). Each of them will return a new superset of the received object, with injected functions (.validate(), .getFlowTypes(), etc.) and objects (.mongooseSchema, etc.). The injectors have to be pure and they should not alter the structure of the raw object as output. The results can also be piped to an output module that can output to a file, console, etc.

An example object passed to the injectors:
```
{
  User: {
    \_raw: {
      core: {
        //The fields in .core.js
      },
      request: {
        //The fields in .request.js
      }
    },
    injectedFunction1: () => null,
    injectedObject1: {
      //Blah
    }
  },
  fakeApiObject: {

  }
}
```
