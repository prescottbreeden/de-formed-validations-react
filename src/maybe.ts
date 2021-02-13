export class Maybe {
  $value: any;

  get isNothing() {
    return this.$value === null || this.$value === undefined;
  }

  get isJust() {
    return !this.isNothing;
  }

  constructor(x: any) {
    this.$value = x;
  }

  // ----- Pointed Maybe
  static of(x: any) {
    return new Maybe(x);
  }

  // ----- Functor Maybe
  map(fn: any) {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }

  // ----- Applicative Maybe
  // ap(f: any) {
  //   return this.isNothing ? this : f.map(this.$value);
  // }

  // ----- Monad Maybe
  chain(fn: any) {
    return this.map(fn).join();
  }

  join() {
    return this.isNothing ? this : this.$value;
  }

  // ----- Traversable Maybe
  // sequence(of: any) {
  //   return this.traverse(of, (x: any) => x);
  // }

  // traverse(of: any, fn: any) {
  //   return this.isNothing ? of(this) : fn(this.$value).map(Maybe.of);
  // }
}
export const maybe = (x: any) => Maybe.of(x);
