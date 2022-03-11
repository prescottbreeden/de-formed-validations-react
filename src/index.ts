import React from 'react';
import {
  calculateIsValid,
  createGetAllErrors,
  createGetError,
  createGetFieldValid,
  createValidate,
  createValidateAll,
  createValidateAllIfTrue,
  createValidateIfTrue,
  createValidateOnBlur,
  createValidateOnChange,
  createValidationState,
  gatherValidationErrors,
  GetAllErrors,
  GetError,
  GetFieldValid,
  ResetValidationState,
  Validate,
  ValidateAll,
  ValidateAllIfTrue,
  ValidateIfTrue,
  ValidateOnBlur,
  ValidateOnChange,
  ValidationSchema,
  ValidationState,
} from '@de-formed/base';

/**
 * A hook that can be used to generate an object containing functions and
 * properties pertaining to the validation schema provided.
 * @param validationSchema an object containing all properties to validate
 * @returns validationObject
 */
export const useValidation = <S>(validationSchema: ValidationSchema<S>) => {
  // --[ local states ]--------------------------------------------------------
  const [validationState, setValidationState] = React.useState<ValidationState>(
    () => createValidationState(validationSchema),
  );
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [isValid, setIsValid] = React.useState<boolean>(true);

  // --[ validation logic ] ---------------------------------------------------

  const resetValidationState: ResetValidationState = () =>
    setValidationState(createValidationState(validationSchema));

  const validate: Validate<S> = createValidate(
    validationSchema,
    validationState,
    setValidationState,
  );

  const validateIfTrue: ValidateIfTrue<S> = createValidateIfTrue(
    validationSchema,
    validationState,
    setValidationState,
  );

  const validateAll: ValidateAll<S> = createValidateAll(
    validationSchema,
    validationState,
    setValidationState,
  );

  const validateAllIfTrue: ValidateAllIfTrue<S> = createValidateAllIfTrue(
    validationSchema,
    validationState,
    setValidationState,
  );

  const validateOnBlur: ValidateOnBlur<S> = createValidateOnBlur(
    validationSchema,
    validationState,
    setValidationState,
  );

  const validateOnChange: ValidateOnChange<S> = createValidateOnChange(
    validationSchema,
    validationState,
    setValidationState,
  );

  const getAllErrors: GetAllErrors<S> = createGetAllErrors(validationState);

  const getError: GetError<S> = createGetError(validationState);

  const getFieldValid: GetFieldValid<S> = createGetFieldValid(validationState);

  // -- update validation error array and isValid when validation state changes
  React.useEffect(() => {
    setValidationErrors(gatherValidationErrors(validationState));
    setIsValid(calculateIsValid(validationState));
  }, [validationState]);

  const validationObject = {
    getAllErrors,
    getError,
    getFieldValid,
    isValid,
    resetValidationState,
    setValidationState,
    validate,
    validateAll,
    validateAllIfTrue,
    validateIfTrue,
    validateOnBlur,
    validateOnChange,
    validationErrors,
    validationState,
  };

  return validationObject;
};
