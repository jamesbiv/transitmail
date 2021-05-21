export interface ISettingsValidationCondition {
    field: string;
    subField?: string;
    constraint: (value: any) => boolean;
    message: string;
  }