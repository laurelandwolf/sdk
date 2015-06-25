// aeference gist https://gist.github.com/scottcorgan/a581668485381b39dfd0

import {defaults, merge, cloneDeep, pick, omit} from 'lodash';

import Api from './api';

export function initApi (globalSpec = {}) {

  let defaultSpec = {
    origin: '',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    }
  };
  let configuredSpec = merge(defaultSpec, globalSpec);

  return function api (instanceSpec = {}) {

    return new Api(merge(configuredSpec, instanceSpec));
  };
}
