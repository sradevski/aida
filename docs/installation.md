---
id: installation
title: Installation
sidebar_label: Installation
---


Let's go and install the command line interface for Aida.

> Note: You will need NodeJS 8+ and NPM, so go install those if you haven't already.

```
npm install -g @aida/cli
```

Lets create a sample directory, and a folder that will store all the models.

```bash
mkdir sampleDir
cd sampleDir
mkdir Models
```

We can go ahead and create a config file using the interactive interface by running `aida init`, but to keep things simple just create a **.aidarc** file in the **sampleDir** directory, and just copy and paste the following config:

```
{
  "modelsDir": "./Models",
  "outputDir": "./",
  "injectors": [
    {
      "name": "routes",
      "outputType": "none"
    },
    {
      "name": "routesMap",
      "outputType": "file",
      "outputFile": ""
    },
    {
      "name": "swagger",
      "outputType": "file",
      "outputFile": ""
    },
    {
      "name": "fakedDataRoutes",
      "outputType": "file",
      "outputFile": ""
    }
  ]
}
```

Normally each application will have its own config, separate from the models, but don't worry too much about the config for now, as all will be explained later on. All the config does is it specifies where the models are defined, and what types of products should be generated from the models.

