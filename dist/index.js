"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValidation = void 0;
const react_1 = __importDefault(require("react"));
const base_1 = require("@de-formed/base");
const useValidation = (validationSchema) => {
    const [validationState, setValidationState] = react_1.default.useState(() => (0, base_1.createValidationState)(validationSchema));
    const [validationErrors, setValidationErrors] = react_1.default.useState([]);
    const [isValid, setIsValid] = react_1.default.useState(true);
    const resetValidationState = () => setValidationState((0, base_1.createValidationState)(validationSchema));
    const validate = (0, base_1.createValidate)(validationSchema, validationState, setValidationState);
    const validateIfDirty = (0, base_1.createValidateIfDirty)(validationSchema, validationState, setValidationState);
    const validateAll = (0, base_1.createValidateAll)(validationSchema, validationState, setValidationState);
    const validateAllIfDirty = (0, base_1.createValidateAllIfDirty)(validationSchema, validationState, setValidationState);
    const validateOnBlur = (0, base_1.createValidateOnBlur)(validationSchema, validationState, setValidationState);
    const validateOnChange = (0, base_1.createValidateOnChange)(validationSchema, validationState, setValidationState);
    const getAllErrors = (0, base_1.createGetAllErrors)(validationState);
    const getError = (0, base_1.createGetError)(validationState);
    const getFieldValid = (0, base_1.createGetFieldValid)(validationState);
    react_1.default.useEffect(() => {
        setValidationErrors((0, base_1.gatherValidationErrors)(validationState));
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
        validateAllIfDirty,
        validateIfDirty,
        validateOnBlur,
        validateOnChange,
        validationErrors,
        validationState,
    };
    return validationObject;
};
exports.useValidation = useValidation;
//# sourceMappingURL=index.js.map