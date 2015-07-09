import format from '../src/format';
import {namespace} from './utils/testing';

let test = namespace('format');

test('String', ({equal}) => {

  equal(format.camelCase('kebab-case'), 'kebabCase', 'camel case');
  equal(format.snakeCase('oneTwo'), 'one-two', 'snake case');
});

test('Object', ({deepEqual}) => {

  let camelobj = format.camelCase({
    'one-two': 'three',
    'four-five': '6'
  });

  let snakeObj = format.snakeCase({
    'oneTwo': 'three',
    'fourFive': '6'
  });

  deepEqual(camelobj, {
    oneTwo: 'three',
    fourFive: '6'
  }, 'camel case');

  deepEqual(snakeObj, {
    'one-two': 'three',
    'four-five': '6'
  }, 'snake cased');
});

test('deep object', ({deepEqual}) => {

  let camelObj = format.camelCase({
    'one-two': 'three',
    'four-five': {
      'six-seven': [
        {
          'eight-nine': 'ten'
        },
        'eleven-twelve'
      ]
    }
  });

  let snakeObj = format.snakeCase({
    oneTwo: 'three',
    fourFive: {
      sixSeven: [
        {
          eightNine: 'ten'
        },
        'eleven-twelve'
      ],
    }
  });

  deepEqual(snakeObj, {
    'one-two': 'three',
    'four-five': {
      'six-seven': [
        {
          'eight-nine': 'ten'
        },
        'eleven-twelve'
      ]
    }
  }, 'snake case');

  deepEqual(camelObj, {
    oneTwo: 'three',
    fourFive: {
      sixSeven: [
        {
          eightNine: 'ten'
        },
        'eleven-twelve'
      ],
    }
  }, 'camel case');
});

test('object with "length" key', ({deepEqual}) => {

  var obj = {
    "room-type": "living-room",
    "budget": null,
    "length": 12.0
  };

  let cameledObject = format.camelCase(obj);

  deepEqual(cameledObject, {
    roomType: 'living-room',
    budget: null,
    length: 12.0
  }, 'camel cased object');
});

test('keeps the leading "-"', ({equal}) => {

  let cased = format.snakeCase('-createdAt');
  equal(cased, '-created-at', 'keeps "-"');
});
