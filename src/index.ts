import { useState, useEffect } from 'react';
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
} from '@de-formed/base';
import {
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
} from './types';

export * from './types';

/**
 * A hook that can be used to generate an object containing functions and
 * properties pertaining to the validation state provided.
 * @param validationSchema an object containing all properties to validate
 * @returns validationObject
 */
export const useValidation = <S>(validationSchema: ValidationSchema<S>) => {
  // --[ local states ]--------------------------------------------------------
  const [validationState, setValidationState] = useState(() =>
    createValidationState(validationSchema),
  );
  const [validationErrors, setValidationErros] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);

  // --[ validation logic ] ---------------------------------------------------

  // resetValidationState :: () -> void
  const resetValidationState: ResetValidationState = () =>
    setValidationState(createValidationState(validationSchema));

  // validate :: string -> value -> boolean
  const validate: Validate<S> = createValidate(
    validationSchema,
    validationState,
    setValidationState,
  );

  // validateIfTrue :: string -> value -> boolean
  const validateIfTrue: ValidateIfTrue<S> = createValidateIfTrue(
    validationSchema,
    validationState,
    setValidationState,
  );

  // validationAllIfTrue :: (x, [string]) -> boolean
  const validateAll: ValidateAll<S> = createValidateAll(
    validationSchema,
    validationState,
    setValidationState,
  );

  // validationAllIfTrue :: (x, [string]) -> boolean
  const validateAllIfTrue: ValidateAllIfTrue<S> = createValidateAllIfTrue(
    validationSchema,
    validationState,
    setValidationState,
  );

  // validateOnBlur :: state -> (event -> any)
  const validateOnBlur: ValidateOnBlur<S> = createValidateOnBlur(
    validationSchema,
    validationState,
    setValidationState,
  );

  // validateOnChange :: (onChange, state) -> (event -> any)
  const validateOnChange: ValidateOnChange<S> = createValidateOnChange(
    validationSchema,
    validationState,
    setValidationState,
  );

  // getAllErrors :: (string, ValidationState) -> [string]
  const getAllErrors: GetAllErrors<S> = createGetAllErrors(validationState);

  // getError :: (string, ValidationState) -> string
  const getError: GetError<S> = createGetError(validationState);

  // getFieldValid :: (string, ValidationState) -> boolean
  const getFieldValid: GetFieldValid<S> = createGetFieldValid(validationState);

  // generateValidationErrors :: ValidationState -> [string]
  const generateValidationErrors = (state = validationState) =>
    gatherValidationErrors(state);

  // -- update validation error array when validation state changes
  useEffect(() => {
    setValidationErros(generateValidationErrors(validationState) as any);
    setIsValid(calculateIsValid(validationState));
  }, [validationState]); // eslint-disable-line

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
