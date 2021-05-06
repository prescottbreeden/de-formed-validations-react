export declare type GetAllErrors<S> = (property: keyof S) => string[];
export declare type GetError<S> = (property: keyof S) => string;
export declare type GetFieldValid<S> = (property: keyof S) => boolean;
export declare type IsValid = boolean;
export declare type ResetValidationState = () => void;
export declare type SetValidationState = (validationState: ValidationState) => void;
export declare type Validate<S> = (property: keyof S, value: S) => boolean;
export declare type ValidateAll<S> = (value: S, keys?: (keyof S)[]) => boolean;
export declare type ValidateAllIfTrue<S> = (value: S, keys?: (keyof S)[]) => boolean;
export declare type ValidateIfTrue<S> = (property: keyof S, value: S) => boolean;
export declare type ValidateOnBlur<S> = (value: S) => (event: any) => any;
export declare type ValidateOnChange<S> = (onChange: (event: any) => any, value: S) => (event: any) => any;
export declare type ValidationFunction<S> = (value: S) => boolean;
export interface ValidationObject<S> {
    getAllErrors: GetAllErrors<S>;
    getError: GetError<S>;
    getFieldValid: GetFieldValid<S>;
    isValid: boolean;
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
