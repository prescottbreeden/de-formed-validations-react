export type ValidationFunction<S> = (state: S) => boolean;
export type ForceValidationState = (validationState: ValidationState) => void;
export type GetAllErrors<S> = (property: keyof S) => string[];
export type GetError<S> = (property: keyof S) => string;
export type GetFieldValid<S> = (property: keyof S) => boolean;
export type ResetValidationState = () => void;
export type Validate<S> = (property: keyof S, state: S) => boolean;
export type ValidateAll<S> = (state: S, keys?: (keyof S)[]) => boolean;
export type ValidateCustom = (vals: CustomValidation[]) => boolean;
export type ValidateIfTrue<S> = (property: keyof S, state: S) => boolean;
export type ValidateOnBlur<S> = (state: S) => (event: any) => any;
export type ValidateOnChange<S> = (
  onChange: (event: any) => any,
  state: S,
) => (event: any) => any;

export interface ValidationObject<S> {
  forceValidationState: ForceValidationState;
  getError: GetError<S>;
  getAllErrors: GetAllErrors<S>;
  getFieldValid: GetFieldValid<S>;
  isValid: boolean;
  resetValidationState: ResetValidationState;
  validate: Validate<S>;
  validateAll: ValidateAll<S>;
  validateCustom: ValidateCustom;
  validateIfTrue: ValidateIfTrue<S>;
  validateOnBlur: ValidateOnBlur<S>;
  validateOnChange: ValidateOnChange<S>;
  validationErrors: string[];
  validationState: ValidationState;
}

export interface ValidationProps<S> {
  error: string;
  validation: ValidationFunction<S>;
}

export interface ValidationSchema<S> {
  [key: string]: ValidationProps<S>[];
}

export interface ValidationState {
  [key: string]: {
    isValid: boolean;
    errors: string[];
  };
}

export interface CustomValidation {
  key: string;
  state: any;
}
