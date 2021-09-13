"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValidation = void 0;
const react_1 = require("react");
const base_1 = require("@de-formed/base");
__exportStar(require("./types"), exports);
const useValidation = (validationSchema) => {
    const [validationState, setValidationState] = (0, react_1.useState)(() => (0, base_1.createValidationState)(validationSchema));
    const [validationErrors, setValidationErros] = (0, react_1.useState)([]);
    const [isValid, setIsValid] = (0, react_1.useState)(true);
    const resetValidationState = () => setValidationState((0, base_1.createValidationState)(validationSchema));
    const validate = (0, base_1.createValidate)(validationSchema, validationState, setValidationState);
    const validateIfTrue = (0, base_1.createValidateIfTrue)(validationSchema, validationState, setValidationState);
    const validateAll = (0, base_1.createValidateAll)(validationSchema, validationState, setValidationState);
    const validateAllIfTrue = (0, base_1.createValidateAllIfTrue)(validationSchema, validationState, setValidationState);
    const validateOnBlur = (0, base_1.createValidateOnBlur)(validationSchema, validationState, setValidationState);
    const validateOnChange = (0, base_1.createValidateOnChange)(validationSchema, validationState, setValidationState);
    const getAllErrors = (0, base_1.createGetAllErrors)(validationState);
    const getError = (0, base_1.createGetError)(validationState);
    const getFieldValid = (0, base_1.createGetFieldValid)(validationState);
    const generateValidationErrors = (state = validationState) => (0, base_1.gatherValidationErrors)(state);
    (0, react_1.useEffect)(() => {
        setValidationErros(generateValidationErrors(validationState));
        setIsValid((0, base_1.calculateIsValid)(validationState));
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
exports.useValidation = useValidation;
//# sourceMappingURL=index.js.map