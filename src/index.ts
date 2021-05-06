import * as R from 'ramda';
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
import { compose } from 'fp-tools';
import {
  GetAllErrors,
  GetError,
  GetFieldValid,
  IsValid,
  ResetValidationState,
  Validate,
  ValidateAll,
  ValidateAllIfTrue,
  ValidateIfTrue,
  ValidateOnBlur,
  ValidateOnChange,
  ValidationSchema,
} from './types';

/**
 * A hook that can be used to generate an object containing functions and
 * properties pertaining to the validation state provided.
 * @param validationSchema an object containing all properties to validate
 * @returns validationObject
 */
export const useValidation = <S>(validationSchema: ValidationSchema<S>) => {
  // --[ state constructor ]---------------------------------------------------

  // --[ local states ]--------------------------------------------------------
  const [validationState, setValidationState] = compose(
    useState,
    createValidationState,
  )(validationSchema);

  const [validationErrors, setValidationErros] = useState<string[]>([]);

  // --[ validation logic ] ---------------------------------------------------

  // resetValidationState :: () -> void
  const resetValidationState: ResetValidationState = () =>
    R.pipe(createValidationState, setValidationState)(validationSchema);

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

  /**
   * Create a new onBlur function that calls validate on a property matching the
   * name of the event whenever a blur event happens.
   * @param state the data controlling the form
   * @return function :: (event: any) => any
   */
  const validateOnBlur: ValidateOnBlur<S> = createValidateOnBlur(
    validationSchema,
    validationState,
    setValidationState,
  );

  /**
   * Create a new onChange function that calls validateIfTrue on a property
   * matching the name of the event whenever a change event happens.
   * @param onChange function to handle onChange events
   * @param state the data controlling the form
   * @return function :: (event: any) => any
   */
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

  // isValid :: ValidationState -> boolean
  const isValid: IsValid = (state = validationState) => calculateIsValid(state);

  // generateValidationErrors :: ValidationState -> [string]
  const generateValidationErrors = (state = validationState) =>
    gatherValidationErrors(state);

  // -- update validation error array when validation state changes
  useEffect(() => {
    setValidationErros(generateValidationErrors(validationState) as any);
  }, [validationState]); // eslint-disable-line

  return {
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
};
