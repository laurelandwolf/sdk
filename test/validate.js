import validate from '../src/validate';
import {namespace} from './utils/testing';

let test = namespace('validate');

test('type', ({throws, equal}) => {

  equal(typeof validate.type, 'function', 'function exists');
  equal(validate.type('foo-bar'), undefined, 'should allow dash-case');
  equal(validate.type('foo1-2bar'), undefined, 'should allow numbers');
  throws(() => validate.type('fooBar'), TypeError, 'should not allow camelCase');
  throws(() => validate.type('foo_bar'), TypeError, 'should not allow underscores');
  throws(() => validate.type('foo bar'), TypeError, 'should not allow spaces');
  throws(() => validate.type(null), TypeError, 'should not allow null');
});
