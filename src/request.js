import 'whatwg-fetch';
import {omit, merge, pick} from 'lodash';

function request (spec = {}) {

  let origin = spec.origin;
  let config = omit(spec, 'origin');

  function httpRequest (url, options) {

    return new Promise((resolve, reject) => {

      fetch(origin + url, merge(config, options))
        .then((response) => {

          response.json().then((body) => {

            if (response.status < 400) {
              resolve(body);
            }
            else {
              let responseObject = merge(pick(response, 'status', 'statusText'), {body});
              reject(responseObject);
            }
          });
        });
    });
  }

  function get (url, options) {

    return httpRequest(url, merge({
      method: 'GET'
    }, options));
  }

  function post (url, options) {

    return httpRequest(url, merge({
      method: 'POST'
    }, options));
  }

  function put () {
    return httpRequest(url, merge({
      method: 'PUT'
    }, options));
  }

  function patch () {

    return httpRequest(url, merge({
      method: 'PATCH'
    }, options));
  }

  function del () {

    return httpRequest(url, merge({
      method: 'DELETE'
    }, options));
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
