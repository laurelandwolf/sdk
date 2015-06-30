export default {
  data: {
    type: 'projects',
    id: 1,
    attributes: {},
    relationships: {
      designer: {
        data: {
          type: 'people',
          id: 2
        }
      },
      'some-item': {
        data: [
          {type: 'people', id: 2},
          {type: 'people', id: 123}
        ]
      }
    }
  },
  included: [
    {
      type: 'people',
      id: 2,
      attributes: {
        name: 'Tester'
      }
    },
    {
      type: 'people',
      id: 123,
      attributes: {
        name: 'another'
      }
    },
    {
      type: 'list',
      id: 4321,
      relationships: {
        author: {
          data: {
            id: 123,
            type: 'people'
          }
        }
      }
    },
    {
      type: 'list',
      id: 9876,
      relationships: {
        author: {
          data: [
            {id: 123, type: 'people'},
            {id: 2, type: 'people'}
          ]
        }
      }
    }
  ],
  // errors: {},
  // meta: {},
  // links: {
  //   self: ''
  //   related: {}
  // }
};
