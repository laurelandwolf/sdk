import {forEach, union, map} from 'lodash';
import asArray from 'as-array';

function qshash () {

  let list = {};

  function parseFields(fields, fieldsMap) {

    forEach(fieldsMap, (val, key) => {

      fields[key] = union(fields[key], asArray(fieldsMap[key]));
    });

    return fields;
  }

  return {
    add (newFields) {

      list = parseFields(list, newFields);
    },

    stringify () {

      return map(list, (values, scope) => {

        return `fields[${scope}]=${values.join(',')}`
      }).join('&');
    },

    count () {

      return Object.keys(list).length;
    }
  };
}

export default qshash;
