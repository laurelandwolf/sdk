import {map, forEach, pick} from 'lodash';

import format from '../format';
import defineRelationships from './define-relationships';
import formatRequestRelationships from './format-request-relationships';

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

function serializeRequest (input) {

  let picked = pick(input, 'type', 'id', 'attributes', 'relationships');
  let payload = {
    type: picked.type
  };

  if (picked.id) {
    payload.id = picked.id;
  }

  if (picked.attributes) {
    payload.attributes = picked.attributes;
  }

  if (picked.relationships) {
    payload.relationships = formatRequestRelationships(picked.relationships);
  }

  return format.snakeCase(payload);
}

export default {
  response: serializeResponse,
  request: serializeRequest
};
