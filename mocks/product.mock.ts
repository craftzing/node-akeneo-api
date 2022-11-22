export default {
  get: {
    _embedded: {
      items: [
        {
          identifier: 'testP',
          enabled: true,
          family: 'tables',
          categories: ['diningtables'],
        },
      ],
    },
  },
  getAll: {
    _embedded: {
      items: [
        {
          identifier: 'testP',
          enabled: true,
          family: 'tables',
          categories: ['diningtables'],
        },
      ],
    },
  },
  getOne: {
    identifier: 'testP',
    enabled: true,
    family: 'tables',
    categories: ['diningtables'],
  },
};
