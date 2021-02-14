# @De-Formed Validations

@De-Formed Validations is a react hook that offers a robust and unopinionated event-driven API to customize form and data validations. With only a handful of properties to learn, @de-formed maintains its own internal state with simple function calls so that you can design your architecture the way you want to.

## Why Use De-Formed?

1. Modular, Composable, and Scalable.
2. Unopinionated and Customizable.
3. Lightweight (1.6 kb gzipped).
3. Easy to use and test.

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
## A Different, Functional, Event Driven Approach
One of the biggest differences you will notice with @De-formed is it has no property or state for the concept of "touched". The problem with touched is most concisely put in that it obstructs event customization around validations. If you are building validations around the user's behavior, it also happens to be a completely useless property. The documentation for @De-formed guides you through setting up validations that only remove errors on change events but validate on blur and submit; however, you can customize the behavior any way you wish.

Importantly, all validations are de-coupled from your form architecture allowing them to be executed, reused, and composed together in any context necessary. Just define as many functions as you want in your schema and then execute them on whichever events you choose. This provides you with a function-based, modular approach to design validation patterns that meet your requirements without the hassle of managing the validation data yourself.

## Documentation

Check out the [documentation](https://github.com/prescottbreeden/de-formed-validations-react/wiki/Docs).

## Examples

More [examples](https://github.com/prescottbreeden/de-formed-validations-react/wiki/Examples) and CodeSandboxes.

## Coverage
![coverage](https://github.com/prescottbreeden/de-formed-validations-react/blob/master/coverage.png?raw=true)

## License

This project is licensed under the terms of the [MIT license](/LICENSE).
