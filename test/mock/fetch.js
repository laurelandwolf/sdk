import 'babelify/polyfill';

import {defaults, pick} from 'lodash';

export default function mockFetch (spec = {}) {

  let config = defaults({
    status: 200
  }, spec);

  return function fetch (url, options) {

    let status = 200;
    let payload = pick(options, 'type', 'id', 'attributes', 'relationships');

    return new Promise((resolve, reject) => {

      resolve({
        status,
        json: () => {
          return new Promise((res, rej) => {

            res({
              url,
              payload,
              method: options.method,
              status: config.status,
              headers: options.headers
            });
          });
        }
      });
    });
  }
}
