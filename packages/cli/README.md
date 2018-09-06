# Aida CLI

The **cli** package provides an interactive command line interface for **Aida**. You can type `aida -h` To get help on the commands you can run.

The roles of the CLI are:
- Read the settings file `.aidarc` and use it throughout the module.
- Provide a simple interface to interact with **aida**
- Provide an interactive `init` function to setup all required settings
- `run` a pipeline pre-defined in the settings without any additional config
- watch over definition files and rerun the pre-defined pipeline on change.
- Output results to the specified output type.


