import { SchemaConfig, ValidationObject, ValidationSchema } from '@de-formed/base';
export declare const useValidation: <S>(validationSchema: ValidationSchema<S>, config?: SchemaConfig) => ValidationObject<S>;
