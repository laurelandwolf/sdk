import {isObject} from 'lodash';

function attributes (obj) {

  let isValid = obj && isObject(obj);

  if (!isValid) {
    throw new TypeError('Invalid attributes');
  }
}

export default {
  attributes
};
