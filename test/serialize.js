import {expect} from 'chai';

import serialize from '../src/serialize';
import responseData from './mock/jsonapi-response';
import arrayResponseData from './mock/jsonapi-response-array';

describe('serialize', () => {

  describe('response', () => {

    let res;

    beforeEach(() => {

      res = serialize.response(responseData);
    })

    it('sets getter for main data relationships', () => {

      expect(res.data.relationships).to.exist;
    });

    it('sets getter for included resources', () => {

      expect(res.included).to.exist;
    });

    it('merges data relationships for a single resource from included list', () => {

      expect(res.data.relationships.designer.attributes.name).to.equal('Tester');
    });

    it('uses resource id as key when data is an array', () => {

      expect(res.data.relationships.someItem[123].attributes.name).to.equal('another');
      expect(res.data.relationships.someItem[2].attributes.name).to.equal('Tester');
    });

    it('maps included array to id-keyed object', () => {

      expect(res.included.people).to.exist;
      expect(res.included.people[123]).to.exist;
    });

    it('merges related included resources', () => {

      let name = res.included.list[4321].relationships.author.attributes.name;
      expect(name).to.equal('another');
    });

    it('uses resource id as key when included relationship data is an array', () => {

      let name = res.included.list[9876].relationships.author[123].attributes.name;
      expect(name).to.equal('another');
    });

    it('should assign relationships to a key by relationship name, not type name', () => {

      let resMultiple = serialize.response(arrayResponseData);
      expect(resMultiple.data[1].relationships.media[24]).to.not.equal(undefined);
    });
  });

  describe('request', () => {

    let req;

    beforeEach(() => {

      req = serialize.request(mockRequestInput());
    })

    it('includes includes expected keys', () => {

      expect(req).to.include.keys('id', 'type', 'attributes', 'relationships');
      expect(req.meh).to.not.exist;
    });

    it('converts to snake case', () => {

      expect(req.attributes).to.include.key('some-value');
    });

    it('formats single relationship', () => {

      expect(req.relationships.author).to.eql({
        data: {type: 'people', id: 123}
      });
    });

    it('formats relationship with multiple values', () => {

      expect(req.relationships.tags).to.eql({
        data: [
          {type: 'tags', id: 1},
          {type: 'tags', id: 2}
        ]
      });
    });

    it('formats shorthand single relationships', () => {

      expect(req.relationships.project).to.eql({
        data: {type: 'projects', id: 123}
      });
    });

    it('formats short with multiple relationships', () => {

      expect(req.relationships.friends).to.eql({
        data: [
          {type: 'friends', id: 1},
          {type: 'friends', id: 2},
          {type: 'friends', id: 3}
        ]
      });
    });
  });
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
