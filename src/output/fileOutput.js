import fs from 'fs';
import util from 'util';

const promiseWrite = util.promisify(fs.writeFile);

export default function outputToFile(content, path) {
  return promiseWrite(path, content);
}
