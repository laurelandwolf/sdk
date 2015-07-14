import {capitalize, defaults} from 'lodash';
import pluralize from 'pluralize';

import endpoint from './endpoint';

function resourceName (method, type, plural = false) {

  return `${method.toLowerCase()}${capitalize(pluralize(type, plural ? 2 : 1))}`;
}

function resource (spec, globalConfig = {}) {

  let {type, singleton} = defaults(spec, {singleton: false});

  function uri (id) {

    let u = `/${type}`;
    if (!singleton && id !== undefined) {
      u += `/${id}`;
    }

    return u;
  }

  // Get All
  function getAll () {

    return endpoint({
      uri: uri(),
      method: 'GET'
    }, globalConfig);
  }

  function getOne (id) {

    return endpoint({
      uri: uri(id),
      method: 'GET'
    }, globalConfig);
  }

  function create (attributes) {

    let payload = {
      type,
      attributes
    };

    return endpoint({
      uri: uri(),
      method: 'POST',
      payload
    }, globalConfig);
  }

  function update (id, attributes) {

    if (typeof id === 'object') {
      attributes = id;
      id = null;
    }

    let payload = {
      type,
      id,
      attributes
    };

    return endpoint({
      uri: uri(id),
      method: 'PATCH',
      payload
    }, globalConfig);
  }

  function del (id) {

    return endpoint({
      uri: uri(id),
      method: 'DELETE'
    }, globalConfig);
  }

  let routes = {
    [resourceName('get', type)]: getOne,
    [resourceName('create', type)]: create,
    [resourceName('update', type)]: update,
    [resourceName('delete', type)]: del
  };

  if (!singleton) {
    routes[resourceName('get', type, true)] = getAll;
  }

  return routes;
}

export default resource;
