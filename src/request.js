import {omit, merge, pick} from 'lodash';
import {Promise} from 'es6-promise';
import joinPath from 'join-path';

function request (spec = {}) {

  let origin = spec.origin || '';
  let defaultMethod = 'GET';

  // Options that are used for every request
  let fetchConfig = omit(spec, 'origin', 'fetch');

  function httpRequest (url, options) {

    return new Promise((resolve, reject) => {

      // Latest custom fetch options
      if (options) {
        fetchConfig = merge(fetchConfig, options);
      }

      fetchConfig = merge({method: defaultMethod}, fetchConfig);

      fetch(joinPath(origin, url), fetchConfig)
        .then((response) => {

          // NOTE: there is no body on a 204 response,
          //       so there will be nothing to parse

          if (response.status === 204) {
            resolve({
              status: response.status,
              headers: response.headers
            });
          }
          else {
            response.json().then((body) => {

              if (response.status < 400) {
                resolve({
                  status: response.status,
                  headers: response.headers,
                  body
                });
              }
              else {
                let responseObject = merge(pick(response, 'status', 'statusText'), {body});
                reject(responseObject);
              }
            });
          }

        });
    });
  }

  function get (url) {

    return httpRequest(url, {
      method: 'GET'
    });
  }

  function post (url, payload = {}) {

    return httpRequest(url, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  function put (url, payload = {}) {

    return httpRequest(url, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  function patch (url, payload = {}) {

    return httpRequest(url, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }

  function del (url) {

    return httpRequest(url, {
      method: 'DELETE'
    });
  }

  return {
    fetch: httpRequest,
    get,
    post,
    put,
    patch,
    'delete': del
  };
}

export default request;
