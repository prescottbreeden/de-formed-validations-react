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
const react_1 = require("react");
const R = __importStar(require("ramda"));
const maybe_1 = require("./maybe");
const utilities_1 = require("./utilities");
exports.useValidation = (validationSchema) => {
    const createValidationsState = (schema) => {
        const buildState = (acc, key) => ({
            ...acc,
            [key]: { isValid: true, errors: [] },
        });
        const state = maybe_1.maybe(schema)
            .map(R.keys)
            .map(R.reduce(buildState, {}));
        return state.isJust ? state.join() : {};
    };
    const [validationState, setValidationState] = react_1.useState(createValidationsState(validationSchema));
    const [validationErrors, setValidationErros] = react_1.useState([]);
    const updateValidationState = utilities_1.executeSideEffect(setValidationState);
    const resetValidationState = () => R.pipe(createValidationsState, setValidationState)(validationSchema);
    const updatePropertyOnState = R.curry((property, value) => {
        const valueIsValid = R.pipe(utilities_1.prop("validation"), R.applyTo(value));
        const getErrorOrNone = R.ifElse(valueIsValid, R.always(''), R.prop('error'));
        const state = maybe_1.maybe(validationSchema)
            .map(utilities_1.prop(property))
            .map(R.values)
            .map(R.map(getErrorOrNone))
            .map(R.filter(utilities_1.stringIsNotEmpty))
            .map((errors) => ({ errors, isValid: !errors.length }))
            .map(R.assoc(property, R.__, validationState));
        return state.isJust ? state.join() : {};
    });
    const validate = (property, value) => maybe_1.maybe(value)
        .map(updatePropertyOnState(property))
        .map(R.mergeRight(validationState))
        .map(updateValidationState)
        .map(utilities_1.isPropertyValid(property))
        .chain(R.defaultTo(true));
    const validateIfTrue = (property, value) => {
        const valid = maybe_1.maybe(value)
            .map(updatePropertyOnState(property))
            .map(R.mergeRight(validationState))
            .map(R.ifElse(utilities_1.isPropertyValid(property), updateValidationState, R.always(null)))
            .map(utilities_1.isPropertyValid(property));
        return valid.isJust ? valid.join() : true;
    };
    const validateAll = (value, props = Object.keys(validationSchema)) => {
        const reduceStateUpdates = (acc, property) => ({
            ...acc,
            ...updatePropertyOnState(property, value),
        });
        return maybe_1.maybe(props)
            .map(R.reduce(reduceStateUpdates, {}))
            .map(R.mergeRight(validationState))
            .map(updateValidationState)
            .map(isValid)
            .chain(R.defaultTo(true));
    };
    const validateAllIfTrue = (value, props = Object.keys(validationSchema)) => {
        const reduceValids = (acc, property) => {
            const updated = updatePropertyOnState(property, value);
            return updated[property].isValid
                ? { ...acc, ...updated }
                : { ...acc, ...validationState[property] };
        };
        return maybe_1.maybe(props)
            .map(R.reduce(reduceValids, {}))
            .map(R.mergeRight(validationState))
            .map(isValid)
            .chain(R.defaultTo(true));
    };
    const validateOnBlur = (state) => (event) => {
        const { value, name } = event.target;
        validate(name, { ...state, [name]: value });
    };
    const validateOnChange = (onChange, state) => (event) => {
        const { value, name } = event.target;
        validateIfTrue(name, { ...state, [name]: value });
        return onChange(event);
    };
    const getAllErrors = (property, vState = validationState) => {
        const errors = maybe_1.maybe(vState)
            .map(utilities_1.prop(property))
            .map(utilities_1.prop("errors"));
        return errors.isJust ? errors.join() : [];
    };
    const getError = (property, vState = validationState) => {
        const error = maybe_1.maybe(vState)
            .map(utilities_1.prop(property))
            .map(utilities_1.prop("errors"))
            .map(R.head);
        return error.isJust ? error.join() : "";
    };
    const getFieldValid = (property, vState = validationState) => {
        const valid = maybe_1.maybe(vState)
            .map(utilities_1.prop(property))
            .map(utilities_1.prop("isValid"));
        return valid.isJust ? valid.join() : true;
    };
    const isValid = (state = validationState) => {
        return R.reduce((acc, curr) => acc ? utilities_1.isPropertyValid(curr)(state) : acc, true, Object.keys(state));
    };
    const generateValidationErrors = (state) => {
        return R.reduce((acc, curr) => getError(curr) ? [...acc, getError(curr)] : acc, [], Object.keys(state));
    };
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