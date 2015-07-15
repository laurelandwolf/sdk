import {assign} from 'lodash';

import resource from './resource';

function api (config = {}) {

  function makeResource (options) {

    return resource(options, config);
  }

  let projects = makeResource({
    type: 'projects'

    // TODO: this should be the name of the uri segement
    // If we need a custom uri segment with a different name
    // we should be able to define it
    // // optional
    // singular: 'project',
    // plural: 'projects',
    // uri: 'projects' <~~~~~~~~~~~ use that to override name
  });

  let designers = makeResource({
    type: 'designers'
  });

  let rooms = makeResource({
    type: 'rooms'
  });

  let floorPlans = makeResource({
    type: 'floor-plans'
  });

  let comments = makeResource({
    type: 'comments'
  });

  let recipient = makeResource({
    type: 'recipient',
    singleton: true
  });

  let card = makeResource({
    type: 'card',
    singleton: true
  });

  let bankAccount = makeResource({
    type: 'bank-account',
    singleton: true
  });

  return assign(
    {config},
    projects,
    designers,
    rooms,
    floorPlans,
    comments,
    recipient,
    card,
    bankAccount
  );
}

export default api;
