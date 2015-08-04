import {merge, cloneDeep} from 'lodash';
import {Promise} from 'es6-promise';

let originalFetch = window.fetch;
let _lastRequest_ = {};

function JSONPromise (data) {

  return function () {

    return new Promise(function (resolve, reject) {

      resolve(data);
    });
  };
}

function mockedFetch (_config_ = {}) {

  return function (url, options = {}) {

    let req = _config_.request || {};
    let res = _config_.response || {};
    let config = merge(options, _config_.request || {});

    _lastRequest_ = cloneDeep(merge(config, {url}));

    return new Promise(function (resolve, reject) {

      // Defaults to responding with the original config
      let body = res.body !== undefined ? res.body : config;
      let json = JSONPromise(body);
      let text;
      if (res.headers && res.headers.get && res.headers.get('content-type').indexOf('text/plain') !== -1) {
        json = undefined;
        text = JSONPromise(body);
      }

      let response = {
        status: res.status || 200,
        statusText: res.statusText,
        headers: res.headers,
        json,
        text
      };

      resolve(response);
    });
  };
}

function mock (config = {}) {

  _lastRequest_ = {};
  window.fetch = mockedFetch(config);
}

function restore() {

  _lastRequest_ = {};
  window.fetch = originalFetch;
}

function request () {

  return _lastRequest_;
}

export default {
  mock,
  restore,
  request,
}
