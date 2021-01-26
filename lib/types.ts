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

export type ProductModel = {
  code: string;
  family: string;
  family_variant: string;
  parent?: string;
  categories: string[];
  values: Object;
  created: string;
  updated: string;
  associations: Object;
  quantified_assoications: Object;
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

export type Variant = {
  code: string;
  variant_attribute_sets: Object[];
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

type EntityRecordValue = {
  locale: string;
  channel: string;
  data: object;
};
export type EntityRecord = {
  code: string;
  values: Record<string, EntityRecordValue>;
};

export declare type KeyValueMap = Record<string, any>;

export type Category<T = KeyValueMap> = {
  code: string;
  parent?: string;
  labels: T;
};
