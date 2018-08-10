import fs from 'fs';

export function traverseFileSystem(pathToTraverse) {
  const fileslist = [];
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

  recursiveTraversal(pathToTraverse);
  return fileslist;
}
