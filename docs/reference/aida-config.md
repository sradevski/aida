---
id: aida-config
title: Aida Config
sidebar_label: Aida Config
---

A config file is required to run Aida. You can either run `aida init` and follow the initialization steps, or create a **.aidarc** file in the directory where you want to run Aida.

A sample config structure is as follows:

``` json
{
  "modelsDir": "../path/to/models", 
  "outputDir": "./default/output/dir",
  "injectors": [
    {
      "name": "routes",
      "outputType": "none"
    },
    {
      "name": "faked-model",
      "outputType": "file",
      "outputFilepath": "./any/path/filename.json",
      "options": {
        "itemsPerModel": 10, 
        "modelType": "core"
      }
    },
    {
      "name": "swagger",
      "outputType": "file",
      "outputFilepath": ""
    }
  ]
}
```

Note that all injectors accept a single `options` object in the **.aidarc** config file. The options object can contain either own properties, or properties defined in the options of its dependencies in order to override them.

## General Options

<table>
  <tr>
    <th>
      Option Name
    </th>
    <th>
      Description
    </th>
    <th>
      Default Value
    </th>
  </tr>

  <tr>
    <td>
      modelDir  
    </td>
    <td>
      Path to the folder where your models are located  
    </td>
    <td>
      <strong>Required</strong>
    </td>
  </tr>

  <tr>
    <td>
      outputDir  
    </td>
    <td>
      The default output directory if injectors haven't specified an output filepath  
    </td>
    <td>
      <strong>Required</strong>
    </td>
  </tr>

  <tr>
    <td>
      injectors  
    </td>
    <td>
      An array of injectors you wish to run. Each injector object has a set of options  
    </td>
    <td>
      <strong>Required</strong>
    </td>
  </tr>
</table>

## Injector Options


<table>
  <tr>
    <th>
      Option Name
    </th>
    <th>
      Description
    </th>
    <th>
      Default Value
    </th>
  </tr>

  <tr>
    <td>
      name  
    </td>
    <td>
      The name of the injector. It is the name of the package (for example, "@aida/injector-faked-model"), without the "@aida/injector-" part.  
    </td>
    <td>
      <strong>Required</strong>
    </td>
  </tr>

  <tr>
    <td>
      outputType  
    </td>
    <td>
      Specifies the type of output for the injector. Enum("none", "file")
    </td>
    <td>
      <code>"none"</code>
    </td>
  </tr>

  <tr>
    <td>
      outputFilepath  
    </td>
    <td>
      If the outputType is "file", it specifies the path and filename to write the injector result to.
    </td>
    <td>
      <code>outputDir/injectorName</code>
    </td>
  </tr>

  <tr>
    <td>
      options  
    </td>
    <td>
      Injector-specific runtime options. Check the documentation of each injector for more details.
    </td>
    <td>
      <strong>Injector-specific</strong>
    </td>
  </tr>
</table>
