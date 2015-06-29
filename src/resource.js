import {capitalize} from 'lodash';
import pluralize from 'pluralize';

import endpoint from './endpoint';

function resource (spec, apiConfig = {}) {

  let {name} = spec;

  // Get All
  function getAll () {

    let uri = `/${name}`;

    return endpoint({
      uri,
      method: 'GET'
    }, apiConfig);
  }

  function getOne (id) {

    let uri = `/${name}/${id}`;

    return endpoint({
      uri,
      method: 'GET'
    }, apiConfig);
  }

  return {
    [`get${capitalize(pluralize(name))}`]: getAll,
    [`get${capitalize(pluralize(name, 1))}`]: getOne
  };
}


export default resource;
