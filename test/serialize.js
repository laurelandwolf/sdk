import {expect} from 'chai';

import serialize from '../src/serialize';
import responseData from './mock/jsonapi-response';

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

    it('merges data relationships from included list', () => {

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
  });

  describe('request', () => {


  });
});
