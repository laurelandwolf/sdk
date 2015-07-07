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

      forEach(Object.keys(originalRels), (relationshipName) => {

        // Get/create reference to object tracking our merged relationships
        mergedRelationships[relationshipName] = mergedRelationships[relationshipName] || {};

        // Catches edge case where data is null or undefined
        if (!originalRels[relationshipName].data) {
          return originalRels[relationshipName].data;
        }

        // data is an Array, meaning it's multiple items
        if (Array.isArray(originalRels[relationshipName].data)) {

          let props = {};

          forEach(originalRels[relationshipName].data, (item) => {

            let relatedResource = find(included, {type: item.type, id: item.id});

            props[item.id] = {
              enumerable: true,
              get () {

                return defineRelationships(relatedResource, included);
              }
            };
          });

          Object.defineProperties(mergedRelationships[relationshipName], props);
        }

        // data is an Object, meaning it's a single item
        else {

          let item = originalRels[relationshipName].data;
          let relatedResource = find(included, {type: item.type, id: item.id});

          mergedRelationships[relationshipName] = defineRelationships(relatedResource, included);
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
