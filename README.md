<p align="center">
  <img src="https://user-images.githubusercontent.com/35798153/157611790-96f35e8b-ee4f-44e4-b3c9-1864900a02f2.png" />
</p>

[![npm version](https://badge.fury.io/js/@de-formed%2Freact-validations.svg)](https://badge.fury.io/js/@de-formed%2Freact-validations)
[![Known Vulnerabilities](https://snyk.io/test/github/prescottbreeden/de-formed-validations-react/badge.svg)](https://snyk.io/test/github/prescottbreeden/de-formed-validations-react)
![example workflow](https://github.com/prescottbreeden/de-formed-validations-react/actions/workflows/main.yml/badge.svg)
[![codecov](https://codecov.io/gh/prescottbreeden/de-formed-validations-react/branch/main/graph/badge.svg?token=7MPA6NZZDD)](https://codecov.io/gh/prescottbreeden/de-formed-validations-react)
![size](https://img.shields.io/bundlephobia/minzip/@de-formed/react-validations)

## What is De-Formed?

De-Formed is a library for designing modular, event-driven form and data validations. Bind the things you need; ignore the things you don't. De-Formed will take care of the rest so that you can design your architecture the way you want to.

## Why Use De-Formed?

1. **Modular** - decoupled from your form architecture.
1. **Composable** - turn your validations and forms into Lego bricks.
1. **Extendable** - add/modify the API as you see fit
1. **Unopinionated** - customize your UX to the Moon 🚀
1. **Lightweight** - [compare it on bundlephobia](https://bundlephobia.com/package/@de-formed/react-validations)
1. **Easy to Use** - its all functions
1. **Easy to Test** - unit test your business logic

## Install

```
yarn add @de-formed/react-validations
```

```
npm i @de-formed/react-validations
```

## Basic Usage

### Step 1: Define a hook/schema for your validations

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
    ],
    lastName: [
      {
        error: 'Last Name is required.',
        validation: ({ lastName }) => lastName.length > 0,
      },
    ],
  });
};
```

---

### Step 2: Use the hook anywhere.

Bind the things you need; ignore the things you don't. De-Formed will take care of the rest.

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

## Validation Schema

The validation schema is on object that defines a list of validation rules for
any given key. Each validation rule consists of the `error` to display to a
user and a function that returns true or false. Error messages can be passed a
function to generate dynamic error messages depending on the state of the data.
Keys that match the keys of an object will be automatically detected when using
`validateAll`.

```ts
{
  email: [
    {
      error: 'Email is required.',
      validation: ({ email }) => email.trim().length > 0,
    },
    {
    error: ({ email }) => `${email} must be a valid email.`,
      validation: ({ email, name }) =>
        name === 'bob ross' ? email === 'bob.ross@gmail.com' : true
    },
  ],
}

```

---

## Getting Started

Guided [walkthrough](https://github.com/prescottbreeden/de-formed-validations-react/wiki/Getting-Started) of how to customize De-Formed to the moon 🚀

## Documentation

API [documentation](https://github.com/prescottbreeden/de-formed-validations-react/wiki/Docs).

## Examples

More [examples](https://github.com/prescottbreeden/de-formed-validations-react/wiki/Examples) and CodeSandboxes.

## License

This project is licensed under the terms of the [MIT license](/LICENSE).
