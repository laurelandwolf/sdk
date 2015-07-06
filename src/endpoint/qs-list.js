import _, {isString, map} from 'lodash';

import {snakeCase} from '../format';

function qslist (name) {

  let list = [];

  function parseList (includes, ...args) {

    let newIncludes = _(args)
      .map((item) => {

        // i.e. rooms.inspirationLinks
        if (isString(item)) {
          return map(item.split('.'), snakeCase).join('.');
        }

        // i.e. - {rooms: ['inspirationLinks']}
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
