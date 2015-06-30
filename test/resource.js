import {expect} from 'chai';
import {omit} from 'lodash';

import resource from '../src/resource';

import fetchMock from 'fetch-mock/client';

describe('resource', () => {

  let projects;
  let payload;
  let method;
  let url;

  before(() => {

    fetchMock.registerRoute([
      {
        name: 'projects',
        matcher: /\/projects.*/,
        response: (_url_, opts) => {

          url = _url_;
          method = opts.method;
          payload = omit(opts, 'method');

          // Response body
          return {};
        }
      }
    ]);

    fetchMock.mock({
      routes: ['projects']
    });
  });

  after(() => fetchMock.restore());

  beforeEach(() => {

    projects = resource({
      type: 'projects'
    });
  });

  afterEach(() => {

    projects = undefined;
    payload = undefined;
    method = undefined;
    url = undefined;
  });

  it('excludes "?" if no query string', () => {

    return projects.getProjects()
      .then((res) => {

        expect(url).to.equal('/projects');
      });
  });

  describe('get all', () => {

    it('no querystring', () => {

      return projects.getProjects()
        .then((res) => {

          expect(url).to.equal('/projects');
          expect(method).to.equal('GET');
        });
    });

    it('with relationships', () => {

      return projects
        .getProjects()
        .includes('rooms', 'friends')
        .then((res) => {

          expect(url).to.equal('/projects?include=rooms,friends');
        });
    });

    it('with sparse fieldsets', () => {

      return projects
        .getProjects()
        .fields({'rooms': ['title', 'location']})
        .then((res) => {

          expect(url).to.equal('/projects?fields[rooms]=title,location');
        });
    });

    it('with sort', () => {

      return projects
        .getProjects()
        .sort('-createdAt', 'updatedAt')
        .then((res) => {

          expect(url).to.equal('/projects?sort=-created-at,updated-at');
        });
    });

    it('serializes response');
  });

  describe('get one', () => {

    it('no querystring', () => {

      return projects
        .getProject(123)
        .then((res) => {

          expect(url).to.equal('/projects/123');
          expect(method).to.equal('GET');
        });
    });

    it('with relationships', () => {

      return projects
        .getProject(123)
        .includes('rooms', 'friends')
        .then((res) => {

          expect(url).to.equal('/projects/123?include=rooms,friends');
        });
    });

    it('with sparse fieldsets', () => {

      return projects
        .getProject(123)
        .fields({'rooms': ['title', 'location']})
        .then((res) => {

          expect(url).to.equal('/projects/123?fields[rooms]=title,location');
        });
    });

    it('with sort', () => {

      return projects
        .getProject(123)
        .sort('-createdAt', 'updatedAt')
        .then((res) => {

          expect(url).to.equal('/projects/123?sort=-created-at,updated-at');
        });
    });

    // TODO: move this into testing the endpoint.js function
    it('serializes response');
  });

  describe('create', () => {

    it('uses POST method', () => {

      return projects.createProject({
        title: 'My Project',
        location: 'Room'
      })
        .then(() => {

          expect(method).to.equal('POST');
        });
    });

    it('new', () => {

      return projects.createProject({
        title: 'My Project',
        location: 'Room'
      })
        .then((res) => {

          expect(payload).to.eql({
            type: 'projects',
            attributes: {
              title: 'My Project',
              location: 'Room'
            }
          });
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

            expect(payload).to.eql({
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
            });
          });
    });
  });

  describe('updating', () => {

    it('uses PATCH method', () => {

      return projects.updateProject(1, {}).then((res) => {

        expect(method).to.equal('PATCH');
      });
    });

    it('updates', () => {

      return projects.updateProject(1, {
        name: 'test'
      })
        .then((res) => {

          expect(payload).to.eql({
            type: 'projects',
            id: 1,
            attributes: {
              name: 'test'
            }
          });
        });
    });

    it('with relationships', () => {

      return projects
        .updateProject(1)
        .relatedTo({
          user: 2
        })
          .then(() => {

            expect(payload).to.eql({
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
            });
          });
    });
  });

  describe('deleting', () => {

    it('uses DELETE method', () => {

      return projects.deleteProject(1)
        .then(() => {

          expect(method).to.equal('DELETE');
        });
    });

    it('deletes', () => {

      return projects.deleteProject(1)
        .then(() => {

          expect(url).to.equal('/projects/1');
        });
    });
  });
});
