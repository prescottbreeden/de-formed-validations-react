import { executeSideEffect } from '../utilities';
import {
  compose,
  prop,
  stringIsLessThan,
  stringIsMoreThan,
  stringIsNotEmpty
} from '..';
import { maybe } from '../maybe';

describe('compose', () => {
  it('composes functions into one func', () => {
    const add = (a: number) => (b: number) => a + b;
    const add3 = compose(
      add(1),
      add(2),
    );
    expect(add3(1)).toBe(4);
  });
});

describe('prop', () => {
  it('returns undefined if object is null or undefined', () => {
    expect(prop('dingo', null)).toBe(undefined);
    expect(prop('dingo', undefined)).toBe(undefined);
  });
});

describe('executeSideEffect', () => {
  it('returns argument if function returns undefined', () => {
    const sideEffect = (x: any) => undefined;
    const funcy = executeSideEffect(sideEffect, 42);
    expect(funcy).toBe(42);
  });
});

describe('maybe', () => {
  it('returns this if val is null', () => {
    const option = maybe(null);
    const result = option.map(prop('dingo'))
    expect(result.join()).toStrictEqual(maybe(null));
  });
});

describe('validation helpers', () => {
  describe('stringIsNotEmpty', () => {
    it('returns true if string has length', () => {
      expect(stringIsNotEmpty("dingo")).toBe(true);
    });
    it('returns false if string has no length', () => {
      expect(stringIsNotEmpty("")).toBe(false);
    });
    it('returns false if string has white space', () => {
      expect(stringIsNotEmpty(" ")).toBe(false);
    });
  });

  describe('stringIsLessThan', () => {
    it('returns true if string has length less than argument', () => {
      expect(stringIsLessThan(6, "dingo")).toBe(true);
    });
    it('returns false if string has more length than argument', () => {
      expect(stringIsLessThan(0, "f")).toBe(false);
    });
    it('trims whitespace', () => {
      expect(stringIsLessThan(2, " s")).toBe(true);
    });
  });

  describe('stringIsMoreThan', () => {
    it('returns true if string has more less than argument', () => {
      expect(stringIsMoreThan(5, "dingo")).toBe(false);
    });
    it('returns false if string has more length than argument', () => {
      expect(stringIsMoreThan(0, "f")).toBe(true);
    });
    it('trims whitespace', () => {
      expect(stringIsMoreThan(1, " s")).toBe(false);
    });
  });
});
