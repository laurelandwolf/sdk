import _, {isString, map} from 'lodash';

import {snakeCase} from '../format';

function qslist (name) {

  let list = [];

  function parseList (includes, ...args) {

    let newIncludes = _(args)
      .map((item) => {

        if (isString(item)) {
          return snakeCase(item);
        }

        return map(item, (vals, field) => {

          return map(vals, (val) => `${snakeCase(field)}.${snakeCase(val)}`);
        });
      })
      .flattenDeep()
      .value();

    return includes.concat(newIncludes);
  }

  return {
    push (...args) {

      list = parseList(list, ...args);
    },

    stringify () {

      return `${snakeCase(name)}=${list.join(',')}`;
    },

    count () {

      return list.length;
    }
  };
}

export default qslist;
