export type ValidationFunction<S> = (value: S) => boolean;
export type SetValidationState = (validationState: ValidationState) => void;
export type GetAllErrors<S> = (property: keyof S) => string[];
export type GetError<S> = (property: keyof S) => string;
export type GetFieldValid<S> = (property: keyof S) => boolean;
export type IsValid = (state?: ValidationState) => boolean;
export type ResetValidationState = () => void;
export type Validate<S> = (property: keyof S, value: S) => boolean;
export type ValidateAll<S> = (value: S, keys?: (keyof S)[]) => boolean;
export type ValidateAllIfTrue<S> = (value: S, keys?: (keyof S)[]) => boolean;
export type ValidateIfTrue<S> = (property: keyof S, value: S) => boolean;
export type ValidateOnBlur<S> = (value: S) => (event: any) => any;
export type ValidateOnChange<S> = (
  onChange: (event: any) => any,
  value: S,
) => (event: any) => any;

export interface ValidationObject<S> {
  getError: GetError<S>;
  getAllErrors: GetAllErrors<S>;
  getFieldValid: GetFieldValid<S>;
  isValid: (state?: ValidationState) => boolean;
  resetValidationState: ResetValidationState;
  setValidationState: SetValidationState;
  validate: Validate<S>;
  validateAll: ValidateAll<S>;
  validateAllIfTrue: ValidateAllIfTrue<S>;
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
