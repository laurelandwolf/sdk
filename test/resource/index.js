import {expect} from 'chai';

import resource from '../../src/resource';
import mockFetch from '../mock/fetch';

describe('resource', () => {

  let projects;

  beforeEach(() => {

    projects = resource({
      type: 'projects'
    }, {
      mockFetch: mockFetch()
    });
  })

  it('excludes "?" if no query string', () => {

    return projects.getProjects()
      .then((res) => {

        expect(res.url).to.equal('/projects');
      });
  });

  describe('get all', () => {

    it('no querystring', () => {

      return projects.getProjects()
        .then((res) => {

          expect(res.url).to.equal('/projects');
          expect(res.method).to.equal('GET');
        });
    });

    it('with relationships', () => {

      return projects
        .getProjects()
        .includes('rooms', 'friends')
        .then((res) => {

          expect(res.url).to.equal('/projects?include=rooms,friends');
        });
    });

    it('with sparse fieldsets', () => {

      return projects
        .getProjects()
        .fields({'rooms': ['title', 'location']})
        .then((res) => {

          expect(res.url).to.equal('/projects?fields[rooms]=title,location');
        });
    });

    it('with sort', () => {

      return projects
        .getProjects()
        .sort('-createdAt', 'updatedAt')
        .then((res) => {

          expect(res.url).to.equal('/projects?sort=-created-at,updated-at');
        });
    });

    it('serializes response');
  });

  describe('get one', () => {

    it('no querystring', () => {

      return projects
        .getProject(123)
        .then((res) => {

          expect(res.url).to.equal('/projects/123');
          expect(res.method).to.equal('GET');
        });
    });

    it('with relationships', () => {

      return projects
        .getProject(123)
        .includes('rooms', 'friends')
        .then((res) => {

          expect(res.url).to.equal('/projects/123?include=rooms,friends');
        });
    });

    it('with sparse fieldsets', () => {

      return projects
        .getProject(123)
        .fields({'rooms': ['title', 'location']})
        .then((res) => {

          expect(res.url).to.equal('/projects/123?fields[rooms]=title,location');
        });
    });

    it('with sort', () => {

      return projects
        .getProject(123)
        .sort('-createdAt', 'updatedAt')
        .then((res) => {

          expect(res.url).to.equal('/projects/123?sort=-created-at,updated-at');
        });
    });

    it('serializes response');
  });

  describe('creating one', () => {

    it('new', () => {

      return projects.createProject({
        title: 'My Project',
        location: 'Room'
      })
        .then((res) => {

          expect(res.url).to.equal('/projects');
          expect(res.method).to.equal('POST');
          expect(res.payload).to.eql({
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
          user: 123
        })
          .then((res) => {

            expect(res.payload).to.eql({
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
                }
              }
            });
          });
    });
  });
});
