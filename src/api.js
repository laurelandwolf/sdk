import Request from './request';
import validate from './utils/validate';

class Api extends Request {

  constructor (spec = {}) {

    super(spec);
    this.spec = spec;
  }

  getProject () {

    this.get('/projects')
    .then((body) => {

      console.log('RESPONSE', body);
    })
    .catch((err) => {

      console.log('ERROR', err);
    });;

    return this;
  }

  createProject (attributes) {

    validate.attributes(attributes);

    this.post('/projects', {
      body: JSON.stringify({
        data: {
          type: 'project',
          attributes
        }
      })
    })

    return this;
  }
}

export default Api;
