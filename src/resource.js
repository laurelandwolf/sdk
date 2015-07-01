import {capitalize} from 'lodash';
import pluralize from 'pluralize';

import endpoint from './endpoint';

function resourceName (method, type, plural = false) {

  return `${method.toLowerCase()}${capitalize(pluralize(type, plural ? 2 : 1))}`;
}

function resource (spec, globalConfig = {}) {

  let {type} = spec;
  let uri = `/${type}`;

  // Get All
  function getAll () {

    return endpoint({
      uri,
      method: 'GET'
    }, globalConfig);
  }

  function getOne (id) {

    return endpoint({
      uri: `${uri}/${id}`,
      method: 'GET'
    }, globalConfig);
  }

  function create (attributes) {

    let payload = {
      type,
      attributes
    };

    return endpoint({
      uri,
      method: 'POST',
      payload
    }, globalConfig);
  }

  function update (id, attributes) {

    let payload = {
      type,
      id,
      attributes
    };

    return endpoint({
      uri: `${uri}/${id}`,
      method: 'PATCH',
      payload
    }, globalConfig);
  }

  function del (id) {

    return endpoint({
      uri: `${uri}/${id}`,
      method: 'DELETE'
    }, globalConfig);
  }

  return {
    [resourceName('get', type, true)]: getAll,
    [resourceName('get', type)]: getOne,
    [resourceName('create', type)]: create,
    [resourceName('update', type)]: update,
    [resourceName('delete', type)]: del
  };
}

export default resource;
