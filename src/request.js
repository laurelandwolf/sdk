import 'whatwg-fetch';
import {omit, merge, pick} from 'lodash';

class Request {

  constructor (spec = {}) {

    this.origin = spec.origin;
    this.spec = omit(spec, 'origin');
  }

  fetch (url, options) {

    return new Promise((resolve, reject) => {

      fetch(this.origin + url, merge(this.spec, options))
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

  get (url, options) {

    return this.fetch(url, merge({
      method: 'GET'
    }, options));
  }

  post (url, options) {

    return this.fetch(url, merge({
      method: 'POST'
    }, options));
  }

  put () {
    return this.fetch(url, merge({
      method: 'PUT'
    }, options));
  }

  patch () {
    return this.fetch(url, merge({
      method: 'PATCH'
    }, options));
  }

  delete () {

    return this.fetch(url, merge({
      method: 'DELETE'
    }, options));
  }
}


export default Request;
