import aida from './aida';
import routes from './injectors/routes';
import swagger from './injectors/swagger';
import routesMap from './injectors/routesMap';
import fakedDataRoutes from './injectors/fakedDataRoutes';
import fakedSchema from './injectors/fakedSchema';
import validate from './injectors/validation/validate';
import { outputToFile } from './utils/filesystem';

function main(args) {
  let location = './definitions';
  let outputDestination = './output';

  if (args && args.length >= 2) {
    location = args[0];
    outputDestination = args[1];
  }

  const config = {
    injectors: [
      routes,
      routesMap,
      fakedDataRoutes,
      fakedSchema,
      swagger,
      validate,
    ],
    definitions: {
      location,
      blacklistFiles: ['helpers.js'],
      blacklistDirectories: ['intermediate'],
    },
  };

  const aidaResults = aida(config);

  outputToFile(
    JSON.stringify(aidaResults.getSwaggerDocs('User')),
    `${outputDestination}/swagger.json`,
  );

  outputToFile(
    JSON.stringify(aidaResults.getFakedDataRoutes('User')),
    `${outputDestination}/routes.json`,
  );

  outputToFile(
    JSON.stringify(aidaResults.getRoutesMap('User'), null, 2),
    `${outputDestination}/endpoints.json`,
  );

  outputToFile(
    JSON.stringify(
      aidaResults.getFakedSchema({
        whitelist: ['Campaign'],
        itemsPerDefinition: 10,
      }),
    ),
    `${outputDestination}/schema.json`,
  );
}

main(process.argv.slice(2));
