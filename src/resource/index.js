import _, {defer, capitalize} from 'lodash';
import pluralize from 'pluralize';
import asArray from 'as-array';

import request from '../request';
import validate from '../validate';
import qshash from './qs-hash';
import qslist from './qs-list';

function resource (spec, config = {}) {

  let {name} = spec;
  let req = request(config);

  let methods = {

    // get all
    [`get${capitalize(pluralize(name))}`] () {

      let includes = qslist('include');
      let sort = qslist('sort');
      let fields = qshash();

      let resource = new Promise((resolve, reject) => {

        defer(() => {

          let querystring = [];

          if (includes.count() > 0) {
            querystring.push(includes.stringify());
          }

          if (fields.count() > 0) {
            querystring.push(fields.stringify());
          }

          //
          if (sort.count() > 0) {
            querystring.push(sort.stringify());
          }

          resolve(`?${querystring.join('&')}`);
        });
      });

      resource.includes = (...args) => {

        includes.push(...args);
        return resource;
      };

      resource.fields = (newFields) => {

        fields.add(newFields);
        return resource;
      };

      resource.sort = (...args) => {

        sort.push(...args);
        return resource;
      };

      return resource;
    },

    // get one
    [`get${capitalize(pluralize(name, 1))}`] () {

      console.log('get ', capitalize(pluralize(name, 1)));
    }
  };

  return methods;
}

export default resource;
