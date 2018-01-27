import validstack from './validstack';
import axiosMockApi from './injectors/axiosMockApi';
import swagger from './injectors/swagger';
import routesList from './injectors/routesList';
import { outputToFile } from './utils/filesystem';

function main(args) {
  const config = {
    injectors: [axiosMockApi, swagger, routesList],
    definitions: {
      location: args[0],
      blacklist: ['helpers.js'],
    },
  };

  const validstackResults = validstack(config);

  outputToFile(
    JSON.stringify(validstackResults.getSwaggerDocs()),
    `${args[1]}/swagger.json`,
  );

  outputToFile(
    JSON.stringify(validstackResults.getRoutesList()),
    `${args[1]}/endpoints.json`,
  );
}

main(process.argv.slice(2));
