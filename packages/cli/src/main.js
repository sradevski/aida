import chalk from 'chalk';
import program from 'commander';
import inquirer from 'inquirer';
import path from 'path';
import * as aida from '@aida/core';

import {
  createConfigFile,
  createModelFiles,
  readConfig,
  outputToFile,
  getConfigFilePath,
  watchModels,
} from './filesystem';
import initQuestions from './initQuestions';
import generateQuestions from './generateQuestions';

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
    .command('run [injectors...]')
    .description(
      'Runs the injector pipeline you specify. If nothing is specified, the pipeline from your config file is used.',
    )
    .action((injectors, options) => {
      run(injectors, options.parent);
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

function run(injectors, options) {
  console.log(chalk.yellow(`Getting aida config...`));
  const cliConfig = getConfig(options);
  const { existingInjectorNames, missingInjectorNames } = getInjectorNames(
    injectors,
    cliConfig,
  );

  const aidaCoreConfig = {
    injectors: existingInjectorNames.map(injectorName => aida[injectorName]),
    models: {
      location: path.resolve(process.cwd(), cliConfig.modelsDir),
      blacklistFiles: ['helpers.js'],
      blacklistDirectories: ['intermediate'],
    },
  };

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
        existingInjectorNames.join(', '),
      )}`,
    ),
  );

  if (missingInjectorNames.length > 0) {
    console.log(
      chalk.yellow(
        `The following injectors could not be found and will be skipped: ${chalk.yellow.bold(
          missingInjectorNames.join(', '),
        )}`,
      ),
    );
  }

  const aidaResults = aida.run(aidaCoreConfig);

  cliConfig.injectors
    .filter(injector => existingInjectorNames.includes(injector.name))
    .forEach(injector => {
      outputInjectorResult(
        injector,
        aidaResults[injector.name].execute,
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

function getInjectorNames(injectors, configData) {
  const mergedInjectors =
    injectors.length > 0 ? injectors : configData.injectors.map(x => x.name);

  const existingInjectorNames = mergedInjectors.filter(
    injectorName => aida[injectorName],
  );
  const missingInjectorNames = mergedInjectors.filter(
    injectorName => !aida[injectorName],
  );

  return { existingInjectorNames, missingInjectorNames };
}

function getOutputPath(defaultOutputDir, injectorOutputFilepath, injectorName) {
  return injectorOutputFilepath || `${defaultOutputDir}${injectorName}`;
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
