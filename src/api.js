import request from './request';
import validate from './validate';

function api (config = {}) {

  let req = request(config);

  function getProjects () {

    return req.get('/projects');
  }

  function createProject (attributes) {

    validate.attributes(attributes);

    req.post('/projects', {
      body: JSON.stringify({
        data: {
          type: 'project',
          attributes
        }
      })
    });

    return {};
  }

  return {
    config,
    getProjects,
    createProject
  };
}

export default api;
