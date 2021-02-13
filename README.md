# @De-Formed Validations

@De-Formed Validations is a react hook that offers a robust and unopinionated API to customize form and data validations. With only a handful of properties to learn, @de-formed maintains its own internal state with simple function calls so that you can design your architecture the way you want to.

## Why Use De-Formed?

1. Modular, Composable, and Scalable.
2. Unopinionated.
3. Lightweight and Suckless (less than 2kb gzipped).
3. Easy to use and test.

## Install
```
yarn add @de-formed/react-validations
```
```
npm i @de-formed/react-validations
```
## React Usage

### Step 1: Create a file to define your validations.
```ts
// PersonValidation.ts
import { useValidation } from '@de-formed/react-validations';

export const PersonValidation = () => {
  return useValidation<Person>({
    firstName: [
      {
        error: 'First Name is required.',
        validation: (person: Person) => person.firstName.length > 0,
      },
      {
        error: 'First Name cannot be longer than 20 characters.',
        validation: (person: Person) => person.firstName.length <= 20,
      },
    ],
    lastName: [
      {
        error: 'Last Name is required.',
        validation: (person: Person) => person.lastName.length > 0,
      },
      {
        error: 'Last Name cannot be longer than 20 characters.',
        validation: (person: Person) => person.lastName.length <= 20,
      },
      {
        error: 'Must be Ross if fist name is Bob.',
        validation: (person: Person) => {
          return person.firstName === 'Bob' ? person.lastName === 'Ross' : true;
        },
      },
    ],
  });
};
```

### Step 2: Plug into React Component
```tsx
// PersonForm.component.tsx
import React from 'react';
import { PersonValidation } from './PersonValidation';

export const PersonForm = ({ person, onChange }) => {
  const v = PersonValidation();

  const handleChange = v.validateOnChange(onChange, person);
  const handleBlur = v.validateOnBlur(person);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const canSubmit = v.validateAll(person);
    if (canSubmit) {
      // submit logic
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name</label>
        <input
          name="firstName"
          onBlur={handleBlur}
          onChange={handleChange}
          value={person.firstName}
        />
        {v.getError('firstName') && <p>{v.getError('firstName')}</p>}
      </div>
      <div>
        <label>Last Name</label>
        <input
          name="lastName"
          onBlur={handleBlur}
          onChange={handleChange}
          value={person.lastName}
        />
        {v.getError('lastName') && <p>{v.getError('lastName')}</p>}
      </div>
      <button>Submit</button>
    </form>
  );
};
```
## A Different, Functional Approach
@De-formed generates validations by calling an array of error/validation function objects that define the exact requirements for a given property. Just define the error you want to generate when a given function returns false and then bind the validation state to your DOM with the available interfaces. @De-formed aims to offer a higher level of customizability in validation behavior than other validations by providing the ability to read and manipulate the validation state outside of input events. Simply call or compose validation functions with the rest of your component logic to handle your business requirements without needing to sacrifice a goat or kidney to the Form-Gods.

Importantly, all validations are de-coupled from your form architecture allowing them to be executed, reused, and composed together in any context necessary. Just define as many functions as you want in your schema and then execute them on whichever events you choose. This provides you with a function-based, modular approach to design validation patterns that meet your requirements without the hassle of managing the validation data yourself.

## Documentation

Check out the [documentation](https://github.com/prescottbreeden/de-formed-validations/wiki/Docs).

## Examples

More [examples](https://github.com/prescottbreeden/de-formed-validations/wiki/Examples) and CodeSandboxes.

## Coverage
![coverage](https://github.com/prescottbreeden/de-formed-validations-react/blob/master/coverage.png?raw=true)

## License

This project is licensed under the terms of the [MIT license](/LICENSE).
