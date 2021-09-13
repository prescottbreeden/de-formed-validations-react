import { BaseValidation } from '@de-formed/base';
import { ValidationSchema } from './types';
export * from './types';
export declare const useValidation: <S>(validationSchema: ValidationSchema<S>) => BaseValidation<S>;
