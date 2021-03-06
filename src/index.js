// reference gist https://gist.github.com/scottcorgan/a581668485381b39dfd0

import 'whatwg-fetch';

import {merge} from 'lodash';

import api from './api';
import serialize from './serialize';
import format from './format';

function configGlobalSpec (globalSpec) {

  let headers
  if (typeof globalSpec.headers === 'function') {
    headers = globalSpec.headers()
  }
  else {
    headers = globalSpec.headers
  }

  return {
    ...globalSpec,
    headers
  }
}

export default function sdk (globalSpec = {}) {

  let defaultSpec = {
    origin: '',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    }
  };
  let configuredSpec = merge(defaultSpec, configGlobalSpec(globalSpec));

  function apiFactory (instanceSpec = {}) {

    return api(merge(configuredSpec, instanceSpec));
  }

  return apiFactory;
}

export {
  serialize,
  format
};
