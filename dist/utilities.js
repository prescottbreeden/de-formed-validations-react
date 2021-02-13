"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringIsNotEmpty = exports.executeSideEffect = exports.isPropertyValid = exports.prop = exports.compose = void 0;
const ramda_1 = require("ramda");
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
exports.isPropertyValid = (property) => exports.compose(ramda_1.defaultTo(true), ramda_1.path([property, 'isValid']));
exports.executeSideEffect = curry((f, x) => f(x) || x);
exports.stringIsNotEmpty = exports.compose(ramda_1.gt(ramda_1.__, 0), ramda_1.length);
//# sourceMappingURL=utilities.js.map