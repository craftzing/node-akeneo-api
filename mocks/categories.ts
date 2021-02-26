export default {
  get: {
    current_page: 1,
    _embedded: {
      items: [
        {
          _links: {
            self: {
              href: "https://example.com/api/rest/v1/categories/master",
            },
          },
          code: "master",
          parent: null,
          labels: {
            en_GB: "Master",
            nl_BE: "Master",
            fr_FR: "Master",
            de_DE: "Master",
          },
        },
      ],
    },
  },
};
