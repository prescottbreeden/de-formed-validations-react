# @De-Formed / React Validations

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
// PersonValidation.ts
import { useValidation } from '@de-formed/react-validations';

export const PersonValidation = () => {
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

### Step 2: Plug into React Component
```tsx
// PersonForm.component.tsx
import React from 'react';
import { PersonValidation } from './PersonValidation';

export const PersonForm = ({ person, onChange }) => {
  const {
    validateAll,
    validateOnChange,
    validateOnBlur
  } = PersonValidation();

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
        {v.getError('firstName') && <p>{v.getError('firstName')}</p>}
      </div>
      <div>
        <label>Last Name</label>
        <input
          name="lastName"
          onBlur={validateOnBlur(person)}
          onChange={validateOnChange(onChange, person)}
          value={person.lastName}
        />
        {v.getError('lastName') && <p>{v.getError('lastName')}</p>}
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
};
```
***

## Documentation

Check out the [documentation](https://github.com/prescottbreeden/de-formed-validations-react/wiki/Docs).

## Examples

More [examples](https://github.com/prescottbreeden/de-formed-validations-react/wiki/Examples) and CodeSandboxes.

## License

This project is licensed under the terms of the [MIT license](/LICENSE).
