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
exports.stringIsMoreThan = exports.stringIsLessThan = exports.stringIsNotEmpty = exports.executeSideEffect = exports.isPropertyValid = exports.prop = exports.compose = void 0;
const R = __importStar(require("ramda"));
function curry(fn) {
    const arity = fn.length;
    return function $curry(...args) {
        if (args.length < arity) {
            return $curry.bind(null, ...args);
        }
        return fn.call(null, ...args);
    };
}
exports.compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];
exports.prop = curry((p, obj) => (obj ? obj[p] : undefined));
exports.isPropertyValid = (property) => exports.compose(R.defaultTo(true), R.path([property, 'isValid']));
exports.executeSideEffect = curry((f, x) => f(x) || x);
exports.stringIsNotEmpty = exports.compose(R.gt(R.__, 0), R.length, R.trim);
exports.stringIsLessThan = curry((num, str) => {
    return exports.compose(R.lt(R.__, num), R.length, R.trim)(str);
});
exports.stringIsMoreThan = curry((num, str) => {
    return exports.compose(R.gt(R.__, num), R.length, R.trim)(str);
});
//# sourceMappingURL=utilities.js.map