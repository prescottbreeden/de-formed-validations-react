"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValidation = void 0;
const R = __importStar(require("ramda"));
const react_1 = require("react");
const base_1 = require("@de-formed/base");
const fp_tools_1 = require("fp-tools");
exports.useValidation = (validationSchema) => {
    const [validationState, setValidationState] = fp_tools_1.compose(react_1.useState, base_1.createValidationState)(validationSchema);
    const [validationErrors, setValidationErros] = react_1.useState([]);
    const resetValidationState = () => R.pipe(base_1.createValidationState, setValidationState)(validationSchema);
    const validate = base_1.createValidate(validationSchema, validationState, setValidationState);
    const validateIfTrue = base_1.createValidateIfTrue(validationSchema, validationState, setValidationState);
    const validateAll = base_1.createValidateAll(validationSchema, validationState, setValidationState);
    const validateAllIfTrue = base_1.createValidateAllIfTrue(validationSchema, validationState, setValidationState);
    const validateOnBlur = base_1.createValidateOnBlur(validationSchema, validationState, setValidationState);
    const validateOnChange = base_1.createValidateOnChange(validationSchema, validationState, setValidationState);
    const getAllErrors = base_1.createGetAllErrors(validationState);
    const getError = base_1.createGetError(validationState);
    const getFieldValid = base_1.createGetFieldValid(validationState);
    const isValid = (state = validationState) => base_1.calculateIsValid(state);
    const generateValidationErrors = (state = validationState) => base_1.gatherValidationErrors(state);
    react_1.useEffect(() => {
        setValidationErros(generateValidationErrors(validationState));
    }, [validationState]);
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
//# sourceMappingURL=index.js.map