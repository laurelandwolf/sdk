import {namespace} from './utils/testing';
import api from '../src/api';
import {capitalize} from 'lodash';
import pluralize from 'pluralize';

let test = namespace('api');

let resources = [
  'projects',
  'designers',
  'rooms',
  'recipients'
];

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
