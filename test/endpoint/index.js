import {expect} from 'chai';
import {omit} from 'lodash';
import {Promise} from 'es6-promise';

import endpoint from '../../src/endpoint';
import mockFetch from '../mock/fetch';

describe('endpoint', () => {

  before(() => {

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

  after(() =>   mockFetch.restore());

  // TODO: add more test coverage

  it('serializes response data', () => {

    let resource = endpoint({
      uri: '/projects/1',
      method: 'GET'
    });

    return resource
      .then((res) => {

        expect(res.body.data.relationships.author.attributes.name).to.equal('person');

        // FIXME: this throws an error. Fix when serializing response
        // body.data.relationships.author.relationships;
      });
  });

  it('serializes response included', () => {

    let resource = endpoint({
      uri: '/projects/1',
      method: 'GET'
    });

    return resource
      .then((res) => {

        expect(res.body.included.people[2].attributes.name).to.equal('person');
      });
  });
});
