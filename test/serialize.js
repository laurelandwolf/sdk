import serialize from '../src/serialize';
import responseData from './mock/jsonapi-response';
import arrayResponseData from './mock/jsonapi-response-array';
import circularRefsData from './mock/circular-refs.json';
import individualResponseSingleRelData from './mock/individual-response-single-rel';
import individualResponseMultiRelData from './mock/individual-response-multi-rel';
import {namespace} from './utils/testing';

let test = namespace('serialize');
test.response = test.namespace('response');
let res = serialize.response(responseData);
let req = serialize.request(mockRequestInput());

test.response('sets getter for main data relationships', ({ok}) => {

  ok(res.data.relationships, 'relationships exists');
});

test.response('sets getter for included resources', ({ok}) => {

  ok(res.included, 'included exists');
});

test.response('merges data relationships for a single resource from included list', ({equal}) => {

  equal(res.data.relationships.designer.attributes.name, 'Tester', 'name is equal');
});

test.response('uses resource id as key when data is an array', ({equal}) => {

  equal(res.data.relationships.someItem[123].attributes.name, 'another', '123 name');
  equal(res.data.relationships.someItem[2].attributes.name, 'Tester', '2 name');
});

test.response('maps included array to id-keyed object', ({ok}) => {

  ok(res.included.people, 'people exist');
  ok(res.included.people[123], 'person exists');
});

test.response('merges related included resources', ({equal}) => {

  let name = res.included.list[4321].relationships.author.attributes.name;
  equal(name, 'another', 'name');
});

test.response('merges realated incuded resources with circular relationships', ({pass, fail}) => {

  try {
    let circularRes = serialize.response(circularRefsData);
    pass('serialized circular response');
  }
  catch (e) {
    fail(e.message);
  }
});

test.response('ignores relationship merge if a single related resource does not exist', ({deepEqual}) => {

  let res = serialize.response(individualResponseSingleRelData);
  deepEqual(res.data.relationships.room, {
    type: 'rooms',
    id: '26098'
  }, 'relationship data');
});

test.response('ignores relationship merge if multiple related resource do not exist', ({deepEqual}) => {

  let res = serialize.response(individualResponseMultiRelData);
  deepEqual(res.data.relationships.room, {
    '123': {type: 'rooms', id: '123'},
    '456': {type: 'rooms', id: '456'}
  }, 'relationship data');
});

test.response('uses resource id as key when included relationship data is an array', ({equal}) => {

  let name = res.included.list[9876].relationships.author[123].attributes.name;
  equal(name, 'another', 'name');
});

test.response('should assign relationships to a key by relationship name, not type name', ({notEqual}) => {

  let resMultiple = serialize.response(arrayResponseData);
  notEqual(resMultiple.data[1].relationships.media[24], undefined, 'media exists');
});

test.response('should assign relationships to a key by relationship name, not type name', ({notEqual}) => {

  let resMultiple = serialize.response(arrayResponseData);
  notEqual(resMultiple.data[1].relationships.media[24], undefined, 'media exists');
});


//// Request

test.request = test.namespace('request');

test.request('includes expected keys', ({ok, notOk}) => {

  ok(req.id, 'id exists');
  ok(req.type, 'type exists');
  ok(req.attributes, 'attributes exists');
  ok(req.relationships, 'relationships exists');
  notOk(req.meh, 'meh does not exist');
});

test.request('converts to snake case', ({ok}) => {

  ok(req.attributes['some-value'], 'some-value exists');
});

test.request('formats single relationship', ({deepEqual}) => {

  deepEqual(req.relationships.author, {
    data: {type: 'people', id: 123}
  }, 'formatted single')
});

test.request('formats relationship with multiple values', ({deepEqual}) => {

  deepEqual(req.relationships.tags, {
    data: [
      {type: 'tags', id: 1},
      {type: 'tags', id: 2}
    ]
  }, 'formatted multiple')
});

test.request('formats shorthand single relationships', ({deepEqual}) => {

  deepEqual(req.relationships.project, {
    data: {type: 'projects', id: 123}
  }, 'formatted single');
});

test.request('formats short with multiple relationships', ({deepEqual}) => {

  deepEqual(req.relationships.friends, {
    data: [
      {type: 'friends', id: 1},
      {type: 'friends', id: 2},
      {type: 'friends', id: 3}
    ]
  }, 'fomatted multiple');
});

function mockRequestInput () {

  return {
    meh: 'meh',
    id: 123,
    type: 'comments',
    attributes: {
      name: 'Scott',
      someValue: 'value'
    },
    relationships: {
      author: {type: 'people', id: 123},
      tags: [
        {type: 'tags', id: 1},
        {type: 'tags', id: 2}
      ],
      project: 123,
      friends: [1, 2, 3]
    }
  };
}
