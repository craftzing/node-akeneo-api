import { AxiosInstance, AxiosResponse } from "axios";

export type ClientParams = {
  /**
   * API host
   */
  baseURL: string;
  /**
   * username
   */
  username: string;
  /**
   * password
   */
  password: string;
  /**
   * clientId of your app
   */
  clientId: string;
  /**
   * matching secret
   */
  secret: string;
};

export type ProductModelQueryParameters = {
  search?: string;
};

export type ProductQueryParameters = {
  search?: string;
};

export type AkeneoClient = {
  raw: {
    http: AxiosInstance;
  };
  category: {
    get: (id: string) => Promise<Category>;
    getAll: () => Promise<Category[]>;
  };
  productModel: {
    getOne: (id: string) => Promise<ProductModel>;
    get: (query: ProductModelQueryParameters) => Promise<ProductModel[]>;
    getAll: () => Promise<ProductModel[]>;
  };
  product: {
    getOne: (id: string) => Promise<Product>;
    get: (query: ProductQueryParameters) => Promise<Product[]>;
    getAll: () => Promise<Product[]>;
  };
  assetFamily: {
    get: (code: string) => Promise<AssetFamily>;
    getAll: () => Promise<AssetFamily[]>;
  };
  assets: {
    getAll: (assetFamilyCode: string) => Promise<Asset[]>;
    get: (assetFamilyCode: string, code: string) => Promise<Asset[]>;
  };
  assetMediaFiles: {
    get: (code: string) => Promise<any>;
  };
  referenceEntitiesMediaFiles: {
    get: (code: string) => Promise<any>;
  };
  attributes: {
    getAll: () => Promise<Attribute[]>;
    getOptions: (attribute: string) => Promise<AttributeOption[]>;
    add: ({
      code,
      attribute,
    }: {
      code: string;
      attribute: any;
    }) => Promise<AxiosResponse<any>>;
    addOption: ({
      attributeCode,
      code,
      option,
    }: {
      attributeCode: string;
      code: string;
      option: any;
    }) => Promise<AxiosResponse<any>>;
  };
  referenceEntities: {
    getMany: () => Promise<Entity[]>;
    getRecords: (id: string) => Promise<EntityRecord[]>;
    add: ({
      code,
      body,
    }: {
      code: string;
      body: any;
    }) => Promise<AxiosResponse<any>>;
    addAttribute: ({
      referenceEntityCode,
      code,
      attribute,
    }: {
      referenceEntityCode: string;
      code: string;
      attribute: any;
    }) => Promise<void>;
    addAttributeOption: ({
      referenceEntityCode,
      attributeCode,
      code,
      option,
    }: {
      referenceEntityCode: string;
      attributeCode: string;
      code: string;
      option: any;
    }) => Promise<void>;
    addRecords: ({
      referenceEntityCode,
      records,
    }: {
      referenceEntityCode: string;
      records: any[];
    }) => Promise<void>;
  };
  families: {
    getMany: () => Promise<Family[]>;
    getVariants: (id: string) => Promise<Variant[]>;
  };
};

type Assocation = {
  products: string[];
  product_models: string[];
  groups: string[];
};
export type ProductModel = {
  code: string;
  family: string;
  family_variant: string;
  parent?: string;
  categories: string[];
  values: Record<string, any>;
  created: string;
  updated: string;
  associations: Record<string, Assocation>;
  quantified_assoications: Record<string, Assocation>;
  metadata: Object;
};

export type Product = {
  identifier: string;
  enabled: boolean;
  family: string;
  categories: string[];
  groups: string[];
  parent: string;
  values: Record<string, any>;
  associations: Record<string, Assocation>;
  created: string;
  updated: string;
  quantified_assoications: Record<string, Assocation>;
  metadata: Object;
};

export type Family = {
  code: string;
  attribute_as_label: string;
  attribute_as_image: string;
  attributes: string[];
  attribute_requirements: Object;
  labels: Object;
};

type VariantAttributeSet = {
  level: number;
  attributes: string[];
  axes: string[];
};
export type Variant = {
  code: string;
  variant_attribute_sets: VariantAttributeSet[];
  labels: Object;
};

export type Attribute = {
  code: string;
  type: string;
  labels: Record<string, string>;
  group: string;
  group_labels: Record<string, string>;
  sort_order: number;
  localizable: boolean;
  scopable: boolean;
  available_locales: string[];
  unique: boolean;
  useable_as_grid_filter: boolean;
  max_characters: number;
  validation_rule: string;
  validation_regexp: string;
  wysiwyg_enabled: boolean;
  number_min: string;
  number_max: string;
  decimals_allowed: boolean;
  negative_allowed: boolean;
  metric_family: string;
  default_metric_unit: string;
  date_min: string;
  date_max: string;
  allowed_extensions: string[];
  max_file_size: string;
  reference_data_name: string;
  default_value: boolean;
};

export type AttributeOption = {
  code: string;
  attribute: string;
  sort_order: number;
  labels: Record<string, string>;
};

type ValuesRecord = {
  locale: string;
  channel: string;
  data: string | string[];
};

export type Entity = {
  code: string;
  labels: KeyValueMap;
};
export type EntityRecord = {
  code: string;
  values: Record<string, ValuesRecord[]>;
};

export declare type KeyValueMap = Record<string, any>;

export type Category<T = KeyValueMap> = {
  code: string;
  parent?: string;
  labels: T;
};

export type AssetFamily = {
  code: string;
  labels: Record<string, string>;
  attribute_as_main_media: string;
  product_link_rules: Record<string, Record<string, string>>[];
  transformations: any[];
  naming_convention: {
    source: {
      property: string;
      channel: any;
      locale: any;
    };
    pattern: string;
    abort_asset_creation_on_error: boolean;
  };
};

export type Asset = {
  code: string;
  values: Record<string, ValuesRecord[]>;
};
