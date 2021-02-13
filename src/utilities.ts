import * as R from 'ramda';

//  curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
function curry(fn: any) {
  const arity = fn.length;

  return function $curry(...args: any[]): any {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}

//  compose :: ((a -> b), (b -> c),  ..., (y -> z)) -> a -> z
export const compose = (...fns: any[]) => (...args: any[]) =>
  fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

//  prop :: String -> {a} -> [a | Undefined]
export const prop = curry((p: string, obj: any) => (obj ? obj[p] : undefined));

export const isPropertyValid = <S>(property: keyof S): any => compose(
  R.defaultTo(true),
  R.path([property as any, 'isValid'])
);

export const executeSideEffect = curry((f: any, x: any) => f(x) || x);

// -- validation helper utils --
// stringIsNotEmpty :: string -> boolean
export const stringIsNotEmpty = compose(
  R.gt(R.__, 0),
  R.length,
  R.trim
);

// stringIsLessThan :: number -> string -> boolean
export const stringIsLessThan = curry((num: number, str: string) => {
  return compose(
    R.lt(R.__, num),
    R.length,
    R.trim
  )(str);
});

// stringIsMoreThan :: number -> string -> boolean
export const stringIsMoreThan = curry((num: number, str: string) => {
  return compose(
    R.gt(R.__, num),
    R.length,
    R.trim
  )(str);
});
