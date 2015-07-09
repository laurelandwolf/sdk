import tape from 'prova';
import {merge, isFunction} from 'lodash';
import isPromise from 'is-promise';

// TODO: pull out into tessed module

function namespace (name, setup = {}) {

  let beforeEach = setup.beforeEach || [];
  let afterEach = setup.afterEach || [];

  let tester = function (name2, fn) {

    return tape(name + ' -> ' + name2, (t) => {

      let end = t.end.bind(t);

      // Call all beforeEach fns and set return as context
      // to pass to test methods
      t.context = merge(...beforeEach.map(be => be()));
      t.end = () => {

        afterEach.forEach((ae) => ae({context: t.context}));
        end();
      };

      //
      let ret = fn(t);

      // Promise
      if (isPromise(ret)) {
        ret.then(() => end());
      }
      // Thunk
      else if (isFunction(ret)) {
        ret({end});
      }
      // Call end of synchronous tests automatically
      else {
        end();
      }
    });
  }

  tester.beforeEach = (fn) => {
    beforeEach.push(fn);
  };

  tester.afterEach = (fn) => {
    afterEach.push(fn);
  };

  tester.namespace = (name2) => {

    return namespace(name + ' -> ' + name2, {
      beforeEach,
      afterEach,
    });
  };

  return tester;
}

export default {
  namespace,
  test: tape
};
