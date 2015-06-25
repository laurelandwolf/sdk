import {isEmpty, isObject} from 'lodash';

function attributes (obj) {

  let isValid = obj && isObject(obj) && !isEmpty(obj);

  if (!isValid) {
    throw new TypeError('Invalid attributes');
  }
}

export default {
  attributes
}
