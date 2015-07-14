import {namespace} from './utils/testing';
import api from '../src/api';
import {capitalize} from 'lodash';
import pluralize from 'pluralize';
import mockFetch from './mock/fetch';
import r from '../src/resource';

let test = namespace('api');

let resources = [
  'projects',
  'designers',
  'rooms',
];

let singletonResources = [
  'recipient',
  'card',
  'bankAccount'
];

test('setup', () => mockFetch.mock());

resources.forEach((resource) => {

  let endpointName = capitalize(resource);

  test(resource, ({equal}) => {

    let a = api();

    equal(typeof a[`get${endpointName}`], 'function', `GET ${resource}`);
    equal(typeof a[`get${pluralize(endpointName, 1)}`], 'function', `GET ${resource}/:id`);
    equal(typeof a[`create${pluralize(endpointName, 1)}`], 'function', `POST ${resource}`);
    equal(typeof a[`update${pluralize(endpointName, 1)}`], 'function', `PATCH ${resource}/:id`);
    equal(typeof a[`delete${pluralize(endpointName, 1)}`], 'function', `DELETE ${resource}/:id`);
  });
});

singletonResources.forEach((resource) => {

  let endpointName = capitalize(resource);

  test(resource, ({equal}) => {

    let a = api();

    equal(typeof a[`get${endpointName}`], 'function', `GET ${resource}`);
    equal(typeof a[`create${endpointName}`], 'function', `POST ${resource}`);
    equal(typeof a[`update${endpointName}`], 'function', `PATCH ${resource}`);
    equal(typeof a[`delete${endpointName}`], 'function', `DELETE ${resource}`);
  })
});

test('multi-string resource names', ({equal}) => {

  let bankAccount = r({
    type: 'bankAccount',
    singleton: true
  });

  return bankAccount.getBankAccount()
    .then((res) => {
      let req = mockFetch.request();

      equal(req.url, '/bank-account', 'url');
    });
});

test('teardown', () => mockFetch.mock());
