import {expect} from 'chai';
import {omit} from 'lodash';

import resource from '../src/resource';
import mockFetch from './mock/fetch';


describe('resource', () => {

  let projects;

  before(() => mockFetch.mock());
  after(() => mockFetch.restore());

  beforeEach(() => {

    projects = resource({
      type: 'projects'
    }, {
      headers: {
        custom: 'header'
      }
    });
  });

  it('excludes "?" if no query string', () => {

    return projects.getProjects()
      .then((res) => {

        let req = mockFetch.request();
        expect(req.url).to.equal('/projects');
      });
  });

  describe('get all', () => {

    it('no querystring', () => {

      return projects.getProjects()
        .then((res) => {

          let req = mockFetch.request();

          expect(req.url).to.equal('/projects');
          expect(req.method).to.equal('GET');
        });
    });

    it('sends global headers', () => {

      return projects.getProjects().then((res) => {

        let req = mockFetch.request();
        expect(req.headers).to.eql({
          custom: 'header'
        });
      });
    });

    it('with relationships', () => {

      return projects
        .getProjects()
        .include('rooms', 'friends', 'rooms.inspirationLinks')
        .include({another: ['thing', 'isHere']})
        .then((res) => {

          let req = mockFetch.request();
          expect(req.url).to.equal(
            '/projects?include=rooms,friends,rooms.inspiration-links,another.thing,another.is-here'
          );
        });
    });

    it('with sparse fieldsets', () => {

      return projects
        .getProjects()
        .fields({'rooms': ['title', 'location']})
        .fields({'rooms': ['test']})
        .fields({'test': ['one']}, {'test': ['two']})
        .then((res) => {

          let req = mockFetch.request();
          expect(req.url).to.equal(
            '/projects?fields[rooms]=title,location,test&fields[test]=one,two'
          );
        });
    });

    it('with sparse fieldsets from alternate formatting', () => {

      return projects
        .getProjects()
        .fields('rooms.inspiriationLinks', 'rooms.title')
        .then((res) => {

          let req = mockFetch.request();
          expect(req.url).to.equal(
            '/projects?fields[rooms]=inspiriation-links,title'
          );
        });
    });

    it('snakeCases sparse fieldsets', () => {

      return projects
        .getProjects()
        .fields('testField.testValue')
        .then((res) => {

          let req = mockFetch.request();
          expect(req.url).to.equal(
            '/projects?fields[test-field]=test-value'
          );
        });
    });

    it('with sort', () => {

      return projects
        .getProjects()
        .sort('-createdAt', 'updatedAt')
        .then((res) => {

          let req = mockFetch.request();
          expect(req.url).to.equal('/projects?sort=-created-at,updated-at');
        });
    });
  });

  describe('get one', () => {

    it('no querystring', () => {

      return projects
        .getProject(123)
        .then((res) => {

          let req = mockFetch.request();

          expect(req.url).to.equal('/projects/123');
          expect(req.method).to.equal('GET');
        });
    });

    it('sends global headers', () => {

      return projects.getProject(1).then((res) => {

        let req = mockFetch.request();
        expect(req.headers).to.eql({
          custom: 'header'
        });
      });
    });

    it('with relationships', () => {

      return projects
        .getProject(123)
        .include('rooms', 'friends')
        .then((res) => {

          let req = mockFetch.request();
          expect(req.url).to.equal('/projects/123?include=rooms,friends');
        });
    });

    it('with sparse fieldsets', () => {

      return projects
        .getProject(123)
        .fields({'rooms': ['title', 'location']})
        .then((res) => {

          let req = mockFetch.request();
          expect(req.url).to.equal('/projects/123?fields[rooms]=title,location');
        });
    });

    it('with sort', () => {

      return projects
        .getProject(123)
        .sort('-createdAt', 'updatedAt')
        .then((res) => {

          let req = mockFetch.request();
          expect(req.url).to.equal('/projects/123?sort=-created-at,updated-at');
        });
    });
  });

  describe('create', () => {

    it('uses POST method', () => {

      return projects.createProject({
        title: 'My Project',
        location: 'Room'
      })
        .then(() => {

          let req = mockFetch.request();
          expect(req.method).to.equal('POST');
        });
    });

    it('sends global headers', () => {

      return projects.createProject({}).then((res) => {

        let req = mockFetch.request();
        expect(req.headers).to.eql({
          custom: 'header'
        });
      });
    });

    it('new', () => {

      return projects.createProject({
        title: 'My Project',
        location: 'Room'
      })
        .then((res) => {

          let req = mockFetch.request();

          expect(req.body).to.eql(JSON.stringify({
            type: 'projects',
            attributes: {
              title: 'My Project',
              location: 'Room'
            }
          }));
        });
    });

    it('with relationships', () => {

      return projects
        .createProject({
          title: 'My Project'
        })
        .relatedTo({
          user: 123,
          something: {
            type: 'test',
            id: 456
          }
        })
          .then((res) => {

            let req = mockFetch.request();

            expect(req.body).to.eql(JSON.stringify({
              type: 'projects',
              attributes: {
                title: 'My Project'
              },
              relationships: {
                user: {
                  data: {
                    type: 'users',
                    id: 123
                  }
                },
                something: {
                  data: {
                    type: 'test',
                    id: 456
                  }
                }
              }
            }));
          });
    });
  });

  describe('updating', () => {

    it('uses PATCH method', () => {

      return projects.updateProject(1, {}).then((res) => {

        let req = mockFetch.request();
        expect(req.method).to.equal('PATCH');
      });
    });

    it('sends global headers', () => {

      return projects.updateProject(1, {}).then((res) => {

        let req = mockFetch.request();
        expect(req.headers).to.eql({
          custom: 'header'
        });
      });
    });

    it('updates', () => {

      return projects.updateProject(1, {
        name: 'test'
      })
        .then((res) => {

          let req = mockFetch.request();
          expect(req.body).to.eql(JSON.stringify({
            type: 'projects',
            id: 1,
            attributes: {
              name: 'test'
            }
          }));
        });
    });

    it('with relationships', () => {

      return projects
        .updateProject(1)
        .relatedTo({
          user: 2
        })
          .then(() => {

            let req = mockFetch.request();
            expect(req.body).to.eql(JSON.stringify({
              type: 'projects',
              id: 1,
              relationships: {
                user: {
                  data: {
                    type: 'users',
                    id: 2
                  }
                }
              }
            }));
          });
    });
  });

  describe('deleting', () => {

    it('uses DELETE method', () => {

      return projects.deleteProject(1)
        .then(() => {

          let req = mockFetch.request();
          expect(req.method).to.equal('DELETE');
        });
    });

    it('sends global headers', () => {

      return projects.deleteProject(1).then((res) => {

        let req = mockFetch.request();
        expect(req.headers).to.eql({
          custom: 'header'
        });
      });
    });

    it('deletes', () => {

      return projects.deleteProject(1)
        .then(() => {

          let req = mockFetch.request();
          expect(req.url).to.equal('/projects/1');
        });
    });
  });

  describe('queries', () => {
    it('encodes special characters for URIs', () => {

      return projects
        .getProject(123)
        .query('foo bar', 'baz%bat')
        .then(res => {

          let req = mockFetch.request();
          expect(req.url).to.equal('/projects/123?foo%20bar=baz%25bat');
        });
    });

    describe('with string arguments', () => {

      it('converts query arguments as strings into query string', () => {

        return projects
          .getProject(123)
          .query('foo', 'bar')
          .then((res) => {

            let req = mockFetch.request();
            expect(req.url).to.equal('/projects/123?foo=bar');
          });
      });

      it('combines query params with params from built-in functions', () => {

        return projects
          .getProject(123)
          .sort('-createdAt', 'updatedAt')
          .query('foo', 'bar')
          .then((res) => {

            let req = mockFetch.request();
            expect(req.url).to.equal('/projects/123?sort=-created-at,updated-at&foo=bar');
          });
      });
    });

    describe('with an object argument', () => {

      it('supports string values', () => {

        return projects
          .getProject(123)
          .query({foo: 'bar'})
          .then((res) => {

            let req = mockFetch.request();
            expect(req.url).to.equal('/projects/123?foo=bar');
          });
      });

      it('supports array values (unkeyed)', () => {

        return projects
          .getProject(123)
          .query({foo: ['bar', 'baz']})
          .then((res) => {

            let req = mockFetch.request();
            expect(req.url).to.equal('/projects/123?foo%5B%5D=bar&foo%5B%5D=baz');
          });
      });

      it('supports object values', () => {

        return projects
          .getProject(123)
          .query({foo: {bar: 'baz', bat: 'bing'}})
          .then((res) => {

            let req = mockFetch.request();
            expect(req.url).to.equal('/projects/123?foo%5Bbar%5D=baz&foo%5Bbat%5D=bing');
          });
      });

      it('supports object values with arrays as their values', () => {

        return projects
          .getProject(123)
          .query({foo: {bar: ['baz', 'bat']}})
          .then((res) => {

            let req = mockFetch.request();
            expect(req.url).to.equal('/projects/123?foo%5Bbar%5D%5B%5D=baz&foo%5Bbar%5D%5B%5D=bat');
          });
      });
    });
  });
});
