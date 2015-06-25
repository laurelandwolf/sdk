import request from './request';
import validate from './utils/validate';

function api (spec = {}) {

  let req = request(spec);

  function getProject () {

    req.get('/projects')
    .then((body) => {

      console.log('RESPONSE', body);
    })
    .catch((err) => {

      console.log('ERROR', err);
    });;

    return {};
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
    })

    return {};
  }

  return {
    getProject,
    createProject
  };
}

export default api;
