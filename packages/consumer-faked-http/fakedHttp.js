import { Polly } from '@pollyjs/core';
import XHRAdapter from '@pollyjs/adapter-xhr';
import FetchAdapter from '@pollyjs/adapter-fetch';

import getDefinedRoute from './routeMatching';

Polly.register(XHRAdapter);
Polly.register(FetchAdapter);

export default function httpMockApi(routes, baseUri) {
  const polly = new Polly('Faked HTTP', {
    adapters: ['xhr', 'fetch'],
    recordIfMissing: false,
    mode: 'passthrough',
  });

  const { server } = polly;

  //Polly doesn't support intercept on .any(), so we have to run it on each method separately.
  const handler = (req, res, interceptor) =>
    handleIntercept(req, res, interceptor, routes, baseUri);

  server.get('*').intercept(handler);
  server.put('*').intercept(handler);
  server.post('*').intercept(handler);
  server.patch('*').intercept(handler);
  server.delete('*').intercept(handler);
  server.head('*').intercept(handler);
  server.options('*').intercept(handler);
}

function handleIntercept(req, res, interceptor, routes, baseUri) {
  const transformedReq = {
    method: req.method.toLowerCase(),
    url: req.identifiers.url,
    data: req.body,
  };

  const definedRoute = getDefinedRoute(transformedReq, routes, baseUri);
  if (!definedRoute) {
    return interceptor.passthrough();
  }

  const response = respondToRequest(transformedReq, definedRoute);
  res
    .status(response.status)
    .json(response.body)
    .setHeaders(response.headers);
}

function respondToRequest(requestConfig, definedRoute) {
  const { response } = definedRoute[requestConfig.method];
  const possibleResponses = Object.keys(response).filter(x => x !== 'default');

  if (possibleResponses.length > 0) {
    if (response['200']) {
      return {
        status: 200,
        body: response['200']['application/json'],
        headers: response['200'].headers,
      };
    }

    return {
      status: parseInt(possibleResponses[0], 10),
      body: response[possibleResponses[0]]['application/json'],
      headers: response[possibleResponses[0]].headers,
    };
  }

  return {
    status: 500,
    body: {},
    headers: {},
  };
}
