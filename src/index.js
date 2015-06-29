// reference gist https://gist.github.com/scottcorgan/a581668485381b39dfd0

// TODO: import polyfill from Promise
import 'whatwg-fetch';

import {merge} from 'lodash';

import api from './api';

export default function sdk (globalSpec = {}) {

  let defaultSpec = {
    origin: '',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    }
  };
  let configuredSpec = merge(defaultSpec, globalSpec);

  return function (instanceSpec = {}) {

    return api(merge(configuredSpec, instanceSpec));
  };
}
