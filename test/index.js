import {expect} from 'chai';
import {omit} from 'lodash';

import sdk from '../src';
import mockFetch from './mock/fetch';

import fetchMock from 'fetch-mock/client';

describe('sdk', () => {

  // let projects;
  // let payload;
  // let method;
  // let url;
  // let status;
  //
  // before(() => {
  //
  //   fetchMock.registerRoute([
  //     {
  //       name: 'projects',
  //       matcher: /\/projects.*/,
  //       response: (_url_, opts) => {
  //
  //         status = opts.status || 200;
  //         url = _url_;
  //         method = opts.method;
  //         payload = omit(opts, 'method');
  //         return {};
  //       }
  //     }
  //   ]);
  //
  //   fetchMock.mock({
  //     routes: ['projects']
  //   });
  // });
  //
  // after(() => fetchMock.restore());

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

          // TODO: the status needs to be returned here and
          // res.body should be the body of the response
          // expect(res.status).to.equal(200);
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
