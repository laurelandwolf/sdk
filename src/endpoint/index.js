import {defer} from 'lodash';

import request from '../request';
// import validate from '../validate';
import qshash from './qs-hash';
import qslist from './qs-list';

function endpoint ({uri, method}, apiConfig) {

  let req = request(apiConfig);
  let includes = qslist('include');
  let sort = qslist('sort');
  let fields = qshash();

  function renderEndpointUri () {

    let querystring = [];

    if (includes.count() > 0) {
      querystring.push(includes.stringify());
    }

    if (fields.count() > 0) {
      querystring.push(fields.stringify());
    }

    //
    if (sort.count() > 0) {
      querystring.push(sort.stringify());
    }

    // Ensure that nothing extra gets put in the uri
    if (querystring.length > 0) {
      uri += `?${querystring.join('&')}`;
    }

    return uri;
  }

  let promise = new Promise((resolve, reject) => {

    defer(() => {

      req.get(renderEndpointUri())
        .then(resolve)
        .catch(reject);
    });
  });

  promise.includes = (...args) => {

    includes.push(...args);
    return promise;
  };

  promise.fields = (newFields) => {

    fields.add(newFields);
    return promise;
  };

  promise.sort = (...args) => {

    sort.push(...args);
    return promise;
  };

  return promise;
}

export default endpoint;
