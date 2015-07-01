import {expect} from 'chai';
import {omit} from 'lodash';

import sdk from '../src';
import mockFetch from './mock/fetch';

describe('sdk', () => {

  before(() => mockFetch.mock());
  after(() => mockFetch.restore());

  it('instance', () => {

    let api = sdk();
    expect(api).to.be.a('function');
  });

  it('request', () => {

    let api = sdk();

    return api()
      .getProjects()
        .then((res) => {

          let req = mockFetch.request();

          expect(req.method).to.equal('GET');
          expect(res.status).to.equal(200);
        });
  });

  it('default headers', () => {

    let api = sdk();

    expect(api().config.headers).to.eql({
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    });
  });

  it('custom headers', () => {

    let api = sdk({
      headers: {
        custom: 'header'
      }
    });

    expect(api().config.headers).to.contain({
      custom: 'header'
    });
  });

  it('sets origin', () => {

    let api = sdk({
      origin: 'http://api.com'
    });

    expect(api().config.origin).to.equal('http://api.com');
  });

  it('api overwrites global configs', () => {

    let api = sdk({
      origin: 'http://global.com'
    });

    expect(api().config.origin).to.equal('http://global.com');

    let overridenApiConfig = api({
      origin: 'http://overridden.com'
    }).config;

    expect(overridenApiConfig.origin).to.equal('http://overridden.com');
  });
});
