import chalk from 'chalk';
import program from 'commander';
import inquirer from 'inquirer';
import * as aida from '@aida/core';

import {
  createConfigFile,
  createModelFiles,
  outputToFile,
  pathExists,
  resolveFromCurrentDir,
  getOutputPath,
  getConfigFilePath,
  readConfig,
  watchModels,
} from './filesystem';
import initQuestions from './initQuestions';
import generateQuestions from './generateQuestions';
import camelCase from 'lodash/string/camelCase';

const CONFIG_FILENAME = '.aidarc';

export default function main() {
  program
    .version('0.0.1', '-v, --version')
    .option(
      '-S --models-dir <path>',
      'Set the directory for your models. It overrides the config file settings.',
    )
    .option(
      '-O --output-dir <path>',
      'Set the output directory. It overrides the config file settings.',
    );

  program
    .command('run ')
    .description('Runs the injector pipeline from your config file.')
    .action(options => {
      run(options.parent);
    });

  program
    .command('init')
    .description('Initialize an aida config file.')
    .action(() => {
      init();
    });

  program
    .command('generate [modelName]')
    .description('Generate a model template.')
    .action(modelName => {
      generate(modelName);
    });

  program
    .command('watch')
    .description(
      'Watch for changes to the models and run the pipeline on models change.',
    )
    .action(() => {
      watch();
    });

  program.parse(process.argv);
}

function run(options) {
  console.log(chalk.yellow(`Getting aida config...`));
  const cliConfig = getConfig(options);
  const modelsPath = resolveFromCurrentDir(cliConfig.modelsDir);
  const { existingInjectors, missingInjectorNames } = getInjectors(
    cliConfig.injectors.map(x => x.name),
  );

  const aidaCoreConfig = {
    injectors: Object.values(existingInjectors),
    models: {
      location: modelsPath,
      blacklistFiles: ['helpers.js'],
      blacklistDirectories: ['intermediate'],
    },
  };

  if (missingInjectorNames.length > 0) {
    console.error(
      chalk.yellow(
        `The injectors ${chalk.red.bold(
          missingInjectorNames.join(', '),
        )}, specified in the config are not installed in your local node_modules folder (where .aidarc is located). Did you forget to do 'npm install'?`,
      ),
    );
    process.exit(0);
  }

  console.log(
    chalk.yellow(
      `The models located at ${chalk.yellow.bold(
        aidaCoreConfig.models.location,
      )} will be used.`,
    ),
  );

  console.log(
    chalk.yellow(
      `Running injectors: ${chalk.yellow.bold(
        Object.keys(existingInjectors).join(', '),
      )}`,
    ),
  );

  const aidaResults = aida.run(aidaCoreConfig);

  cliConfig.injectors.forEach(injector => {
    outputInjectorResult(
      injector,
      aidaResults[camelCase(injector.name)].execute,
      cliConfig.outputDir,
    );
  });

  console.log(chalk.yellow(`Done!`));
}

function outputInjectorResult(injector, injectorExecute, defaultOutputDir) {
  if (injector.outputType === 'file') {
    const outputPath = getOutputPath(
      defaultOutputDir,
      injector.outputFilepath,
      injector.name,
    );

    const res = injectorExecute(injector.options);

    if (typeof res === 'string' || res instanceof String) {
      return outputToFile(res, outputPath);
    } else {
      return outputToFile(JSON.stringify(res), outputPath);
    }
  }
}

function getInjectors(injectorNames) {
  return injectorNames.reduce(
    (injectors, injectorName) => {
      const location = resolveFromCurrentDir(
        `node_modules/@aida/${injectorName}`,
      );

      if (pathExists(location)) {
        injectors.existingInjectors[injectorName] = require(location).default;
      } else {
        injectors.missingInjectorNames.push(injectorName);
      }

      return injectors;
    },
    {
      existingInjectors: {},
      missingInjectorNames: [],
    },
  );
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
      createModelFiles({
        modelsDir: configData.modelsDir,
        modelName,
        modelTypes,
      });
      console.log(chalk.green('Finished creating a new model.'));
    } else {
      inquirer.prompt(generateQuestions).then(answers => {
        createModelFiles({ modelsDir: configData.modelsDir, ...answers });
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
  watchModels(configData.modelsDir, () => {
    run();
  });
}

function reformatInitAnswers(answers) {
  const modifiedinjectors = [];
  const modifiedAnswers = { ...answers };

  answers.injectors.map(injectorName => {
    modifiedinjectors.push({
      name: injectorName,
      ...(answers[injectorName] ? answers[injectorName] : {}),
    });
    modifiedAnswers[injectorName] = undefined;
  });

  return {
    ...modifiedAnswers,
    injectors: modifiedinjectors,
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
      modelsDir: cmdOptions.modelsDir || configData.modelsDir,
      outputDir: cmdOptions.outputDir || configData.outputDir,
    };
  }

  return configData;
}
