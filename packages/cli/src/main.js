import chalk from 'chalk';
import program from 'commander';
import inquirer from 'inquirer';
import * as aida from '@aida/core';
import {
  createConfigFile,
  outputToFile,
  pathExists,
  resolveFromCurrentDir,
  getOutputPath,
  getConfigFilePath,
  readConfig,
  watchModels,
} from './filesystem';
import initQuestions from './initQuestions';
import camelCase from 'lodash/camelCase';

const CONFIG_FILENAME = '.aidarc';

export default function main() {
  const args = [...process.argv];

  //Commander doesn't support a default command execution, so we just add the desired command manually.
  if (args.length === 2) {
    args.push('run');
  }

  program
    .version('0.0.3', '-v, --version')
    .option(
      '-S --models-dir <path>',
      'Set the directory for your models. It overrides the config file settings.',
    )
    .option(
      '-O --output-dir <path>',
      'Set the output directory. It overrides the config file settings.',
    );

  program
    .command('run')
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
    .command('watch')
    .description(
      'Watch for changes to the models and run the pipeline on models change.',
    )
    .action(() => {
      watch();
    });

  program.parse(args);
}

function run(options) {
  console.log(chalk.yellow(`Getting aida config...`));
  const cliConfig = getConfig(options);

  const modelsPath = resolveFromCurrentDir(cliConfig.modelsDir);
  const { existingInjectors, missingInjectorNames } = getInjectors(
    cliConfig.injectors.map(x => x.name),
  );

  checkMissingInjectors(missingInjectorNames);

  const aidaCoreConfig = {
    injectors: Object.values(existingInjectors),
    models: {
      location: modelsPath,
      blacklistFiles: [],
      blacklistDirectories: [],
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
        Object.keys(existingInjectors).join(', '),
      )}`,
    ),
  );

  let aidaResults;

  try {
    aidaResults = aida.run(aidaCoreConfig);
  } catch (err) {
    error(err.message, true);
  }

  cliConfig.injectors.forEach(injector => {
    outputInjectorResult(
      injector,
      aidaResults[camelCase(injector.name)].execute,
      cliConfig.outputDir,
    );
  });

  console.log(chalk.green(`Done!`));
}

function checkMissingInjectors(missingInjectorNames) {
  if (missingInjectorNames.length > 0) {
    const fullInjectorNames = missingInjectorNames
      .map(injectorName => {
        return `@aida/injector-${injectorName}@latest`;
      })
      .join(' ');

    const errorMessage = `Dependent injectors are missing from your local node_modules folder. Run ${chalk.green.bold(
      `npm i --save-dev ${fullInjectorNames}`,
    )} to install them.`;

    error(errorMessage, true);
  }
}

function outputInjectorResult(injector, injectorExecute, defaultOutputDir) {
  if (injector.outputType === 'file') {
    const outputPath = getOutputPath(
      defaultOutputDir,
      injector.outputFilepath,
      `${injector.name}.json`,
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
        `node_modules/@aida/injector-${injectorName}`,
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

  error(
    'A config file already exists. If you wish to reinitialize aida, please delete it first.',
    configPath,
  );

  inquirer
    .prompt(initQuestions)
    .then(answers => {
      createConfigFile(CONFIG_FILENAME, reformatInitAnswers(answers));
      console.log(chalk.green('Finished generating the config file.'));
    })
    .catch(err => {
      error(err.message, true);
    });
}

function watch() {
  const configData = getConfig();
  console.log(chalk.green('Aida started watching models.'));
  watchModels(configData.modelsDir, () => {
    console.log(chalk.yellow('Re-running Aida on changed models.'));
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
  error(
    'Could not find a aida config file. Please run "aida init" first.',
    !configPath,
  );

  const configData = readConfig(configPath);

  error(
    `The models directory is not specified in your config. Please specify where your models are stored and try again.`,
    !configData.modelsDir,
  );

  error(
    `There are no injectors specified. Please specify the injectors you wish to run and try again.`,
    !configData.injectors || configData.injectors.length === 0,
  );

  if (cmdOptions) {
    return {
      ...configData,
      modelsDir: cmdOptions.modelsDir || configData.modelsDir,
      outputDir: cmdOptions.outputDir || configData.outputDir,
    };
  }

  return configData;
}

function error(message, condition) {
  if (condition) {
    console.error(chalk.yellow(message));
    process.exit(0);
  }
}
