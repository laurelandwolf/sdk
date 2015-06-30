import {omit, merge, pick} from 'lodash';
import {Promise} from 'es6-promise';

function request (spec = {}) {

  let origin = spec.origin || '';

  // Options that are used for every request
  let universalOptions = omit(spec, 'origin', 'fetch');

  function httpRequest (url, options) {

    let method = 'GET';

    return new Promise((resolve, reject) => {

      // Latest custom fetch options
      if (options) {
        universalOptions = merge(universalOptions, options);
      }

      fetch(origin + url, merge({method}, universalOptions))
        .then((response) => {
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
        });
    });
  }

  function get (url, payload = {}) {

    return httpRequest(url, {
      method: 'GET',
      body: JSON.stringify(payload)
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

  function del (url, payload = {}) {

    return httpRequest(url, {
      method: 'DELETE',
      body: JSON.stringify(payload)
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
