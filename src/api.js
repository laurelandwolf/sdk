import {assign} from 'lodash';

import resource from './resource';
// import validate from './validate';

function api (config = {}) {

  // function createProject (attributes) {
  //
  //   validate.attributes(attributes);
  //
  //   req.post('/projects', {
  //     body: JSON.stringify({
  //       data: {
  //         type: 'project',
  //         attributes
  //       }
  //     })
  //   });
  //
  //   return {};
  // }

  let projects = resource({
    name: 'projects'

    // // optional
    // singular: 'project',
    // plural: 'projects',
    // endpoint: '/projects',
    // baseUrl: '/some-route'
  }, config);

  return assign(
    {config},
    projects
  );
}

export default api;
