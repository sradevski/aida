---
id: installation
title: Installation
sidebar_label: Installation
---

> Note: You will need NodeJS 8+ and NPM, so go and install those if you haven't already.

Let's go and install the command line interface for Aida.

```
npm install -g @aida/cli
```
> You can, of course, install Aida locally, but we will install it globally to simplify the demonstration.

Let's create a sample directory for our project and a directory inside it that will store all the models.

```bash
mkdir sampleDir
cd sampleDir
mkdir models
```

We can create a config file using the interactive interface by running `aida init`, but to keep things simple just create a **.aidarc** file in the **sampleDir** directory, and just copy and paste the following config:

```
{
  "modelsDir": "./models",
  "outputDir": "./",
  "injectors": [
    {
      "name": "faked-model",
      "outputType": "file",
      "outputFile": ""
    }
  ]
}
```

Normally each application will have its own config, separate from the models, but don't worry too much about the config for now, as all will be explained later on. All the config does is it specifies where the models are defined, and what types of products should be generated from the models.

