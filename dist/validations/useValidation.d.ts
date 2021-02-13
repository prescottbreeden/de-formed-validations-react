/// <reference types="react" />
import { ValidateOnBlur, ValidateOnChange, ValidationSchema } from "../types";
export declare const useValidation: <S>(validationSchema: ValidationSchema<S>) => {
    getAllErrors: (property: keyof S, vState?: any) => any;
    getError: (property: keyof S, vState?: any) => any;
    getFieldValid: (property: keyof S, vState?: any) => any;
    isValid: (state?: any) => boolean;
    resetValidationState: () => void;
    setValidationState: import("react").Dispatch<any>;
    validate: (property: keyof S, value: any) => any;
    validateIfTrue: (property: keyof S, value: any) => any;
    validateAll: (value: any, props?: string[]) => any;
    validateAllIfTrue: (value: any, props?: string[]) => any;
    validateOnBlur: ValidateOnBlur<S>;
    validateOnChange: ValidateOnChange<S>;
    validationErrors: never[];
    validationState: any;
};
