import { renderHook, act } from '@testing-library/react-hooks';
import { useValidation } from '../';
import { ValidationSchema, ValidationState } from '../types';

type TestSchema = {
  name: string;
  age: number;
  dingo: boolean;
  agreement: boolean;
};

const schema: ValidationSchema<TestSchema> = {
  name: [
    {
      error: 'Name is required.',
      validation: (state: TestSchema) => state.name.length > 0,
    },
    {
      error: 'Cannot be bob.',
      validation: (state: TestSchema) => state.name !== 'bob',
    },
    {
      error: 'Must be dingo.',
      validation: (state: TestSchema) => {
        return state.dingo ? state.name === 'dingo' : true;
      },
    },
  ],
  age: [
    {
      error: 'Must be 18',
      validation: (state: TestSchema) => state.age >= 18,
    },
  ],
  agreement: [
    {
      error: 'Must accept terms.',
      validation: ({ agreement }) => Boolean(agreement),
    },
  ],
};

const mockValidationState: ValidationState = {
  name: {
    isValid: true,
    errors: [],
  },
  age: {
    isValid: true,
    errors: [],
  },
  agreement: {
    isValid: true,
    errors: [],
  },
};

const defaultState = {
  name: 'jack',
  dingo: false,
  age: 42,
  agreement: true,
};

const failingState = {
  ...defaultState,
  name: 'bob',
  age: 15,
};

