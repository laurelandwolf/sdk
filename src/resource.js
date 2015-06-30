import {capitalize} from 'lodash';
import pluralize from 'pluralize';

import endpoint from './endpoint';

function resource (spec, apiConfig = {}) {

  let {type} = spec;

  // Get All
  function getAll () {

    let uri = `/${type}`;

    return endpoint({
      uri,
      method: 'GET'
    }, apiConfig);
  }

  function getOne (id) {

    let uri = `/${type}/${id}`;

    return endpoint({
      uri,
      method: 'GET'
    }, apiConfig);
  }

  function create (attributes) {

    let uri = `/${type}`;

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

  return {
    [`get${capitalize(pluralize(type))}`]: getAll,
    [`get${capitalize(pluralize(type, 1))}`]: getOne,
    [`create${capitalize(pluralize(type, 1))}`]: create
  };
}


export default resource;
