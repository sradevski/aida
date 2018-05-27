import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';

function getCurrentDirectoryBase() {
  return path.normalize(process.cwd());
}

export function createSchemaFiles(options) {}

export function createConfigFile(configFilename, configData) {
  const currentDir = getCurrentDirectoryBase();
  fs.writeFileSync(
    `${currentDir}/${configFilename}`,
    JSON.stringify(configData, null, 2),
  );
}

export function readConfig(path) {
  return JSON.parse(fs.readFileSync(path));
}

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

export function getConfigFilePath(configFilename, shouldSearchRecursively) {
  let startDir = ['/', ...getCurrentDirectoryBase().split('/')];

  function walkBackwards(pathSegments) {
    if (pathSegments.length === 0) {
      return null;
    }

    const filePath = path.join(...pathSegments, configFilename);
    if (fileExists(filePath)) {
      return filePath;
    } else {
      return walkBackwards(pathSegments.slice(0, pathSegments.length - 1));
    }
  }

  if (shouldSearchRecursively) {
    return walkBackwards(startDir);
  } else {
    const filePath = path.join(...startDir, configFilename);
    if (fileExists(filePath)) {
      return filePath;
    } else {
      return null;
    }
  }
}

export function watchSchema(directory, callback) {
  const dotFileIgnore = /(^|[/\\])\../;
  chokidar
    .watch(directory, {
      ignored: dotFileIgnore,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 5000, //waiting a period without events occuring before emitting an event.
      },
    })
    .on('all', (event, path) => {
      callback(event, path);
    });
}