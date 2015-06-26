import _, {
  map,
  isObject as isObjectLoose,
  isString,
  camelCase as toCamelCase,
  kebabCase
} from 'lodash';

function isObject (data) {

  return isObjectLoose(data) && !Array.isArray(data);
}

function camelCaseKeys (obj) {

  if (isString(obj)) {
    return obj;
  }

  return _(obj)
    .map((value, key) => {

      let val = value;

      if (isObject(value)) {
        val = camelCaseKeys(value);
      }
      else if (Array.isArray(value)) {
        val = map(value, (v) => camelCaseKeys(v));
      }

      return [toCamelCase(key), val];
    })
    .zipObject()
    .value();
}

function snakeCaseKeys (obj) {

  if (isString(obj)) {
    return obj;
  }

  return _(obj)
    .map((value, key) => {

      let val = value;

      if (isObject(value)) {
        val = snakeCaseKeys(value);
      }
      else if (Array.isArray(value)) {
        val = map(value, (v) => snakeCaseKeys(v));
      }

      return [kebabCase(key), val];
    })
    .zipObject()
    .value();
}

function camelCase (data) {

  if (!data) {
    return data;
  }

  if (isString(data)) {
    return toCamelCase(data);
  }

  if (isObject(data)) {
    return camelCaseKeys(data);
  }
}

function snakeCase (data) {

  if (!data) {
    return data;
  }

  if (isString(data)) {
    return kebabCase(data);
  }

  if (isObject(data)) {
    return snakeCaseKeys(data);
  }
}

export default {
  camelCase,
  snakeCase
};
