import endpoint from '../src/endpoint';
import mockFetch from './mock/fetch';
import {namespace} from './utils/testing';

let test = namespace('endpoint');

test.beforeEach(() => {

  mockFetch.mock({
    response: {
      status: 200,
      body: {
        data: {
          type: 'projects',
          id: 1,
          attributes: {
            name: 'test'
          },
          relationships: {
            author: {
              data: {
                type: 'people',
                id: 2
              }
            }
          }
        },
        included: [
          {
            type: 'people',
            id: 2,
            attributes: {
              name: 'person'
            }
          }
        ]
      }
    }
  });
});

test.afterEach(() => mockFetch.restore());

test('serializes response data', ({equal}) => {

  let resource = endpoint({
    uri: '/projects/1',
    method: 'GET'
  });

  return resource
    .then((res) => {

      equal(res.body.data.relationships.author.attributes.name, 'person', 'relationship attribute');

      // FIXME: this throws an error. Fix when serializing response
      // body.data.relationships.author.relationships;
    });
});

test('serializes response included', ({equal}) => {

  let resource = endpoint({
    uri: '/projects/1',
    method: 'GET'
  });

  return resource
    .then((res) => {

      equal(res.body.included.people[2].attributes.name, 'person', 'included attribute');
    });
});
