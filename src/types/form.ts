export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date";

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  passwordStrength?: boolean; // min 8, contains number
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface DerivedConfig {
  enabled: boolean;
  parentKeys: string[];
  formula: string; // expression using parent keys, with helpers like today(), toDate(), yearsBetween()
}

export interface BaseField {
  id: string;
  key: string; // unique key used in formulas/values
  type: FieldType;
  label: string;
  defaultValue?: any;
  validations?: ValidationRules;
  derived?: DerivedConfig;
}

export interface SelectLikeField extends BaseField {
  options?: FieldOption[];
}

export type FormField = BaseField | SelectLikeField;

export interface FormSchema {
  id: string;
  name?: string;
  createdAt: string; // ISO
  fields: FormField[];
}

export const LOCAL_STORAGE_KEY = "formBuilder.forms";
