import { Polly } from '@pollyjs/core';
import XHRAdapter from '@pollyjs/adapter-xhr';
import FetchAdapter from '@pollyjs/adapter-fetch';

import getDefinedRoute from './routeMatching';
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

Polly.register(XHRAdapter);
Polly.register(FetchAdapter);

export default function httpMockApi(routes, baseUri, options = {}) {
  const polly = new Polly('Faked HTTP', {
    adapters: ['xhr', 'fetch'],
    recordIfMissing: false,
    mode: 'passthrough',
  });

  const { server } = polly;
  const normalizedBasedUri = baseUri.endsWith('/')
    ? baseUri.slice(0, -1)
    : baseUri;

  //Polly doesn't support intercept on .any(), so we have to run it on each method separately.
  const handler = (req, res, interceptor) =>
    handleIntercept(req, res, interceptor, routes, normalizedBasedUri, options);

  server.get(`${normalizedBasedUri}/*`).intercept(handler);
  server.put(`${normalizedBasedUri}/*`).intercept(handler);
  server.post(`${normalizedBasedUri}/*`).intercept(handler);
  server.patch(`${normalizedBasedUri}/*`).intercept(handler);
  server.delete(`${normalizedBasedUri}/*`).intercept(handler);
  server.head(`${normalizedBasedUri}/*`).intercept(handler);
  server.options(`${normalizedBasedUri}/*`).intercept(handler);
}

function handleIntercept(req, res, interceptor, routes, baseUri, options) {
  const transformedReq = {
    method: req.method.toLowerCase(),
    url: req.identifiers.url,
    data: req.body,
  };

  const definedRoute = getDefinedRoute(transformedReq, routes, baseUri);
  if (!definedRoute) {
    return interceptor.passthrough();
  }

  const responseData = getResponse(transformedReq, definedRoute);
  return respondToRequest(res, responseData, options);
}

function getResponse(requestConfig, definedRoute) {
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

async function respondToRequest(res, responseData, options) {
  await wait(options.timing || 0);

  res
    .status(responseData.status)
    .json(responseData.body)
    .setHeaders(responseData.headers);
}
