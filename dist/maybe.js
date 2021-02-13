"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybe = exports.Maybe = void 0;
class Maybe {
    constructor(x) {
        this.$value = x;
    }
    get isNothing() {
        return this.$value === null || this.$value === undefined;
    }
    get isJust() {
        return !this.isNothing;
    }
    static of(x) {
        return new Maybe(x);
    }
    map(fn) {
        return this.isNothing ? this : Maybe.of(fn(this.$value));
    }
    chain(fn) {
        return this.map(fn).join();
    }
    join() {
        return this.isNothing ? this : this.$value;
    }
}
exports.Maybe = Maybe;
exports.maybe = (x) => Maybe.of(x);
//# sourceMappingURL=maybe.js.map