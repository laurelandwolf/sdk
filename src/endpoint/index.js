import {defer, merge, isEmpty} from 'lodash';
import {Promise} from 'es6-promise';

import request from '../request';
// import validate from '../validate';
import qshash from './qs-hash';
import qslist from './qs-list';
import serialize from '../serialize';

function endpoint ({uri, method = 'GET', payload}, apiConfig) {

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

  // TODO: move this so it's only available
  // to the requests that need it
  let relationships = {};

  let promise = new Promise((resolve, reject) => {

    defer(() => {

      let requestUri = renderEndpointUri();

      // Get relationships in there!
      if (!isEmpty(relationships)) {
        payload = merge(payload || {}, {relationships});
      }

      // Serialize request
      if (!isEmpty(payload)) {
        payload = serialize.request(payload);
      }

      req[method.toLowerCase()](requestUri, payload)
        .then((body) => serialize.response(body))
        .then(resolve)
        .catch(reject);
    });
  });

  // Chainable methods for get requests
  if (method.toLowerCase() === 'get') {
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
  }

  // Chainable methods for post requests
  if (method.toLowerCase() === 'post' || method.toLowerCase() === 'patch') {
    promise.relatedTo = (rels) => {

      relationships = merge(relationships, rels);
      return promise;
    };
  }

  return promise;
}

export default endpoint;
