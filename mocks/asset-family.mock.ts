const assetFamilyMock = {
  code: 'images',
  labels: {
    en_GB: 'images',
  },
  attribute_as_main_media: 'media',
  product_link_rules: [],
  transformations: [],
  naming_convention: {},
};

const assetFamilyAsset = {
  code: 'ALR195T',
  values: {
    media: [
      {
        locale: null,
        channel: null,
        data: '7/b/8/e/7b8eab141e592cdbc63811781cdc8c415c4fce10_ALR195T.jpg',
      },
    ],
  },
};

export default {
  get: {
    _embedded: {
      items: [assetFamilyMock],
    },
  },
  getOne: assetFamilyMock,
  getAll: {
    count: 1,
    _embedded: {
      items: [assetFamilyMock],
    },
  },
  getAssetsAll: [
    {
      _links: {
        next: {
          href:
            'https://test.cloud.akeneo.com/api/rest/v1/asset-families/model_images/assets?search_after=alr195t',
        },
      },
      _embedded: {
        items: [assetFamilyAsset],
      },
    },
    {
      _embedded: {
        items: [assetFamilyAsset],
      },
    },
  ],
};
