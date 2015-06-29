import {map, forEach, pick} from 'lodash';

import format from '../format';
import defineRelationships from './define-relationships';

function serializeRequest (camelData) {

  let picked = pick(camelData, 'type', 'id', 'attributs', 'relationships');
  let resource = format.snakeCase(picked);

  return resource;
}

function serializeResponse (originalResponse) {

  let response = format.camelCase(originalResponse);

  let data = {
    enumerable: true,
    get () {

      return Array.isArray(response.data)
        ? map(response.data, (resource) => defineRelationships(resource, response.included))
        : defineRelationships(response.data, response.included);
    }
  };

  let included = {
    enumerable: true,
    get () {

      let root = {};

      forEach(response.included, (resource) => {

        root[resource.type] = root[resource.type] || {};

        Object.defineProperty(root[resource.type], resource.id, {
          enumerable: true,
          get () {

            return defineRelationships(resource, response.included);
          }
        });
      });

      return root;
    }
  };

  return Object.create(null, {
    data,
    included
  });
}

export default {
  request: serializeRequest,
  response: serializeResponse
};






// TODO: remove this after dev
// import util from 'util';
// function inspect (data) {
//
//   console.log(util.inspect(data, {showHidden: false, depth: null}));
// }
