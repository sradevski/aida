import chalk from 'chalk';
import program from 'commander';
import inquirer from 'inquirer';
import * as aida from '@aida/core';

import {
  createConfigFile,
  createSchemaFiles,
  readConfig,
  outputToFile,
  getConfigFilePath,
  watchSchema,
} from './filesystem';
import initQuestions from './initQuestions';
import generateQuestions from './generateQuestions';

const CONFIG_FILENAME = '.aidarc';

export default function main() {
  program
    .version('0.0.1', '-v, --version')
    .option(
      '-S --schema-dir <path>',
      'Set the directory for your models. It overrides the config file settings.',
    )
    .option(
      '-O --output-dir <path>',
      'Set the output directory. It overrides the config file settings.',
    );

  program
    .command('run [plugins...]')
    .description(
      'Runs the plugin pipeline you specify. If nothing is specified, the pipeline from your config file is used.',
    )
    .action((plugins, options) => {
      run(plugins, options.parent);
    });

  program
    .command('init')
    .description('Initialize an aida config file.')
    .action(() => {
      init();
    });

  program
    .command('generate [modelName]')
    .description('Generate a schema template.')
    .action(modelName => {
      generate(modelName);
    });

  program
    .command('watch')
    .description(
      'Watch for changes to the schema and run the pipeline on schema change.',
    )
    .action(() => {
      watch();
    });

  program.parse(process.argv);
}

function run(plugins, options) {
  console.log(chalk.yellow(`Getting aida config...`));
  const configData = getConfig(options);
  const pluginsToRun =
    plugins.length > 0 ? plugins : configData.plugins.map(x => x.name);

  console.log(
    chalk.yellow(
      `Running plugins: ${chalk.yellow.bold(pluginsToRun.join(', '))}`,
    ),
  );

  const config = {
    injectors: pluginsToRun.map(pluginName => aida[pluginName]), //[aida.routes, aida.routesMap, aida.swagger],
    models: {
      location: configData.schemaDir,
      blacklistFiles: ['helpers.js'],
      blacklistDirectories: ['intermediate'],
    },
  };

  const aidaResults = aida.run(config);
  configData.plugins.forEach(plugin => {
    if (plugin.outputType === 'file') {
      const outputPath = getOutputPath(
        configData.outputDir,
        plugin.outputFile,
        plugin.name,
      );

      outputToFile(
        JSON.stringify(aidaResults[plugin.name].execute({ category: 'User' })),
        outputPath,
      );
    }
  });

  console.log(chalk.yellow(`Done!`));
}

function getOutputPath(defaultOutputDir, pluginOutputFile, pluginName) {
  return pluginOutputFile || `${defaultOutputDir}${pluginName}`;
}

function init() {
  const configPath = getConfigFilePath(CONFIG_FILENAME, false);
  if (configPath) {
    console.log(
      'A config file already exists. If you wish to reinitialize aida, please delete it first.',
    );

    process.exit();
  }

  inquirer
    .prompt(initQuestions)
    .then(answers => {
      createConfigFile(CONFIG_FILENAME, reformatInitAnswers(answers));
      console.log(chalk.green('Finished generating the config file.'));
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

function generate(modelName) {
  try {
    const configData = getConfig();
    const modelTypes = ['core', 'endpoints', 'request', 'response', 'schema'];

    if (modelName) {
      createSchemaFiles({
        schemaDir: configData.schemaDir,
        modelName,
        modelTypes,
      });
      console.log(chalk.green('Finished creating a new model.'));
    } else {
      inquirer.prompt(generateQuestions).then(answers => {
        createSchemaFiles({ schemaDir: configData.schemaDir, ...answers });
        console.log(chalk.green('Finished creating a new model.'));
      });
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

function watch() {
  const configData = getConfig();
  watchSchema(configData.schemaDir, () => {
    run();
  });
}

function reformatInitAnswers(answers) {
  const modifiedPlugins = [];
  const modifiedAnswers = { ...answers };

  answers.plugins.map(pluginName => {
    modifiedPlugins.push({
      name: pluginName,
      ...(answers[pluginName] ? answers[pluginName] : {}),
    });
    modifiedAnswers[pluginName] = undefined;
  });

  return {
    ...modifiedAnswers,
    plugins: modifiedPlugins,
  };
}

function getConfig(cmdOptions) {
  const configPath = getConfigFilePath(CONFIG_FILENAME, true);
  if (!configPath) {
    console.log(
      'Could not find a aida config file. Please run "aida init" first.',
    );

    process.exit();
  }

  const configData = readConfig(configPath);

  if (cmdOptions) {
    return {
      ...configData,
      schemaDir: cmdOptions.schemaDir || configData.schemaDir,
      outputDir: cmdOptions.outputDir || configData.outputDir,
    };
  }

  return configData;
}
