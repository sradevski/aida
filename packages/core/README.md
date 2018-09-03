# Aida Core

The roles of the core are:
- Accept settings as a parameter
- Convert model files to the `models` object structure shown below
- Pass the `models` object through the pipeline of injectors and handle the ordering based on the dependency specifications
- At the end of the pipeline, pass the resulting `models` object to the caller (CLI, JavaScript call, etc.)


The resulting object after the core has passed it through all injectors will look something like:

```
{
  \_raw: {
    User: {
      core: {
        //The fields in .core.js
      },
      endpoints: {
        //The fields in .endpoints.js
      }
    },
  },
  injectedFunction1: {
    execute: () => {...}
  },
  injectedFunction2: {
    execute: () => {...}
  },
  ...
}
```
