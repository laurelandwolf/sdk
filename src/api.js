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
    type: 'projects' // TODO: this should be the name of the uri segement
                     // If we need a custom uri segment with a different name
                     // we should be able to define it

    // // optional
    // singular: 'project',
    // plural: 'projects',
    // uri: 'projects' <~~~~~~~~~~~ use that to override name
  }, config);

  return assign(
    {config},
    projects
  );
}

export default api;
