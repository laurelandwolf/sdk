import {forEach, find} from 'lodash';

function defineRelationships (resource, included) {

  // Avoid undefined and maximum callstack errors
  if (!resource || resource.__merged__) {
    return resource;
  }

  let originalRels = resource.relationships;

  Object.defineProperty(resource, 'relationships', {
    enumerable: true,
    get () {

      let mergedRelationships = {};

      forEach(Object.keys(originalRels), (type) => {

        // Get/create reference to object tracking our merged relationships
        mergedRelationships[type] = mergedRelationships[type] || {};

        // Catches edge case where data is null or undefined
        if (!originalRels[type].data) {
          return originalRels[type].data;
        }

        // data is an Array, meaning it's multiple items
        if (Array.isArray(originalRels[type].data)) {

          let props = {};

          forEach(originalRels[type].data, (item) => {

            let relatedResource = find(included, {type: item.type, id: item.id});

            props[item.id] = {
              enumerable: true,
              get () {

                return defineRelationships(relatedResource, included);
              }
            };
          });

          Object.defineProperties(mergedRelationships[type], props);
        }

        // data is an Object, meaning it's a single item
        else {

          let item = originalRels[type].data;
          let relatedResource = find(included, {type: item.type, id: item.id});

          mergedRelationships[type] = defineRelationships(relatedResource, included);
        }
      });

      return mergedRelationships;
    }
  });

  // This helps prevent exceeding maximum call stack
  resource.__merged__ = true;

  return resource;
}

export default defineRelationships;
