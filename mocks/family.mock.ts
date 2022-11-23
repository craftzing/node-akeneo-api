export default {
  get: {
    _embedded: {
      items: [
        {
          code: 'cushions',
          attributes: [
            'colour_fabric',
            'colour_polyskin',
            'fabric_laminated',
            'fabric_pricecategory',
            'fabric_style',
            'item_collection',
            'item_description',
            'item_height',
            'item_length',
            'item_onrequest',
            'item_size',
            'item_weight',
            'item_width',
            'mkt_description',
            'mkt_info',
            'sku',
          ],
          attribute_as_label: 'sku',
          attribute_as_image: null,
        },
      ],
    },
  },
  getVariants: {
    _embedded: {
      items: [
        {
          code: 'accessories_by_top_material_and_top_colour',
          labels: {
            en_GB: 'Accessories by top material and top colour',
            de_DE: 'Accessories by top material and top colour',
            fr_FR: 'Accessories by top material and top colour',
            nl_BE: 'Accessories by top material and top colour',
          },
          variant_attribute_sets: [
            {
              level: 1,
              axes: ['material_top'],
              attributes: ['material_top', 'model_3dfile'],
            },
            {
              level: 2,
              axes: ['colour_top'],
              attributes: [
                'sku',
                'item_description',
                'item_onrequest',
                'mkt_description',
                'colour_top',
                'item_image',
                'onwebsite',
              ],
            },
          ],
        },
      ],
    },
  },
};
