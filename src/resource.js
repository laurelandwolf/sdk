import {capitalize} from 'lodash';
import pluralize from 'pluralize';

import endpoint from './endpoint';

function resource (spec, apiConfig = {}) {

  let {type} = spec;
  let uri = `/${type}`;

  // Get All
  function getAll () {

    return endpoint({
      uri,
      method: 'GET'
    }, apiConfig);
  }

  function getOne (id) {

    return endpoint({
      uri: `${uri}/${id}`,
      method: 'GET'
    }, apiConfig);
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
    }, apiConfig);
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
    }, apiConfig);
  }

  function del (id) {

    return endpoint({
      uri: `${uri}/${id}`,
      method: 'DELETE'
    }, apiConfig);
  }

  return {
    [`get${capitalize(pluralize(type))}`]: getAll,
    [`get${capitalize(pluralize(type, 1))}`]: getOne,
    [`create${capitalize(pluralize(type, 1))}`]: create,
    [`update${capitalize(pluralize(type, 1))}`]: update,
    [`delete${capitalize(pluralize(type, 1))}`]: del
  };
}


export default resource;
