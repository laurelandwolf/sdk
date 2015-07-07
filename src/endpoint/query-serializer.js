import {isString, isObject, isArray, all, map, keys} from 'lodash';

function querySerializer () {

  let list = [];

  function parseQueries (queries, ...newQueries) {

    let newQuery;
    if (all(newQueries, isString) && newQueries.length === 2) {
      newQuery = newQueries.join('=');
    }
    else if (isObject(...newQueries)) {
      newQuery = map(...newQueries, (value, key) => `${key}=${value}`).join('&');
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
