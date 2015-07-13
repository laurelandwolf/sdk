import {namespace} from './utils/testing';
import api from '../src/api';

let test = namespace('api');

let resources = ['Project', 'Designer', 'Room', 'Recipient'];

resources.forEach((resource) => {

  test(resource, ({equal}) => {

    let a = api();

    equal(typeof a[`get${resource}s`], 'function', `GET ${resource}s`);
    equal(typeof a[`get${resource}`], 'function', `GET ${resource}s/:id`);
    equal(typeof a[`create${resource}`], 'function', `POST ${resource}s`);
    equal(typeof a[`update${resource}`], 'function', `PATCH ${resource}s/:id`);
    equal(typeof a[`delete${resource}`], 'function', `DELETE ${resource}s/:id`);
  });
});
