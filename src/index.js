import validstack from './validstack';
import routes from './injectors/routes';
import swagger from './injectors/swagger';
import routesMap from './injectors/routesMap';
import fakedDataRoutes from './injectors/fakedDataRoutes';
import validate from './injectors/validation/validate';
import { outputToFile } from './utils/filesystem';

function main(args) {
  let location = './src/definitions';
  let outputDestination = './output';

  if (args && args.length >= 2) {
    location = args[0];
    outputDestination = args[1];
  }

  const config = {
    injectors: [routes, routesMap, fakedDataRoutes, swagger, validate],
    definitions: {
      location,
      blacklistFiles: ['helpers.js'],
      blacklistDirectories: ['intermediate'],
    },
  };

  const validstackResults = validstack(config);

  outputToFile(
    JSON.stringify(validstackResults.getSwaggerDocs('User')),
    `${outputDestination}/swagger.json`,
  );

  outputToFile(
    JSON.stringify(validstackResults.getFakedDataRoutes('User')),
    `${outputDestination}/routes.json`,
  );

  outputToFile(
    JSON.stringify(validstackResults.getRoutesMap('User'), null, 2),
    `${outputDestination}/endpoints.json`,
  );
}

main(process.argv.slice(2));
