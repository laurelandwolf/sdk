import {forEach, find, some} from 'lodash';

function compileRelationships (resource, included, rules = []) {

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

        // Ignore nested relationships
        // i.e. - rooms have photos which are related to rooms
        if (shouldMergeResourceAttributes(rules, originalRels[relationshipName].data.type)) {
          mergedRelationships[relationshipName] = originalRels[relationshipName].data;
          return;
        }

        // data is an Array, meaning it's multiple items
        if (Array.isArray(originalRels[relationshipName].data)) {

          let props = {};

          forEach(originalRels[relationshipName].data, (item) => {

            props[item.id] = {
              enumerable: true,
              get () {

                return compileRelationships(
                  getRelatedResource(item, included),
                  included,
                  rules
                );
              }
            };
          });

          Object.defineProperties(mergedRelationships[relationshipName], props);
        }

        // data is an Object, meaning it's a single item
        else {

          mergedRelationships[relationshipName] = compileRelationships(
            getRelatedResource(originalRels[relationshipName].data, included),
            included,
            rules
          );
        }
      });

      return mergedRelationships;
    }
  });

  // This helps prevent exceeding maximum call stack
  resource.__merged__ = true;

  return resource;
}

function getRelatedResource (item, included) {

  let relatedResource;

  // Already merged, compiled object
  if(!Array.isArray(included)) {
    let relItems = included[item.type];
    if (!relItems) {
      return;
    }
    relatedResource = relItems[item.id];
  }

  // Raw
  else {
    relatedResource = find(included, {type: item.type, id: item.id})
  }

  return relatedResource
}

function shouldMergeResourceAttributes (rules, type) {

  return some(rules, (rule) => {

    if (Array.isArray(rule.ignoreRelationships) && rule.ignoreRelationships.indexOf(type) > -1) {
      return true;
    }
  });
}

export default compileRelationships;
