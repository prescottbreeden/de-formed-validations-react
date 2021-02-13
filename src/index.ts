import { useState, useEffect } from 'react';
import * as R from 'ramda';
import { maybe } from './maybe';
import {
  compose,
  executeSideEffect,
  isPropertyValid,
  prop,
  stringIsLessThan,
  stringIsMoreThan,
  stringIsNotEmpty,
} from './utilities';
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
  ValidationState,
} from './types';

export { compose, prop, stringIsLessThan, stringIsMoreThan, stringIsNotEmpty };

/**
 * A hook that can be used to generate an object containing functions and
 * properties pertaining to the validation state provided.
 * @param validationSchema an object containing all properties to validate
 * @returns validationObject
 */
export const useValidation = <S>(validationSchema: ValidationSchema<S>) => {
  // --[ state constructor ]---------------------------------------------------
  const createValidationsState = (schema: ValidationSchema<S>) => {
    const buildState = (acc: ValidationState, key: keyof S) => ({
      ...acc,
      [key]: { isValid: true, errors: [] },
    });
    const state = maybe(schema).map(R.keys).map(R.reduce(buildState, {}));
    return state.isJust ? state.join() : {};
  };

  // --[ local states ]--------------------------------------------------------
  const [validationState, setValidationState] = useState<ValidationState>(
    createValidationsState(validationSchema),
  );
  const [validationErrors, setValidationErros] = useState<string[]>([]);

  // --[ validation logic ] ---------------------------------------------------
  // updateValidationState :: ValidationState -> ValidationState
  const updateValidationState = executeSideEffect(setValidationState);

  // resetValidationState :: () -> void
  const resetValidationState: ResetValidationState = () =>
    R.pipe(createValidationsState, setValidationState)(validationSchema);

  // runAllValidators :: string -> x -> ValidationState
  const updatePropertyOnState = R.curry((property: keyof S, value: any) => {
    const valueIsValid = R.pipe(prop('validation'), R.applyTo(value));
    const getErrorOrNone = R.ifElse(
      valueIsValid,
      R.always(''),
      R.prop('error'),
    );
    const state = maybe(validationSchema)
      .map(prop(property))
      .map(R.values)
      .map(R.map(getErrorOrNone))
      .map(R.filter(stringIsNotEmpty))
      .map((errors: string[]) => ({ errors, isValid: !errors.length }))
      .map(R.assoc(property as any, R.__, {}));
    return state.isJust ? state.join() : {};
  });

  // validate :: string -> value -> boolean
  const validate: Validate<S> = (property: keyof S, value: any) =>
    maybe(value)
      .map(updatePropertyOnState(property as any))
      .map(R.mergeRight(validationState))
      .map(updateValidationState)
      .map(isPropertyValid(property))
      .chain(R.defaultTo(true));

  // validateIfTrue :: string -> value -> boolean
  const validateIfTrue: ValidateIfTrue<S> = (property: keyof S, value: any) => {
    const valid = maybe(value)
      .map(updatePropertyOnState(property as any))
      .map(R.mergeRight(validationState))
      .map(
        R.ifElse(
          isPropertyValid(property),
          updateValidationState,
          R.always(null),
        ),
      )
      .map(isPropertyValid(property));
    return valid.isJust ? valid.join() : true;
  };

  // validationAllIfTrue :: (x, [string]) -> boolean
  const validateAll: ValidateAll<S> = (
    value: any,
    props = Object.keys(validationSchema) as (keyof S)[],
  ) => {
    const reduceStateUpdates = (acc: ValidationState, property: keyof S) => ({
      ...acc,
      ...updatePropertyOnState(property as any, value),
    });
    return maybe(props)
      .map(R.reduce(reduceStateUpdates, {}))
      .map(R.mergeRight(validationState))
      .map(updateValidationState)
      .map(isValid)
      .chain(R.defaultTo(true));
  };

  // validationAllIfTrue :: (x, [string]) -> boolean
  const validateAllIfTrue: ValidateAllIfTrue<S> = (
    value: any,
    props = Object.keys(validationSchema) as (keyof S)[],
  ) => {
    const reduceValids = (acc: ValidationState, property: keyof S) => {
      const updated = updatePropertyOnState(property as any, value);
      return updated[property].isValid
        ? { ...acc, ...updated }
        : { ...acc, ...validationState[property as any] };
    };
    return maybe(props)
      .map(R.reduce(reduceValids, {}))
      .map(R.mergeRight(validationState))
      .map(isValid)
      .chain(R.defaultTo(true));
  };

  /**
   * Create a new onBlur function that calls validate on a property matching the
   * name of the event whenever a blur event happens.
   * @param state the data controlling the form
   * @return function :: (event: any) => any
   */
  const validateOnBlur: ValidateOnBlur<S> = (state: S) => (
    event: any,
  ): void => {
    const { value, name } = event.target;
    validate(name as keyof S, { ...state, [name]: value });
  };

  /**
   * Create a new onChange function that calls validateIfTrue on a property
   * matching the name of the event whenever a change event happens.
   * @param onChange function to handle onChange events
   * @param state the data controlling the form
   * @return function :: (event: any) => any
   */
  const validateOnChange: ValidateOnChange<S> = (
    onChange: (event: any) => any,
    state: S,
  ) => (event: any): unknown => {
    const { value, name } = event.target;
    validateIfTrue(name as keyof S, { ...state, [name]: value });
    return onChange(event);
  };

  // getAllErrors :: (string, ValidationState) -> [string]
  const getAllErrors: GetAllErrors<S> = (
    property: keyof S,
    vState = validationState,
  ) => {
    const errors = maybe(vState).map(prop(property)).map(prop('errors'));
    return errors.isJust ? errors.join() : [];
  };

  // getError :: (string, ValidationState) -> string
  const getError: GetError<S> = (
    property: keyof S,
    vState = validationState,
  ) => {
    const error = maybe(vState)
      .map(prop(property))
      .map(prop('errors'))
      .map(R.head);
    return error.isJust ? error.join() : '';
  };

  // getFieldValid :: (string, ValidationState) -> boolean
  const getFieldValid: GetFieldValid<S> = (
    property: keyof S,
    vState = validationState,
  ) => {
    const valid = maybe(vState).map(prop(property)).map(prop('isValid'));
    return valid.isJust ? valid.join() : true;
  };

  // isValid :: ValidationState -> boolean
  const isValid: IsValid = (state = validationState) => {
    return R.reduce(
      (acc, curr) => (acc ? isPropertyValid(curr)(state) : acc),
      true,
      Object.keys(state),
    );
  };

  // generateValidationErrors :: ValidationState -> [string]
  const generateValidationErrors = (state: ValidationState) => {
    return R.reduce(
      (acc: string[], curr: keyof S) =>
        getError(curr) ? [...acc, getError(curr)] : acc,
      [],
      Object.keys(state) as (keyof S)[],
    );
  };

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
