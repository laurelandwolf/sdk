import {expect} from 'chai';
import {omit} from 'lodash'

import request from '../src/request';
import mockFetch from './mock/fetch';

let ORIGIN = 'https://api.laurelandwolf.com/v1.0';

describe('request', () => {

  before(() => {

    mockFetch.mock({
      response: {
        headers: {
          custom: 'header'
        }
      }
    });
  });
  after(() => mockFetch.restore());

  it('custom origin', () => {

    return request({
      origin: ORIGIN
    }).get('/test')
      .then((res) => {

        let req = mockFetch.request();
        expect(req.url).to.equal(ORIGIN + '/test');
      });
  });

  it('custom headers', () => {

    return request({
      headers: {
        custom : 'header'
      }
    }).get('/test')
      .then((res) => {

        let req = mockFetch.request();
        expect(req.headers).to.eql({
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

        let req = mockFetch.request();

        expect(req.method).to.equal('GET');
        expect(req.headers).to.eql({
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

            let req = mockFetch.request();
            expect(req.method).to.equal(method);
          });
      });
    });
  });

  describe('response properties', () => {

    it('status', () => {

        return request().get().then((res) => {

          expect(res.status).to.equal(200);
        });
    });

    it('headers', () => {

      return request().get().then((res) => {

        expect(res.headers).to.eql({
          custom: 'header'
        });
      });
    });
  });
});
