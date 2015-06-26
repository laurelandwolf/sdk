import 'babelify/polyfill';
import {defaults} from 'lodash';

export default function mockFetch (spec = {}) {

  let config = defaults({
    status: 200
  }, spec);

  return function fetch (url, options) {

    let status = 200;

    return new Promise((resolve, reject) => {

      resolve({
        status,
        json: () => {
          return new Promise((res, rej) => {

            res({
              url,
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
