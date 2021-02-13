import { executeSideEffect, prop } from '../utilities';
import { maybe } from '../maybe';

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
})

describe('maybe', () => {
  it('returns this if val is null', () => {
    const option = maybe(null);
    const result = option.map(prop('dingo'))
    expect(result.join()).toStrictEqual(maybe(null));
  });
})
