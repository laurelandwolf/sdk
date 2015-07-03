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
        .include('rooms', 'friends')
        .then((res) => {

          let req = mockFetch.request();
          expect(req.url).to.equal('/projects?include=rooms,friends');
        });
    });

    it('with sparse fieldsets', () => {

      return projects
        .getProjects()
        .fields({'rooms': ['title', 'location']})
        .then((res) => {

          let req = mockFetch.request();
          expect(req.url).to.equal('/projects?fields[rooms]=title,location');
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
});
