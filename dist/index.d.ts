import React from 'react';
import { GetAllErrors, GetError, GetFieldValid, ResetValidationState, Validate, ValidateAll, ValidateAllIfTrue, ValidateIfTrue, ValidateOnBlur, ValidateOnChange, ValidationSchema, ValidationState } from '@de-formed/base';
export declare const useValidation: <S>(validationSchema: ValidationSchema<S>) => {
    getAllErrors: GetAllErrors<S>;
    getError: GetError<S>;
    getFieldValid: GetFieldValid<S>;
    isValid: boolean;
    resetValidationState: ResetValidationState;
    setValidationState: React.Dispatch<React.SetStateAction<ValidationState>>;
    validate: Validate<S>;
    validateAll: ValidateAll<S>;
    validateAllIfTrue: ValidateAllIfTrue<S>;
    validateIfTrue: ValidateIfTrue<S>;
    validateOnBlur: ValidateOnBlur<S>;
    validateOnChange: ValidateOnChange<S>;
    validationErrors: string[];
    validationState: ValidationState;
};
