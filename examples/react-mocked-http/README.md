# React Mocked HTTP

A barebones **create-react-app** application, with a Bookings screen. This example is used to demonstrate how we can easily mock our API if it is defined with Aida.

The models used in the example are located in **aida/examples/models** folder (as specified in the **.aidarc** config file). We are using a simple `Booking` model with 2 endpoints.

### Running the Example

In order to run the example, first run `npm install`. You can then run `npm start` to run the example application. Since the auto-generated code (**endpoints.json** and **routesMap.json**) are committed in the repo, you can start playing around with the example right away. If you want to make changes to the model, you can run `npm run aida` to recreate the **endpoints.json** and **routesMap.json** files.

Most of the magic (and it is not a lot) happens in **config.js**. In development environment we want to mock all defined requests, so we simply call the **fakedHttp** consumer. We also set the `baseUrl` which is used to get routes by `operationId` (defined in the **Booking.endpoints.js** file, also present in OpenAPI/Swagger 3.0 documentation), with optionally replacing path parameters with actual values. 

All the application logic is located in **App.js**, and as you can see, there isn't anything special going on in there (except for the `getRoute` function). This means we don't need to make any changes to the code, regardless of the environment and changing URLs.
