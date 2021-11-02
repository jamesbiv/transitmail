export interface ISettingsValidationCondition {
  field: string;
  subField?: string;
  constraint: (value: unknown) => boolean;
  message: string;
}
