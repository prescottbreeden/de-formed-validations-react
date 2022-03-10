<p align="center">
  <img src="https://user-images.githubusercontent.com/35798153/157611790-96f35e8b-ee4f-44e4-b3c9-1864900a02f2.png" />
</p>

[![npm version](https://badge.fury.io/js/@de-formed%2Freact-validations.svg)](https://badge.fury.io/js/@de-formed%2Freact-validations)
[![Known Vulnerabilities](https://snyk.io/test/github/prescottbreeden/de-formed/badge.svg)](https://snyk.io/test/github/prescottbreeden/de-formed)
![example workflow](https://github.com/prescottbreeden/de-formed/actions/workflows/main.yml/badge.svg)
[![codecov](https://codecov.io/gh/prescottbreeden/de-formed/branch/main/graph/badge.svg?token=a1u71NhJwb)](https://codecov.io/gh/prescottbreeden/de-formed)
![size](https://img.shields.io/bundlephobia/minzip/@de-formed/base)

@De-Formed Validations offers a robust and unopinionated API to customize form and data validations. With only a handful of properties to learn, @de-formed maintains its own internal state with simple function calls so that you can design your architecture the way you want to.

## Why Use De-Formed?

1. Modular and Composable.
2. Unopinionated and Customizable.
3. Lightweight.
4. Easy to use.

## Install

```
yarn add @de-formed/react-validations
```

```
npm i @de-formed/react-validations
```

## Basic Usage

### Step 1: Create a file to define your validations.

```ts
// usePersonValidation.ts
import { useValidation } from '@de-formed/react-validations';

export const usePersonValidation = () => {
  return useValidation<Person>({
    firstName: [
      {
        error: 'First Name is required.',
        validation: ({ firstName }) => firstName.length > 0,
      },
      {
        error: 'First Name cannot be longer than 20 characters.',
        validation: ({ firstName }) => firstName.length <= 20,
      },
    ],
    lastName: [
      {
        error: 'Last Name is required.',
        validation: ({ lastName }) => lastName.length > 0,
      },
      {
        error: 'Last Name cannot be longer than 20 characters.',
        validation: ({ lastName }) => lastName.length <= 20,
      },
      {
        error: 'Must be Ross if fist name is Bob.',
        validation: ({ firstName, lastName }) => {
          return firstName === 'Bob' ? lastName === 'Ross' : true;
        },
      },
    ],
  });
};
```

### Step 2: Use the hook anywhere you need it.

```tsx
// PersonForm.component.tsx
import React from 'react';
import { usePersonValidation } from './usePersonValidation';

export const PersonForm = ({ person, onChange }) => {
  const {
    getError,
    validateAll,
    validateOnChange,
    validateOnBlur
  } = usePersonValidation();

  const handleSubmit = () => {
    if (validateAll(person) {
      // submit logic
    }
  };

  return (
    <>
      <div>
        <label>First Name</label>
        <input
          name="firstName"
          onBlur={validateOnBlur(person)}
          onChange={validateOnChange(onChange, person)}
          value={person.firstName}
        />
        {getError('firstName') && <p>{getError('firstName')}</p>}
      </div>
      <div>
        <label>Last Name</label>
        <input
          name="lastName"
          onBlur={validateOnBlur(person)}
          onChange={validateOnChange(onChange, person)}
          value={person.lastName}
        />
        {getError('lastName') && <p>{getError('lastName')}</p>}
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
};
```

---

## Documentation

Check out the [documentation](https://github.com/prescottbreeden/de-formed-validations-react/wiki/Docs).

## Examples

More [examples](https://github.com/prescottbreeden/de-formed-validations-react/wiki/Examples) and CodeSandboxes.

## License

This project is licensed under the terms of the [MIT license](/LICENSE).
