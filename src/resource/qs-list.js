import _, {isString, map} from 'lodash';

function qslist (name) {

  let list = [];

  function parseList (includes, ...args) {

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

  return {
    push (...args) {

      list = parseList(list, ...args);
    },

    stringify () {

      return `${name}=${list.join(',')}`;
    },

    count () {

      return list.length;
    }
  };
}

export default qslist;
