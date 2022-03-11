<p align="center">
  <img src="https://user-images.githubusercontent.com/35798153/157611790-96f35e8b-ee4f-44e4-b3c9-1864900a02f2.png" />
</p>

[![npm version](https://badge.fury.io/js/@de-formed%2Freact-validations.svg)](https://badge.fury.io/js/@de-formed%2Freact-validations)
[![Known Vulnerabilities](https://snyk.io/test/github/prescottbreeden/de-formed-validations-react/badge.svg)](https://snyk.io/test/github/prescottbreeden/de-formed-validations-react)
![example workflow](https://github.com/prescottbreeden/de-formed-validations-react/actions/workflows/main.yml/badge.svg)
[![codecov](https://codecov.io/gh/prescottbreeden/de-formed-validations-react/branch/main/graph/badge.svg?token=7MPA6NZZDD)](https://codecov.io/gh/prescottbreeden/de-formed-validations-react)
![size](https://img.shields.io/bundlephobia/minzip/@de-formed/react-validations)

## What is De-Formed?
De-Formed Validations offers a robust and unopinionated API to customize form and data validations. With only a handful of properties to learn, De-Formed maintains its own internal state with simple function calls so that you can design your architecture the way you want to.

## Forms and validations are an architecture problem, not a syntax problem

De-Formed was initially developed during the creation of a government website that involved hundreds of forms. Outside of the occasional navigation menu, the entirety of the web-app was either a form, a nested form, or a form in a series of other forms in the process of filling out one of the multitudes of applications or data entry by government employees. Initially, we implemented various popular form libraries. However we continued to find edge-cases and complexity around desirable user experiences that these libraries did not have straightforward ways of addressing. We realized then that the problem we hoped to address with a form library was an architecture problem, not a syntax problem, and form libraries tend to enforce the latter while restricting the former.

## Why Use De-Formed?

1. Modular, Composable, and Scalable
2. Unopinionated and Customizable to the Moon 🚀
3. Lightweight and Fast (~10x smaller than Formik, ~6x smaller than React Hook Form)
4. Easy to Use, Easy to Test

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

## Getting Started

Visit the wiki to get a step by step [walkthrough](https://github.com/prescottbreeden/de-formed-validations-react/wiki/Getting-Started) of how to customize De-Formed to the moon 🚀

## Documentation

API [documentation](https://github.com/prescottbreeden/de-formed-validations-react/wiki/Docs).

## Examples

More [examples](https://github.com/prescottbreeden/de-formed-validations-react/wiki/Examples) and CodeSandboxes.

## License

This project is licensed under the terms of the [MIT license](/LICENSE).
