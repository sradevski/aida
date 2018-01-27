import fs from 'fs';
import util from 'util';
import path from 'path';

export function traverseFileSystem(pathToTraverse) {
  const fileslist = [];
  const resolvedPath = path.resolve(process.cwd(), pathToTraverse);

  function recursiveTraversal(currentPath) {
    const locations = fs.readdirSync(currentPath);
    locations.forEach(locationName => {
      const currentLocation = `${currentPath}/${locationName}`;
      const locationStats = fs.statSync(currentLocation);
      if (locationStats.isFile()) {
        fileslist.push({ location: currentLocation, filename: locationName });
      } else if (locationStats.isDirectory()) {
        recursiveTraversal(currentLocation);
      }
    });
  }

  recursiveTraversal(resolvedPath);
  return fileslist;
}

export function outputToFile(content, relativePath) {
  const absolutePath = path.resolve(relativePath);
  return fs.writeFileSync(absolutePath, content);
}
