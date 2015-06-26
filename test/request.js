import {expect} from 'chai';

import request from '../src/request';
import mockFetch from './mock/fetch';

let ORIGIN = 'https://api.laurelandwolf.com/v1.0';

describe('request', () => {

  it('custom origin', () => {

    return request({
      origin: ORIGIN,
      mockFetch: mockFetch()
    }).get('/test')
      .then((res) => {

        expect(res.url).to.equal(ORIGIN + '/test');
      });
  });

  it('custom headers', () => {

    return request({
      headers: {
        custom : 'header'
      },
      mockFetch: mockFetch()
    }).get('/test')
      .then((res) => {

        expect(res.headers).to.eql({
          custom: 'header'
        });
      });
  });

  it('bare fetch', () => {

    return request({
      mockFetch: mockFetch()
    }).fetch('/test', {
      method: 'GET',
      headers: {
        custom : 'header'
      }
    })
      .then((res) => {

        expect(res.method).to.equal('GET');
        expect(res.headers).to.eql({
          custom: 'header'
        });
      });
  });

  describe('methods', () => {

    ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach((method) => {

      it(method, () => {

        let req = request({
          mockFetch: mockFetch()
        });

        return req[method.toLowerCase()]('/test')
          .then((res) => {

            expect(res.method).to.equal(method);
          });
      });
    });
  });
});
