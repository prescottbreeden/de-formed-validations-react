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
    return new base_1.BaseValidation(validationSchema, validationState, setValidationState);
};
exports.useValidation = useValidation;
//# sourceMappingURL=index.js.map