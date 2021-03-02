export default {
  get: {
    _embedded: {
      items: [
        {
          code: 'back_material',
          type: 'akeneo_reference_entity',
          group: 'erp',
          unique: false,
        },
      ],
    },
  },
  getOne: {
    code: 'back_material',
    type: 'akeneo_reference_entity',
    group: 'erp',
    unique: false,
  },
  getAll: {
    count: 1,
    _embedded: {
      items: [
        {
          code: 'back_material',
          type: 'akeneo_reference_entity',
          group: 'erp',
          unique: false,
        },
      ],
    },
  },
};
