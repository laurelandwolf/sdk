import {expect} from 'chai';
import {omit} from 'lodash'

import request from '../src/request';

import fetchMock from 'fetch-mock/client';

let ORIGIN = 'https://api.laurelandwolf.com/v1.0';

describe('request', () => {

  let projects;
  let payload;
  let method;
  let url;
  let status;
  let headers;

  before(() => {

    fetchMock.registerRoute([
      {
        name: 'test',
        matcher: /\/test/,
        response: (_url_, opts) => {

          status = opts.status || 200;
          headers = opts.headers;
          url = _url_;
          method = opts.method;
          payload = omit(opts, 'method');
          return {};
        }
      }
    ]);

    fetchMock.mock({
      routes: ['test']
    });
  });

  after(() => fetchMock.restore());

  it('custom origin', () => {

    return request({
      origin: ORIGIN
    }).get('/test')
      .then((res) => {

        expect(url).to.equal(ORIGIN + '/test');
      });
  });

  it('custom headers', () => {

    return request({
      headers: {
        custom : 'header'
      }
    }).get('/test')
      .then((res) => {

        expect(headers).to.eql({
          custom: 'header'
        });
      });
  });

  it('bare fetch', () => {

    return request().fetch('/test', {
      method: 'GET',
      headers: {
        custom : 'header'
      }
    })
      .then((res) => {

        expect(method).to.equal('GET');
        expect(headers).to.eql({
          custom: 'header'
        });
      });
  });

  describe('methods', () => {

    ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach((method) => {

      it(method, () => {

        let req = request();

        return req[method.toLowerCase()]('/test')
          .then((res) => {

            expect(method).to.equal(method);
          });
      });
    });
  });
});
