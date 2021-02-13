"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validation = void 0;
const utilities_1 = require("../utilities");
const ramda_1 = require("ramda");
class Validation {
    constructor(props) {
        this.createValidationsState = (schema) => {
            return ramda_1.reduce((acc, item) => ({
                ...acc,
                [item]: {
                    isValid: true,
                    errors: [],
                },
            }), {}, Object.keys(schema));
        };
        this.resetValidationState = () => {
            this._validationState = this.createValidationsState(this._validationSchema);
        };
        this.forceValidationState = (newValidationState) => {
            this._validationState = newValidationState;
        };
        this.allValid = (state) => {
            const keys = Object.keys(state);
            const valid = ramda_1.reduce((acc, current) => {
                return acc ? utilities_1.isPropertyValid(current, this._validationState) : acc;
            }, true, keys);
            return valid;
        };
        this.runAllValidators = (property, state) => {
            const runValidator = utilities_1.compose((func) => func(state), utilities_1.prop('validation'));
            const bools = ramda_1.map(runValidator, utilities_1.prop(property, this._validationSchema));
            const allValidationsValid = utilities_1.all(bools);
            const errors = bools.reduce((acc, curr, idx) => {
                const errorOf = utilities_1.compose(utilities_1.prop('errorMessage'), utilities_1.prop(idx), utilities_1.prop(property));
                return curr ? acc : [...acc, errorOf(this._validationSchema)];
            }, []);
            return {
                [property]: {
                    isValid: allValidationsValid,
                    errors: allValidationsValid ? [] : errors,
                },
            };
        };
        this.getError = (property) => {
            if (property in this._validationSchema) {
                const val = utilities_1.compose(ramda_1.head, utilities_1.prop('errors'), utilities_1.prop(property));
                return val(this._validationState) ? val(this._validationState) : '';
            }
            return '';
        };
        this.getAllErrors = (property) => {
            if (property in this._validationSchema) {
                const val = utilities_1.compose(utilities_1.prop('errors'), utilities_1.prop(property));
                return val(this._validationState);
            }
            return [];
        };
        this.getFieldValid = (property, vState = this._validationState) => {
            if (property in this._validationSchema) {
                return utilities_1.isPropertyValid(property, vState);
            }
            return true;
        };
        this.validate = (property, state) => {
            if (property in this._validationSchema) {
                const validations = this.runAllValidators(property, state);
                this._validationState = {
                    ...this._validationState,
                    ...validations,
                };
                return utilities_1.isPropertyValid(property, validations);
            }
            return true;
        };
        this.validateAll = (state, props) => {
            const newState = ramda_1.reduce((acc, property) => {
                return { ...acc, ...this.runAllValidators(property, state) };
            }, {}, props !== null && props !== void 0 ? props : Object.keys(this._validationSchema));
            this._validationState = newState;
            return this.allValid(newState);
        };
        this.validateCustom = (customValidations) => {
            const zip = ramda_1.converge(this.runAllValidators, [
                utilities_1.prop('key'),
                utilities_1.prop('value'),
                utilities_1.prop('state'),
            ]);
            const state = ramda_1.reduce((acc, current) => {
                return {
                    ...acc,
                    ...zip(current),
                };
            }, {}, customValidations);
            this._validationState = state;
            return this.allValid(state);
        };
        this.validateIfTrue = (property, state) => {
            if (property in this._validationSchema) {
                const validations = this.runAllValidators(property, state);
                if (utilities_1.isPropertyValid(property, validations)) {
                    const updated = { ...this._validationState, ...validations };
                    this._validationState = updated;
                }
                return utilities_1.isPropertyValid(property, validations);
            }
            return true;
        };
        this.validateOnBlur = (state) => {
            return (event) => {
                const { value, name } = event.target;
                this.validate(name, { ...state, [name]: value });
            };
        };
        this.validateOnChange = (onChange, state) => {
            return (event) => {
                const { value, name } = event.target;
                this.validateIfTrue(name, { ...state, [name]: value });
                return onChange(event);
            };
        };
        this._validationSchema = props;
        this._validationState = this.createValidationsState(props);
    }
    get isValid() {
        return this.allValid(this._validationState);
    }
    get validationErrors() {
        const props = Object.keys(this._validationState);
        const errors = ramda_1.reduce((acc, curr) => {
            const err = this.getError(curr);
            return err ? [...acc, err] : acc;
        }, [], props);
        return errors;
    }
    get validationState() {
        return this._validationState;
    }
}
exports.Validation = Validation;
//# sourceMappingURL=validation.js.map