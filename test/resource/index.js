import {expect} from 'chai';

import resource from '../../src/resource';
import mockFetch from '../mock/fetch';

describe('resource', () => {

  let projects;

  beforeEach(() => {

    projects = resource({
      name: 'projects'
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
  });
});
