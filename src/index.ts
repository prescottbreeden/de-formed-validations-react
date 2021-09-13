import { useState } from 'react';
import { createValidationState, BaseValidation } from '@de-formed/base';
import { ValidationSchema } from './types';

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

  return new BaseValidation(
    validationSchema,
    validationState,
    setValidationState
  )

};
