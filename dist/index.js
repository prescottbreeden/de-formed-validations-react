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
const fp_tools_1 = require("fp-tools");
__exportStar(require("./types"), exports);
const useValidation = (validationSchema) => {
    const [validationState, setValidationState] = react_1.useState(() => base_1.createValidationState(validationSchema));
    const [validationErrors, setValidationErros] = react_1.useState([]);
    const [isValid, setIsValid] = react_1.useState(true);
    const resetValidationState = () => fp_tools_1.pipe(base_1.createValidationState, setValidationState)(validationSchema);
    const validate = base_1.createValidate(validationSchema, validationState, setValidationState);
    const validateIfTrue = base_1.createValidateIfTrue(validationSchema, validationState, setValidationState);
    const validateAll = base_1.createValidateAll(validationSchema, validationState, setValidationState);
    const validateAllIfTrue = base_1.createValidateAllIfTrue(validationSchema, validationState, setValidationState);
    const validateOnBlur = base_1.createValidateOnBlur(validationSchema, validationState, setValidationState);
    const validateOnChange = base_1.createValidateOnChange(validationSchema, validationState, setValidationState);
    const getAllErrors = base_1.createGetAllErrors(validationState);
    const getError = base_1.createGetError(validationState);
    const getFieldValid = base_1.createGetFieldValid(validationState);
    const generateValidationErrors = (state = validationState) => base_1.gatherValidationErrors(state);
    react_1.useEffect(() => {
        setValidationErros(generateValidationErrors(validationState));
        setIsValid(base_1.calculateIsValid(validationState));
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