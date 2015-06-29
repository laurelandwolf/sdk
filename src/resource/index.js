import _, {
  defer,
  capitalize,
  isString,
  map,
  union,
  forEach
} from 'lodash';
import pluralize from 'pluralize';
import asArray from 'as-array';

import request from '../request';
import validate from '../validate';

function resource (spec, config = {}) {

  let {name} = spec;
  let req = request(config);

  let methods = {

    // get all
    [`get${capitalize(pluralize(name))}`] () {

      let includes = [];
      let fields = {};

      let resource = new Promise((resolve, reject) => {

        defer(() => {

          // Build request here

          resolve(fields);
        });
      });

      resource.includes = (...args) => {

        includes = parseIncludes(includes, ...args);
        return resource;
      };

      resource.fields = (newFields) => {

        fields = parseFields(fields, newFields);
        return resource;
      };

      resource.sort = () => {

        return resource;
      };

      return resource;
    },

    // get one
    [`get${capitalize(pluralize(name, 1))}`] () {

      console.log('get ', capitalize(pluralize(name, 1)));
    }
  };

  return methods;
}

function parseIncludes (includes, ...args) {

  let newIncludes = _(args)
    .map((item) => {

      if (isString(item)) {
        return item;
      }

      return map(item, (vals, field) => {

        return map(vals, (val) => `${field}.${val}`)
      });
    })
    .flattenDeep()
    .value();

  return includes.concat(newIncludes);
}

function parseFields(fields, fieldsMap) {

  forEach(fieldsMap, (val, key) => {

    fields[key] = union(fields[key], asArray(fieldsMap[key]));
  });

  return fields;
}

export default resource;
