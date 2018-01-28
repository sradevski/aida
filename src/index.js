import validstack from './validstack';
import routes from './injectors/routes';
import swagger from './injectors/swagger';
import routesMap from './injectors/routesMap';
import { outputToFile } from './utils/filesystem';

function main(args) {
  let location = './src/definitions';
  let outputDestination = './output';

  if (args && args.length >= 2) {
    location = args[0];
    outputDestination = args[1];
  }

  const config = {
    injectors: [routes, routesMap, swagger],
    definitions: {
      location,
      blacklistFiles: ['helpers.js'],
      blacklistDirectories: ['intermediate'],
    },
  };

  const validstackResults = validstack(config);
  console.log(validstackResults);
  // outputToFile(
  //   JSON.stringify(validstackResults.getSwaggerDocs()),
  //   `${outputDestination}/swagger.json`,
  // );
  //
  // outputToFile(
  //   JSON.stringify(validstackResults.getRoutes()),
  //   `${outputDestination}/routes.json`,
  // );
  //
  // outputToFile(
  //   JSON.stringify(validstackResults.getRoutesMap()),
  //   `${outputDestination}/endpoints.json`,
  // );
}

main(process.argv.slice(2));
