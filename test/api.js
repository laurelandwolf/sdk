import {namespace} from './utils/testing';
import api from '../src/api';

let test = namespace('api');

test('projects', ({equal}) => {

  let a = api();

  equal(typeof a.getProjects, 'function', 'GET projects');
  equal(typeof a.getProject, 'function', 'GET projects/:id');
  equal(typeof a.createProject, 'function', 'POST projects');
  equal(typeof a.updateProject, 'function', 'PATCH projects/:id');
  equal(typeof a.deleteProject, 'function', 'DELETE projects/:id');
});

test('designers', ({equal}) => {

  let a = api();

  equal(typeof a.getDesigners, 'function', 'GET designers');
  equal(typeof a.getDesigner, 'function', 'GET designers/:id');
  equal(typeof a.createDesigner, 'function', 'POST designers');
  equal(typeof a.updateDesigner, 'function', 'PATCH designers/:id');
  equal(typeof a.deleteDesigner, 'function', 'DELETE designers/:id');
});
