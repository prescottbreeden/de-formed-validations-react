/// <reference types="react" />
import { compose, prop, stringIsLessThan, stringIsMoreThan, stringIsNotEmpty } from './utilities';
import { GetAllErrors, GetError, GetFieldValid, IsValid, ResetValidationState, Validate, ValidateAll, ValidateAllIfTrue, ValidateIfTrue, ValidateOnBlur, ValidateOnChange, ValidationSchema, ValidationState } from './types';
export { compose, prop, stringIsLessThan, stringIsMoreThan, stringIsNotEmpty };
export declare const useValidation: <S>(validationSchema: ValidationSchema<S>) => {
    getAllErrors: GetAllErrors<S>;
    getError: GetError<S>;
    getFieldValid: GetFieldValid<S>;
    isValid: IsValid;
    resetValidationState: ResetValidationState;
    setValidationState: import("react").Dispatch<import("react").SetStateAction<ValidationState>>;
    validate: Validate<S>;
    validateAll: ValidateAll<S>;
    validateAllIfTrue: ValidateAllIfTrue<S>;
    validateIfTrue: ValidateIfTrue<S>;
    validateOnBlur: ValidateOnBlur<S>;
    validateOnChange: ValidateOnChange<S>;
    validationErrors: string[];
    validationState: ValidationState;
};
