import {namespace} from './utils/testing';
import sdk, {serialize, format} from '../src';
import mockFetch from './mock/fetch';

let test = namespace('sdk');

test.beforeEach(() => mockFetch.mock());
test.afterEach(() => mockFetch.restore());

test('instance', ({equal}) => {

  let api = sdk();
  equal(typeof api, 'function', 'is a function');
});

test('request', ({equal}) => {

  let api = sdk();

  return api()
    .getProjects()
      .then((res) => {

        let req = mockFetch.request();

        equal(req.method, 'GET', 'GET requests');
        equal(res.status, 200, 'successful request');
      });
});

test('default headers', ({deepEqual}) => {

  let api = sdk();

  deepEqual(api().config.headers, {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
  }, 'configured headers');
});

test('custom headers', ({equal}) => {

  let api = sdk({
    headers: {
      custom: 'header'
    }
  });

  equal(api().config.headers.custom, 'header', 'custom header set');
});

test('sets origin', ({equal}) => {

  let api = sdk({
    origin: 'http://api.com'
  });

  equal(api().config.origin, 'http://api.com', 'origin set');
});

test('api overwrites global configs', ({equal}) => {

  let api = sdk({
    origin: 'http://global.com'
  });

  equal(api().config.origin, 'http://global.com', 'global origin');

  let overridenApiConfig = api({
    origin: 'http://overridden.com'
  }).config;

  equal(overridenApiConfig.origin, 'http://overridden.com', 'overridden origin');
});

test('exposes the serializer', ({equal}) => {

  equal(typeof serialize, 'object', 'is an object');
  equal(typeof serialize.response, 'function', 'response is a function');
  equal(typeof serialize.request, 'function', 'request is a function');
});

test('exposes the formatter', ({equal}) => {

  equal(typeof format, 'object', 'is an object');
  equal(typeof format.camelCase, 'function', 'camelCase is a function');
  equal(typeof format.snakeCase, 'function', 'snakeCase is a function');
});
