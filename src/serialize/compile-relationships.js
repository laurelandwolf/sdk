import {forEach, find, some} from 'lodash';

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
    relatedResource = find(included, {type: item.type, id: item.id});
  }

  return relatedResource;
}

function shouldMergeResourceAttributes (rules, type) {

  return some(rules, (rule) => {

    if (Array.isArray(rule.ignoreRelationships) && rule.ignoreRelationships.indexOf(type) > -1) {
      return true;
    }
  });
}

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

      if (!originalRels) {
        return {};
      }

      forEach(Object.keys(originalRels), (relationshipName) => {

        let originalRelData = originalRels[relationshipName].data;

        // Get/create reference to object tracking our merged relationships
        mergedRelationships[relationshipName] = mergedRelationships[relationshipName] || {};

        // Catches edge case where data is null or undefined
        if (!originalRelData) {
          return originalRelData;
        }

        // Ignore nested relationships
        // i.e. - rooms have photos which are related to rooms
        if (shouldMergeResourceAttributes(rules, originalRelData.type)) {
          mergedRelationships[relationshipName] = originalRelData;
          return;
        }

        // data is an Array, meaning it's multiple items
        if (Array.isArray(originalRelData)) {

          let props = {};

          forEach(originalRelData, (item) => {

            props[item.id] = {
              enumerable: true,
              get () {

                let compiledRelationship = compileRelationships(
                  getRelatedResource(item, included),
                  included,
                  rules
                );

                return compiledRelationship || item;
              }
            };
          });

          Object.defineProperties(mergedRelationships[relationshipName], props);
        }

        // data is an Object, meaning it's a single item
        else {

          let compiledRelationship = compileRelationships(
            getRelatedResource(originalRelData, included),
            included,
            rules
          );

          // Ensure there is always data on the relationship
          mergedRelationships[relationshipName] = compiledRelationship
            ? compiledRelationship
            : originalRelData;
        }
      });

      return mergedRelationships;
    }
  });

  // This helps prevent exceeding maximum call stack
  resource.__merged__ = true;

  return resource;
}

export default compileRelationships;
