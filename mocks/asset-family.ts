export default {
  get: {
    _embedded: {
      items: [
        {
          code: 'images',
          labels: {
            en_GB: 'images',
          },
          attribute_as_main_media: 'media',
          product_link_rules: [],
          transformations: [],
          naming_convention: {},
        },
      ],
    },
  },
  getOne: {
    code: 'images',
    labels: {
      en_GB: 'images',
    },
    attribute_as_main_media: 'media',
    product_link_rules: [],
    transformations: [],
    naming_convention: {},
  },
  getAll: {
    count: 1,
    _embedded: {
      items: [
        {
          code: 'images',
          labels: {
            en_GB: 'images',
          },
          attribute_as_main_media: 'media',
          product_link_rules: [],
          transformations: [],
          naming_convention: {},
        },
      ],
    },
  },
  getAssetsAll: [
    {
      _links: {
        next: {
          href: 'test',
        },
      },
      _embedded: {
        items: [
          {
            code: 'ALR195T',
            values: {
              media: [
                {
                  locale: null,
                  channel: null,
                  data:
                    '7/b/8/e/7b8eab141e592cdbc63811781cdc8c415c4fce10_ALR195T.jpg',
                },
              ],
            },
          },
        ],
      },
    },
    {
      _embedded: {
        items: [
          {
            code: 'ALR195T',
            values: {
              media: [
                {
                  locale: null,
                  channel: null,
                  data:
                    '7/b/8/e/7b8eab141e592cdbc63811781cdc8c415c4fce10_ALR195T.jpg',
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
