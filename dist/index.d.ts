/// <reference types="react" />
import { GetAllErrors, GetError, GetFieldValid, ResetValidationState, Validate, ValidateAll, ValidateAllIfTrue, ValidateIfTrue, ValidateOnBlur, ValidateOnChange, ValidationSchema } from './types';
export * from './types';
export declare const useValidation: <S>(validationSchema: ValidationSchema<S>) => {
    getAllErrors: GetAllErrors<S>;
    getError: GetError<S>;
    getFieldValid: GetFieldValid<S>;
    isValid: boolean;
    resetValidationState: ResetValidationState;
    setValidationState: import("react").Dispatch<import("react").SetStateAction<import("@de-formed/base").ValidationState>>;
    validate: Validate<S>;
    validateAll: ValidateAll<S>;
    validateAllIfTrue: ValidateAllIfTrue<S>;
    validateIfTrue: ValidateIfTrue<S>;
    validateOnBlur: ValidateOnBlur<S>;
    validateOnChange: ValidateOnChange<S>;
    validationErrors: string[];
    validationState: import("@de-formed/base").ValidationState;
};