describe('useValidation tests', () => {
  it('should be defined', () => {
    expect(useValidation).toBeDefined();
  });

  it('renders the hook correctly and checks types', () => {
    const { result } = renderHook(() => useValidation(schema));
    expect(typeof result.current.getError).toBe('function');
    expect(typeof result.current.getFieldValid).toBe('function');
    expect(typeof result.current.isValid).toBe('boolean');
    expect(typeof result.current.validate).toBe('function');
    expect(typeof result.current.validateAll).toBe('function');
    expect(typeof result.current.validateAllIfTrue).toBe('function');
    expect(typeof result.current.validateIfTrue).toBe('function');
    expect(typeof result.current.validateOnBlur).toBe('function');
    expect(typeof result.current.validateOnChange).toBe('function');
    expect(typeof result.current.resetValidationState).toBe('function');
    expect(typeof result.current.setValidationState).toBe('function');
    expect(Array.isArray(result.current.validationErrors)).toBe(true);
    expect(typeof result.current.validationState).toBe('object');
  });

  describe('createValidationState', () => {
    it('crates a validation state when given a schema', () => {
      const { result } = renderHook(() => useValidation(schema));
      expect(result.current.validationState).toStrictEqual(mockValidationState);
    });

    it('defaults to an empty object if null or undefined is provided', () => {
      const { result } = renderHook(() => useValidation(null as any));
      expect(result.current.validationState).toStrictEqual({});
    });
  });

  describe('getError', () => {
    it('returns empty string by default', () => {
      const { result } = renderHook(() => useValidation(schema));
      const output = result.current.getError('name');
      expect(output).toBe('');
    });

    it('returns empty string if the property does not exist', () => {
      const { result } = renderHook(() => useValidation(schema));
      const output = result.current.getError('balls' as keyof TestSchema);
      expect(output).toBe('');
    });

    it('retrieves an error message', () => {
      const { result } = renderHook(() => useValidation(schema));
      act(() => {
        result.current.validate('name', { name: '' } as any);
      });
      const output = result.current.getError('name');
      expect(output).toBe('Name is required.');
    });
  });

  describe('getAllErrors', () => {
    it('returns empty array by default', () => {
      const { result } = renderHook(() => useValidation(schema));
      const output = result.current.getAllErrors('name');
      expect(output).toStrictEqual([]);
    });

    it('returns empty array if the property does not exist', () => {
      const { result } = renderHook(() => useValidation(schema));
      const output = result.current.getAllErrors('balls' as keyof TestSchema);
      expect(output).toStrictEqual([]);
    });

    it('retrieves array of all error messages', () => {
      const { result } = renderHook(() => useValidation(schema));
      const name = 'name';
      const state = {
        ...defaultState,
        name: '',
      };
      act(() => {
        result.current.validate(name, state);
      });
      const output = result.current.getAllErrors('name');
      expect(output).toStrictEqual(['Name is required.']);
    });
  });

  describe('getFieldValid', () => {
    it('returns true by default', () => {
      const { result } = renderHook(() => useValidation(schema));
      const output = result.current.getFieldValid('name');
      expect(output).toBe(true);
    });

    it('returns true if the property does not exist', () => {
      const { result } = renderHook(() => useValidation(schema));
      const output = result.current.getFieldValid('balls' as keyof TestSchema);
      expect(output).toBe(true);
    });

    it('retrieves an invalid state', () => {
      const { result } = renderHook(() => useValidation(schema));
      const name = 'name';
      const state = {
        ...defaultState,
        name: '',
      };
      act(() => {
        result.current.validate(name, state);
      });
      const output = result.current.getFieldValid('name');
      expect(output).toBe(false);
    });
  });

  describe('isValid', () => {
    it('returns true by default', () => {
      const { result } = renderHook(() => useValidation(schema));
      const output = result.current.isValid;
      expect(output).toBe(true);
    });

    it('changes to false after a validation fails', () => {
      const { result } = renderHook(() => useValidation(schema));
      const name = 'name';
      const state = {
        ...defaultState,
        name: 'bob',
      };
      act(() => {
        result.current.validate(name, state);
      });
      const output = result.current.isValid;
      expect(output).toBe(false);
    });

    it('changes to true after a failed validation passes', () => {
      const { result } = renderHook(() => useValidation(schema));
      const name = 'name';
      const state = {
        ...defaultState,
        name: 'bob',
      };
      const state2 = {
        ...defaultState,
        name: 'bob ross',
      };
      act(() => {
        result.current.validate(name, state);
        result.current.validate(name, state2);
      });
      const output = result.current.isValid;
      expect(output).toBe(true);
    });
  });

  describe('validate', () => {
    it('returns a boolean if key exists', () => {
      const { result } = renderHook(() => useValidation(schema));
      let output: any;
      const name = 'name';
      const state = {
        ...defaultState,
        name: 'bob',
      };
      act(() => {
        output = result.current.validate(name, state);
      });
      expect(typeof output).toBe('boolean');
    });

    it('returns true if key does not exist', () => {
      const { result } = renderHook(() => useValidation(schema));
      const name = 'balls' as keyof TestSchema;
      const state = {
        ...defaultState,
        name: 'bob',
      };
      let output: any;
      act(() => {
        output = result.current.validate(name, state);
      });
      expect(output).toBe(true);
    });

    it('updates the validationState when validation fails', () => {
      const { result } = renderHook(() => useValidation(schema));
      const validationState = {
        ...mockValidationState,
        name: {
          isValid: false,
          errors: ['Must be dingo.'],
        },
      };
      const name = 'name';
      const state = {
        ...defaultState,
        name: 'chuck',
        dingo: true,
      };
      act(() => {
        result.current.validate(name, state);
      });
      expect(result.current.isValid).toBe(false);
      expect(result.current.validationState).toStrictEqual(validationState);
    });
  });

  describe('validateAll', () => {
    it('returns a boolean', () => {
      const { result } = renderHook(() => useValidation(schema));
      let output: any;
      act(() => {
        output = result.current.validateAll(defaultState);
      });
      expect(typeof output).toBe('boolean');
    });

    it('returns true if validations pass', () => {
      const { result } = renderHook(() => useValidation(schema));
      let output: any;
      act(() => {
        output = result.current.validateAll(defaultState);
      });
      expect(output).toBe(true);
    });

    it('returns false if any validation fails', () => {
      const { result } = renderHook(() => useValidation(schema));
      act(() => {
        const output = result.current.validateAll(failingState);
        expect(output).toBe(false);
      });
    });
    it('returns all failing validations', () => {
      const { result } = renderHook(() => useValidation(schema));
      act(() => {
        result.current.validateAll(failingState);
      });
      expect(result.current.validationState).toStrictEqual({
        name: {
          errors: ['Cannot be bob.'],
          isValid: false,
        },
        age: {
          errors: ['Must be 18'],
          isValid: false,
        },
        agreement: {
          errors: [],
          isValid: true,
        },
      });
    });

    it('handles nested validation reductions', () => {
      const data = [defaultState, defaultState, defaultState];
      const { result } = renderHook(() => useValidation(schema));
      let output: boolean[];
      act(() => {
        output = data.map((s) => result.current.validateAll(s));
        expect(output).toStrictEqual([true, true, true]);
      });
    });

    it('validates a subsection of keys', () => {
      const { result } = renderHook(() => useValidation(schema));
      act(() => {
        result.current.validateAll(failingState);
      });
      expect(result.current.getError('age')).toBe('Must be 18');
      act(() => {
        result.current.validateAll(failingState, ['name']);
      });
      expect(result.current.getError('age')).toBe('Must be 18');
    });

    it('handles missing properties', () => {
      const wonkySchema = {
        ...schema,
        canSave: [
          {
            error: 'you cannot save',
            validation: (state: any) => !!state.name,
          },
        ],
      };
      const { result } = renderHook(() => useValidation(wonkySchema));
      act(() => {
        result.current.validateAll(failingState);
      });
      expect(result.current.getError('canSave')).toBe('');
    });
  });

  describe('validateAllIfTrue', () => {
    it('returns a boolean', () => {
      const { result } = renderHook(() => useValidation(schema));
      let output: any;
      act(() => {
        output = result.current.validateAllIfTrue(defaultState);
      });
      expect(typeof output).toBe('boolean');
    });

    it('returns true if validations pass', () => {
      const { result } = renderHook(() => useValidation(schema));
      let output: any;
      act(() => {
        output = result.current.validateAllIfTrue(defaultState);
      });
      expect(output).toBe(true);
    });

    it('ignores failing validations', () => {
      const { result } = renderHook(() => useValidation(schema));
      act(() => {
        const output = result.current.validateAllIfTrue(failingState);
        expect(output).toBe(true);
      });
    });

    it('handles nested validation reductions', () => {
      const data = [defaultState, defaultState, defaultState];
      const { result } = renderHook(() => useValidation(schema));
      let output: boolean[];
      act(() => {
        output = data.map((s) => result.current.validateAllIfTrue(s));
        expect(output).toStrictEqual([true, true, true]);
      });
    });

    it('validates a subsection of keys', () => {
      const { result } = renderHook(() => useValidation(schema));
      act(() => {
        result.current.validateAllIfTrue(failingState);
      });
      expect(result.current.getError('age')).toBe('');
      act(() => {
        result.current.validateAllIfTrue(failingState, ['name']);
      });
      expect(result.current.getError('age')).toBe('');
    });

    it('handles missing properties', () => {
      const wonkySchema = {
        ...schema,
        canSave: [
          {
            error: 'you cannot save',
            validation: (state: any) => !!state.name,
          },
        ],
      };
      const { result } = renderHook(() => useValidation(wonkySchema));
      act(() => {
        result.current.validateAllIfTrue(failingState);
      });
      expect(result.current.getError('canSave')).toBe('');
    });
  });

  describe('validateIfTrue', () => {
    it('returns a boolean if key exists', () => {
      const { result } = renderHook(() => useValidation(schema));
      let output: any;
      const name = 'name';
      const state = {
        ...defaultState,
        name: 'bob',
      };
      act(() => {
        output = result.current.validateIfTrue(name, state);
      });
      expect(typeof output).toBe('boolean');
    });

    it('returns true if key does not exist', () => {
      const { result } = renderHook(() => useValidation(schema));
      const name = 'balls' as keyof TestSchema;
      const state = {
        ...defaultState,
        name: 'bob',
      };
      let output: any;
      act(() => {
        output = result.current.validateIfTrue(name, state);
      });
      expect(output).toBe(true);
    });

    it('updates the validationState when validation fails', () => {
      const { result } = renderHook(() => useValidation(schema));
      const validationState = {
        ...mockValidationState,
      };
      const name = 'name';
      const state = {
        ...defaultState,
        name: 'chuck',
        dingo: true,
      };
      act(() => {
        result.current.validateIfTrue(name, state);
      });
      expect(result.current.isValid).toBe(true);
      expect(result.current.validationState).toStrictEqual(validationState);
    });

    it('updates the validationState when an invalid validation succeeds', () => {
      const { result } = renderHook(() => useValidation(schema));
      const state = {
        ...defaultState,
        name: 'bob',
      };
      const state2 = {
        ...defaultState,
        name: 'jack',
      };
      const validationState = {
        ...mockValidationState,
      };
      act(() => {
        result.current.validate('name', state);
      });
      expect(result.current.isValid).toBe(false);
      act(() => {
        result.current.validateIfTrue('name', state2);
      });
      expect(result.current.isValid).toBe(true);
      expect(result.current.validationState).toStrictEqual(validationState);
    });
  });

  describe('validateOnBlur', () => {
    it('returns a new function', () => {
      const { result } = renderHook(() => useValidation(schema));
      const state = defaultState;
      const handleBlur = result.current.validateOnBlur(state);
      expect(typeof handleBlur).toBe('function');
    });

    it('updates the valdiation state when called', () => {
      const { result } = renderHook(() => useValidation(schema));
      const state = defaultState;
      const handleBlur = result.current.validateOnBlur(state);
      const event = {
        target: {
          name: 'name',
          value: 'bob',
          dispatchEvent: new Event('blur'),
        },
      };
      act(() => {
        handleBlur(event as any);
      });
      expect(result.current.isValid).toBe(false);
    });
  });

  describe('validateOnChange', () => {
    it('returns a new function', () => {
      const { result } = renderHook(() => useValidation(schema));
      const state = defaultState;
      const onChange = (event: any) => 'bob ross';
      const handleChange = result.current.validateOnChange(onChange, state);
      expect(typeof handleChange).toBe('function');
    });

    it('updates the valdiation state if true and returns event', () => {
      const { result } = renderHook(() => useValidation(schema));
      const state = {
        ...defaultState,
        name: 'bob',
      };
      act(() => {
        result.current.validate('name', state);
      });
      expect(result.current.isValid).toBe(false);
      const onChange = () => 'bob ross';
      const handleChange = result.current.validateOnChange(onChange, state);
      const event = {
        target: {
          name: 'name',
          value: 'jack',
          dispatchEvent: new Event('change'),
        },
      };
      let output: any;
      act(() => {
        output = handleChange(event as any);
      });
      expect(result.current.isValid).toBe(true);
      expect(output).toBe('bob ross');
    });
    it('updates checked properties if true and returns event', () => {
      const { result } = renderHook(() => useValidation(schema));
      const state = {
        ...defaultState,
        agreement: false,
      };
      act(() => {
        result.current.validate('agreement', state);
      });
      expect(result.current.isValid).toBe(false);
      const onChange = () => true;
      const handleChange = result.current.validateOnChange(onChange, state);
      const event = {
        target: {
          name: 'agreement',
          checked: true,
          dispatchEvent: new Event('change'),
          type: 'checkbox',
        },
      };
      let output: any;
      act(() => {
        output = handleChange(event as any);
      });
      expect(result.current.isValid).toBe(true);
      expect(output).toBe(true);
    });
  });

  describe('resetValidationState', () => {
    it('resets the validation state', () => {
      const { result } = renderHook(() => useValidation(schema));
      const state = {
        ...defaultState,
        name: 'bob',
      };
      act(() => {
        result.current.validate('name', state);
        result.current.resetValidationState();
      });
      expect(result.current.isValid).toBe(true);
    });
  });

  describe('validationErrors', () => {
    it('starts as an empty array', () => {
      const { result } = renderHook(() => useValidation(schema));
      expect(result.current.validationErrors).toStrictEqual([]);
    });
    it('adds validation errors when validation state is invalid', () => {
      const { result } = renderHook(() => useValidation(schema));
      const state = {
        ...defaultState,
        name: 'bob',
      };
      act(() => {
        result.current.validate('name', state);
      });
      expect(result.current.validationErrors).toStrictEqual(['Cannot be bob.']);
    });
    it('removes validation errors when validation state is valid', () => {
      const { result } = renderHook(() => useValidation(schema));
      const state = {
        ...defaultState,
        name: 'bob',
      };
      const state2 = {
        ...defaultState,
        name: 'jack',
      };
      act(() => {
        result.current.validate('name', state);
        result.current.validate('name', state2);
      });
      expect(result.current.validationErrors).toStrictEqual([]);
    });
  });

  describe('forceValidationState', () => {
    it('overrides the existing validation state with a new one', () => {
      const { result: v1 } = renderHook(() => useValidation(schema));
      const { result: v2 } = renderHook(() => useValidation(schema));
      act(() => {
        v1.current.validateAll(failingState);
      });
      act(() => {
        v2.current.setValidationState(v1.current.validationState);
      });
      expect(v1.current.validationState).toStrictEqual(
        v2.current.validationState,
      );
    });
  });
});
