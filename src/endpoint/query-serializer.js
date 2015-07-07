import _, {isString, isObject, isArray, all, map} from 'lodash';

function querySerializer () {

  let list = [];

  function parseQueries (queries, ...newQueries) {

    let newQuery;
    if (all(newQueries, isString) && newQueries.length === 2) {
      newQuery = newQueries.join('=');
    }
    else if (isObject(...newQueries)) {
      newQuery = _(...newQueries)
        .map((value, key) => {
          if (isArray(value)) {
            return map(value, val => `${key}[]=${val}`);
          }
          else if (isObject(value)) {
            return map(value, (val, k) => `${key}[${k}]=${val}`);
          }
          else {
            return `${key}=${value}`;
          }
        })
        .flatten()
        .values()
        .join('&');
    }

    return queries.concat(newQuery);
  }

  return {
    add (...queries) {

      list = parseQueries(list, ...queries);
    },

    stringify () {

      return list.join('&');
    },

    count () {

      return list.length;
    }
  };
}

export default querySerializer;
