const category = {
  _links: {
    self: {
      href: 'https://example.com/api/rest/v1/categories/master',
    },
  },
  code: 'master',
  parent: null,
  labels: {
    en_GB: 'Master',
    nl_BE: 'Master',
    fr_FR: 'Master',
    de_DE: 'Master',
  },
};
export default {
  getAll: {
    current_page: 1,
    count: 1,
    _embedded: {
      items: [category],
    },
  },
  get: {
    current_page: 1,
    _embedded: {
      items: [category],
    },
  },
  getOne: category,
};
