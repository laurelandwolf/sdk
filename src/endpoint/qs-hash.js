import _, {isString, forEach, union, map} from 'lodash';
import asArray from 'as-array';

import {snakeCase} from '../format';

function qshash () {

  let list = {};

  function parseFields (fields, ...newFields) {

    _(newFields)
      .map((field) => {

        // Convert to formatted object
        if (isString(field)) {
          let [rel, name] = field.split('.');
          field = {
            [snakeCase(rel)]: snakeCase(name)
          };
        }

        return field;
      })
      .forEach((fieldsMap) => {

        forEach(fieldsMap, (val, key) => {

          let name = snakeCase(key);
          let values = map(asArray(val), snakeCase);

          fields[name] = union(fields[name], values);
        });
      })
      .value();

    return fields;
  }

  return {
    add (...newFields) {

      list = parseFields(list, ...newFields);
    },

    stringify () {

      return map(list, (values, scope) => {

        return `fields[${scope}]=${values.join(',')}`;
      }).join('&');
    },

    count () {

      return Object.keys(list).length;
    }
  };
}

export default qshash;
